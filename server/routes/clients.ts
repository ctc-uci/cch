import { Router } from "express";

import { findUnassignedSessionIdsMatchingClient } from "../common/clientMatching";
import {
  createClient,
  deleteClient,
  type ClientFields,
  updateClient,
} from "../common/clientStore";
import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const clientsRouter = Router();

async function getQuestionMap(): Promise<Map<string, number>> {
  const questions = await db.query(`SELECT id, field_key FROM form_questions WHERE form_id = 5`);
  return new Map<string, number>(
    (questions as { id: number; field_key: string }[]).map((q) => [q.field_key, q.id])
  );
}

async function getOrCreateSession(clientId: number | string): Promise<string> {
  const rows = await db.query(
    `SELECT session_id FROM intake_responses WHERE client_id = $1 AND form_id = 5 LIMIT 1`,
    [clientId]
  );
  if (rows.length > 0) return (rows[0] as { session_id: string }).session_id;
  return (await db.query("SELECT uuid_generate_v4() as sid"))[0].sid;
}

async function upsertResponse(
  clientId: number | string,
  questionId: number,
  value: unknown,
  sessionId: string
): Promise<void> {
  const val =
    value !== null && value !== undefined && String(value).trim() !== ""
      ? String(value).trim()
      : null;
  await db.query(
    `INSERT INTO intake_responses (client_id, question_id, response_value, session_id, form_id)
     VALUES ($1, $2, $3, $4, 5)
     ON CONFLICT (client_id, question_id) WHERE form_id = 5 AND client_id IS NOT NULL
     DO UPDATE SET response_value = EXCLUDED.response_value
     WHERE EXCLUDED.response_value IS NOT NULL`,
    [clientId, questionId, val, sessionId]
  );
}

clientsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await db.query(
      `SELECT c.*, cm.first_name AS case_manager_first_name, cm.last_name AS case_manager_last_name
       FROM clients c
       LEFT JOIN case_managers cm ON c.created_by = cm.id
       WHERE c.id = $1`,
      [id]
    );
    res.status(200).json(keysToCamel(rows));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clientsRouter.get("/", async (req, res) => {
  try {
    const { search, page, filter } = req.query;

    let queryStr = `
      SELECT c.*, cm.first_name AS case_manager_first_name, cm.last_name AS case_manager_last_name
      FROM clients c
      LEFT JOIN case_managers cm ON c.created_by = cm.id
      WHERE 1=1`;

    const params: unknown[] = [];

    if (search) {
      params.push(`%${String(search)}%`);
      const n = params.length;
      // Search all response_value fields dynamically — no hardcoded column list needed.
      // response_value is stored as TEXT so no casting required.
      queryStr += ` AND (
        c.id::TEXT ILIKE $${n}
        OR EXISTS (
          SELECT 1 FROM intake_responses ir
          WHERE ir.client_id = c.id AND ir.form_id = 5
            AND ir.response_value ILIKE $${n}
        )
        OR cm.first_name ILIKE $${n}
        OR cm.last_name ILIKE $${n}
      )`;
    }

    if (filter) {
      queryStr += ` AND ${filter}`;
    }

    queryStr += " ORDER BY c.id DESC";

    if (page) {
      queryStr += ` LIMIT ${page}`;
    }

    const clients = await db.query(queryStr, params);
    res.status(200).json(keysToCamel(clients));
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

clientsRouter.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;

    let clients = await db.query(
      `SELECT c.*, cm.first_name AS case_manager_first_name, cm.last_name AS case_manager_last_name
       FROM clients c
       LEFT JOIN case_managers cm ON c.created_by = cm.id
       WHERE c.email COLLATE "C" = $1`,
      [email]
    );

    if (clients.length === 0) {
      const intakeRows = await db.query(
        `SELECT * FROM intake_statistics_form WHERE email COLLATE "C" = $1 ORDER BY id DESC LIMIT 1`,
        [email]
      );

      if (intakeRows.length > 0) {
        const i = intakeRows[0];
        const sub = (s: string | null | undefined, maxLen: number) =>
          (s !== null && s !== undefined ? String(s).trim() : "").slice(0, maxLen);

        const priorLiving =
          i.prior_living_situation !== null && i.prior_living_situation !== undefined
            ? String(i.prior_living_situation)
            : "";
        const homelessnessLength = parseInt(String(i.duration_homeless || "0"), 10) || 0;

        await createClient({
          created_by: i.cm_id,
          unit_name: "",
          grant:
            i.client_grant !== null && i.client_grant !== undefined
              ? String(i.client_grant)
              : null,
          status: "Active",
          first_name: sub(i.first_name, 16),
          last_name: sub(i.last_name, 16),
          date_of_birth: i.birthday,
          age: i.age ?? 0,
          phone_number: sub(i.phone_number, 10),
          email: sub(i.email, 32),
          emergency_contact_name: sub(i.emergency_contact_name, 32),
          emergency_contact_phone_number: sub(i.emergency_contact_phone_number, 10),
          medical: i.medical ?? false,
          entrance_date: i.entry_date,
          estimated_exit_date: i.entry_date,
          exit_date: null,
          bed_nights: 0,
          bed_nights_children: 0,
          pregnant_upon_entry: i.pregnant ?? false,
          disabled_children: (i.number_of_children_with_disability ?? 0) > 0,
          ethnicity: i.ethnicity,
          race: i.race,
          city_of_last_permanent_residence: sub(i.city_last_permanent_address, 256),
          prior_living: sub(priorLiving, 256),
          prior_living_city: sub(i.last_city_resided, 256),
          shelter_in_last_five_years: i.been_in_shelter_last_5_years ?? false,
          homelessness_length: homelessnessLength,
          chronically_homeless: i.chronically_homeless ?? false,
          attending_school_upon_entry: i.attending_school_upon_entry ?? false,
          employement_gained: false,
        });
        clients = await db.query(
          `SELECT * FROM clients WHERE email COLLATE "C" = $1`,
          [email]
        );
      }
    }

    res.status(200).json(keysToCamel(clients));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Creates a client from the dynamic Add Client drawer form.
clientsRouter.post("/from-form", async (req, res) => {
  try {
    const { responses } = req.body as {
      client?: Record<string, unknown>;
      responses: { question_id: number; response_value: string }[];
    };

    const clientResult = await db.query(`INSERT INTO clients_base DEFAULT VALUES RETURNING id`);
    const newClientId: number = clientResult[0].id;

    const sessionResult = await db.query("SELECT uuid_generate_v4() as session_id");
    const sessionId: string = sessionResult[0].session_id;

    if (Array.isArray(responses) && responses.length > 0) {
      for (const { question_id, response_value } of responses) {
        await upsertResponse(newClientId, question_id, response_value, sessionId);
      }
    }

    try {
      const questionIds = responses.map((r) => r.question_id);
      const questionRows =
        questionIds.length > 0
          ? await db.query(
              `SELECT id, field_key FROM form_questions WHERE id = ANY($1::int[])`,
              [questionIds]
            )
          : [];
      const idToFieldKey = new Map<number, string>(
        (questionRows as { id: number; field_key: string }[]).map((q) => [q.id, q.field_key])
      );
      const byFieldKey: Record<string, string> = {};
      for (const { question_id, response_value } of responses) {
        const fk = idToFieldKey.get(question_id);
        if (fk && response_value) byFieldKey[fk] = response_value;
      }
      const matchingSessionIds = await findUnassignedSessionIdsMatchingClient({
        firstName: byFieldKey["first_name"] ?? null,
        lastName: byFieldKey["last_name"] ?? null,
        phoneNumber: byFieldKey["phone_number"] ?? null,
        dateOfBirth: byFieldKey["date_of_birth"] ?? null,
      });
      if (matchingSessionIds.length > 0) {
        await db.query(
          `UPDATE intake_responses
           SET client_id = $1, updated_at = CURRENT_TIMESTAMP
           WHERE client_id IS NULL AND session_id = ANY($2::uuid[])`,
          [newClientId, matchingSessionIds]
        );
      }
    } catch (linkErr) {
      console.error("Link surveys to new client failed (non-fatal):", linkErr);
    }

    res.status(200).json({ id: newClientId, session_id: sessionId });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clientsRouter.post("/", async (req, res) => {
  try {
    const {
      created_by, unit_name, grant, status, first_name, last_name,
      date_of_birth, age, phone_number, email,
      emergency_contact_name, emergency_contact_phone_number, medical,
      entrance_date, estimated_exit_date, exit_date,
      bed_nights, bed_nights_children, pregnant_upon_entry, disabled_children,
      ethnicity, race, city_of_last_permanent_residence, prior_living, prior_living_city,
      shelter_in_last_five_years, homelessness_length, chronically_homeless,
      attending_school_upon_entry, employement_gained, reason_for_leaving,
      specific_reason_for_leaving, specific_destination, savings_amount,
      attending_school_upon_exit, reunified, successful_completion, destination_city, comments,
    } = req.body;

    const newClientId = await createClient({
      created_by, unit_name,
      grant: grant !== null && grant !== undefined && String(grant).trim() !== "" ? String(grant).trim() : null,
      status, first_name, last_name, date_of_birth, age, phone_number, email,
      emergency_contact_name, emergency_contact_phone_number, medical,
      entrance_date, estimated_exit_date, exit_date,
      bed_nights, bed_nights_children, pregnant_upon_entry, disabled_children,
      ethnicity, race, city_of_last_permanent_residence, prior_living, prior_living_city,
      shelter_in_last_five_years, homelessness_length, chronically_homeless,
      attending_school_upon_entry, employement_gained, reason_for_leaving,
      specific_reason_for_leaving, specific_destination, savings_amount,
      attending_school_upon_exit, reunified, successful_completion, destination_city, comments,
    });

    if (newClientId) {
      try {
        const matchingSessionIds = await findUnassignedSessionIdsMatchingClient({
          firstName: first_name,
          lastName: last_name,
          phoneNumber: phone_number,
          dateOfBirth: date_of_birth,
        });
        if (matchingSessionIds.length > 0) {
          await db.query(
            `UPDATE intake_responses SET client_id = $1, updated_at = CURRENT_TIMESTAMP WHERE client_id IS NULL AND session_id = ANY($2::uuid[])`,
            [newClientId, matchingSessionIds]
          );
        }
      } catch (linkErr) {
        console.error("Link surveys to new client failed (non-fatal):", linkErr);
      }
    }

    res.status(200).json({ id: newClientId });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clientsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await updateClient(Number(id), req.body as ClientFields);
    res.status(200).json({ id: Number(id) });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clientsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteClient(Number(id));
    res.status(200).json();
  } catch (err) {
    res.status(500).send(err.message);
  }
});
