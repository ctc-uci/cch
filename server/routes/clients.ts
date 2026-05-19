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
clientsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const clients = await db.query(`SELECT * FROM clients WHERE id = $1`, [id]);
    res.status(200).json(keysToCamel(clients));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Gets specific number of clients based on page count and returns either ALL or specific clients that have search keyword present.
clientsRouter.get("/", async (req, res) => {
  try {
    const { search, page, filter } = req.query;

    let queryStr = `
      SELECT 
        clients.*, 
        case_managers.first_name AS case_manager_first_name, 
        case_managers.last_name AS case_manager_last_name
      FROM clients
      LEFT JOIN case_managers ON clients.created_by = case_managers.id
      WHERE 1=1
    `;

    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      queryStr += ` 
      AND (clients.id::TEXT ILIKE ${stringSearch}
        OR clients.created_by::TEXT ILIKE ${stringSearch}
        OR clients.unit_name::TEXT ILIKE ${stringSearch}
        OR clients."grant"::TEXT ILIKE ${stringSearch}
        OR clients."status"::TEXT ILIKE ${stringSearch}
        OR clients.first_name::TEXT ILIKE ${stringSearch}
        OR clients.last_name::TEXT ILIKE ${stringSearch}
        OR clients.date_of_birth::TEXT ILIKE ${stringSearch}
        OR clients.age::TEXT ILIKE ${stringSearch}
        OR clients.phone_number::TEXT ILIKE ${stringSearch}
        OR clients.email::TEXT ILIKE ${stringSearch}
        OR clients.emergency_contact_name::TEXT ILIKE ${stringSearch}
        OR clients.emergency_contact_phone_number::TEXT ILIKE ${stringSearch}
        OR clients.medical::TEXT ILIKE ${stringSearch}
        OR clients.entrance_date::TEXT ILIKE ${stringSearch}
        OR clients.estimated_exit_date::TEXT ILIKE ${stringSearch}
        OR clients.exit_date::TEXT ILIKE ${stringSearch}
        OR clients.bed_nights::TEXT ILIKE ${stringSearch}
        OR clients.bed_nights_children::TEXT ILIKE ${stringSearch}
        OR clients.pregnant_upon_entry::TEXT ILIKE ${stringSearch}
        OR clients.disabled_children::TEXT ILIKE ${stringSearch}
        OR clients.ethnicity::TEXT ILIKE ${stringSearch}
        OR clients.race::TEXT ILIKE ${stringSearch}
        OR clients.city_of_last_permanent_residence::TEXT ILIKE ${stringSearch}
        OR clients.prior_living::TEXT ILIKE ${stringSearch}
        OR clients.prior_living_city::TEXT ILIKE ${stringSearch}
        OR clients.shelter_in_last_five_years::TEXT ILIKE ${stringSearch}
        OR clients.homelessness_length::TEXT ILIKE ${stringSearch}
        OR clients.chronically_homeless::TEXT ILIKE ${stringSearch}
        OR clients.attending_school_upon_entry::TEXT ILIKE ${stringSearch}
        OR clients.employement_gained::TEXT ILIKE ${stringSearch}
        OR clients.reason_for_leaving::TEXT ILIKE ${stringSearch}
        OR clients.specific_reason_for_leaving::TEXT ILIKE ${stringSearch}
        OR clients.specific_destination::TEXT ILIKE ${stringSearch}
        OR clients.savings_amount::TEXT ILIKE ${stringSearch}
        OR clients.attending_school_upon_exit::TEXT ILIKE ${stringSearch}
        OR clients.reunified::TEXT ILIKE ${stringSearch}
        OR clients.successful_completion::TEXT ILIKE ${stringSearch}
        OR clients.destination_city::TEXT ILIKE ${stringSearch}
        OR case_managers.first_name::TEXT ILIKE ${stringSearch}
        OR case_managers.last_name::TEXT ILIKE ${stringSearch}
      )`;
    }

    if (filter) {
      queryStr += `AND ${filter}`;
    }

    queryStr += " ORDER BY clients.id DESC";

    if (page) {
      queryStr += ` LIMIT ${page}`;
    }
    const clients = await db.query(queryStr);
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
      `SELECT * FROM clients WHERE email COLLATE "C" = $1`,
      [email]
    );

    // If no client found, check intake_statistics_form and create a client from it
    // so that request flow (e.g. Client Tracking Statistics) can submit.
    if (clients.length === 0) {
      const intakeRows = await db.query(
        `SELECT * FROM intake_statistics_form WHERE email COLLATE "C" = $1 ORDER BY id DESC LIMIT 1`,
        [email]
      );
      if (intakeRows.length > 0) {
        const i = intakeRows[0];
        const sub = (s: string | null | undefined, maxLen: number) =>
          (s !== null && s !== undefined ? String(s).trim() : "").slice(0, maxLen);
        const priorLiving = i.prior_living_situation !== null && i.prior_living_situation !== undefined ? String(i.prior_living_situation) : "";
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

// Creates new client based on key values provided into request body.
clientsRouter.post("/", async (req, res) => {
  try {
    const {
      created_by,
      unit_name,
      grant,
      status,
      first_name,
      last_name,
      date_of_birth,
      age,
      phone_number,
      email,
      emergency_contact_name,
      emergency_contact_phone_number,
      medical,
      entrance_date,
      estimated_exit_date,
      exit_date,
      bed_nights,
      bed_nights_children,
      pregnant_upon_entry,
      disabled_children,
      ethnicity,
      race,
      city_of_last_permanent_residence,
      prior_living,
      prior_living_city,
      shelter_in_last_five_years,
      homelessness_length,
      chronically_homeless,
      attending_school_upon_entry,
      employement_gained,
      reason_for_leaving,
      specific_reason_for_leaving,
      specific_destination,
      savings_amount,
      attending_school_upon_exit,
      reunified,
      successful_completion,
      destination_city,
      comments,
    } = req.body;

    const clientFields: ClientFields = {
      created_by,
      unit_name,
      grant:
        grant !== null && grant !== undefined && String(grant).trim() !== ""
          ? String(grant).trim()
          : null,
      status,
      first_name,
      last_name,
      date_of_birth,
      age,
      phone_number,
      email,
      emergency_contact_name,
      emergency_contact_phone_number,
      medical,
      entrance_date,
      estimated_exit_date,
      exit_date,
      bed_nights,
      bed_nights_children,
      pregnant_upon_entry,
      disabled_children,
      ethnicity,
      race,
      city_of_last_permanent_residence,
      prior_living,
      prior_living_city,
      shelter_in_last_five_years,
      homelessness_length,
      chronically_homeless,
      attending_school_upon_entry,
      employement_gained,
      reason_for_leaving,
      specific_reason_for_leaving,
      specific_destination,
      savings_amount,
      attending_school_upon_exit,
      reunified,
      successful_completion,
      destination_city,
      comments,
    };

    const newClientId = await createClient(clientFields);
    // Link any existing survey submissions (intake_responses) that have no client but match by name, phone, date of birth
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
            `UPDATE intake_responses
             SET client_id = $1, updated_at = CURRENT_TIMESTAMP
             WHERE client_id IS NULL AND session_id = ANY($2::uuid[])`,
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
    const {
      created_by,
      unit_name,
      grant,
      status,
      first_name,
      last_name,
      date_of_birth,
      age,
      phone_number,
      email,
      emergency_contact_name,
      emergency_contact_phone_number,
      medical,
      entrance_date,
      estimated_exit_date,
      exit_date,
      bed_nights,
      bed_nights_children,
      pregnant_upon_entry,
      disabled_children,
      ethnicity,
      race,
      city_of_last_permanent_residence,
      prior_living,
      prior_living_city,
      shelter_in_last_five_years,
      homelessness_length,
      chronically_homeless,
      attending_school_upon_entry,
      employement_gained,
      reason_for_leaving,
      specific_reason_for_leaving,
      specific_destination,
      savings_amount,
      attending_school_upon_exit,
      reunified,
      successful_completion,
      destination_city,
      comments,
    } = req.body;

    const { id } = req.params;

    await updateClient(Number(id), {
      created_by,
      unit_name,
      grant,
      status,
      first_name,
      last_name,
      date_of_birth,
      age,
      phone_number,
      email,
      emergency_contact_name,
      emergency_contact_phone_number,
      medical,
      entrance_date,
      estimated_exit_date,
      exit_date,
      bed_nights,
      bed_nights_children,
      pregnant_upon_entry,
      disabled_children,
      ethnicity,
      race,
      city_of_last_permanent_residence,
      prior_living,
      prior_living_city,
      shelter_in_last_five_years,
      homelessness_length,
      chronically_homeless,
      attending_school_upon_entry,
      employement_gained,
      reason_for_leaving,
      specific_reason_for_leaving,
      specific_destination,
      savings_amount,
      attending_school_upon_exit,
      reunified,
      successful_completion,
      destination_city,
      comments,
    });

    res.status(200).json({ id: Number(id) });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a client
clientsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteClient(Number(id));
    res.status(200).json();
  } catch (err) {
    res.status(500).send(err.message);
  }
});
