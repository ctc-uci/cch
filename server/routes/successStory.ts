import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";
import { matchClient, extractClientFields } from "../common/clientMatching";

const successRouter = express.Router();
successRouter.use(express.json());

successRouter.get("/", async (req, res) => {
  try {
    const success = await db.query(`SELECT * FROM success_story`);
    res.status(200).json(keysToCamel(success));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

successRouter.get("/search-filter", async (req, res) => {
  try {
    const { search, page, filter } = req.query;
    let queryStr = `
      SELECT ss.*, cm.first_name AS cm_first_name, cm.last_name AS cm_last_name, l.name AS location
      FROM success_story AS ss
      INNER JOIN case_managers AS cm ON ss.cm_id = cm.id
      INNER JOIN locations AS l ON ss.site = l.id
      WHERE 1=1
    `;

    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      queryStr += ` 
      AND (ss.id::TEXT ILIKE ${stringSearch}
        OR ss.previous_situation::TEXT ILIKE ${stringSearch}
        OR ss.cch_impact::TEXT ILIKE ${stringSearch}
        OR ss.where_now::TEXT ILIKE ${stringSearch}
        OR ss.tell_donors::TEXT ILIKE ${stringSearch}
        OR ss.quote::TEXT ILIKE ${stringSearch}
        OR ss.entrance_date::TEXT ILIKE ${stringSearch}
        OR ss.exit_date::TEXT ILIKE ${stringSearch}
        OR cm.first_name::TEXT ILIKE ${stringSearch}
        OR cm.last_name::TEXT ILIKE ${stringSearch}
        OR l.name::TEXT ILIKE ${stringSearch}
      )`;
    }

    if (filter) {
      queryStr += `AND ${filter}`;
    }

    queryStr += " ORDER BY ss.id ASC";

    if (page) {
      queryStr += ` LIMIT ${page}`;
    }

    const success_story = await db.query(queryStr);
    res.status(200).json(keysToCamel(success_story));
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

successRouter.get("/table-data", async (req, res) => {
  try {
    const success = await db.query(`
      SELECT
        ss.id AS id, 
        cm.first_name AS cm_first_name,
        cm.last_name AS cm_last_name,
        l.name AS location,
        ss.entrance_date,
        ss.exit_date,
        ss.previous_situation,
        ss.where_now,
        ss.cch_impact,
        ss.tell_donors,
        ss.quote
      FROM success_story AS ss
      INNER JOIN locations AS l ON ss.site = l.id
      INNER JOIN case_managers AS cm ON ss.cm_id = cm.id
      `);
    res.status(200).json(keysToCamel(success));
  } catch (err) {
    res.status(400).send(err.message);
  }
});


successRouter.get("/:formId", async (req, res) => {
  try {
    const { formId } = req.params;
    
    // Check if formId is a UUID (session-based form) or integer (old table)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formId);
    
    if (isUUID) {
      // Fetch from intake_responses using session_id
      const sessionResult = await db.query(
        `SELECT DISTINCT ir.session_id, ir.client_id, ir.submitted_at, ir.form_id, c.first_name, c.last_name
        FROM intake_responses ir
        LEFT JOIN clients c ON ir.client_id = c.id
        WHERE ir.session_id = $1 AND ir.form_id = 3
        LIMIT 1`,
        [formId]
      );

      if (sessionResult.length === 0) {
        return res.status(404).json({ error: "Form not found" });
      }

      const session = sessionResult[0];
      
      // Get all responses for this session
      const responses = await db.query(
        `SELECT 
          ir.response_value,
          fq.field_key,
          fq.question_type
        FROM intake_responses ir
        JOIN form_questions fq ON ir.question_id = fq.id
        WHERE ir.session_id = $1 AND ir.form_id = 3
        ORDER BY fq.display_order ASC`,
        [formId]
      );

      // Build response object matching success_story structure
      const formData: Record<string, unknown> = {
        id: session.session_id,
        client_id: session.client_id,
        date: session.submitted_at,
        name: session.first_name && session.last_name 
          ? `${session.first_name} ${session.last_name}`.trim() 
          : 'Unknown',
      };

      // Convert responses to form data
      for (const resp of responses) {
        let value: unknown = resp.response_value;
        
        // Convert based on question type
        switch (resp.question_type) {
          case "number":
            value = resp.response_value ? parseFloat(resp.response_value) : null;
            break;
          case "boolean":
            value = resp.response_value === "true" || resp.response_value === "yes";
            break;
          case "date":
            value = resp.response_value || null;
            break;
          default:
            value = resp.response_value || "";
        }
        
        // Convert field_key from snake_case to match success_story column names
        formData[resp.field_key] = value;
      }

      res.status(200).json(keysToCamel([formData]));
    } else {
      // Fetch from old success_story table
      const children = await db.query(
        `SELECT * FROM success_story WHERE id = $1`,
        [formId]
      );
      res.status(200).json(keysToCamel(children));
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create new success story - now posts to intake_responses with form_id = 3
successRouter.post("/", async (req, res) => {
  try {
    const formData = req.body;
    const formId = 3; // Success Story form_id

    // Get all form questions for form_id = 3 to map field_key to question_id
    const questions = await db.query(
      `SELECT id, field_key, question_type FROM form_questions WHERE form_id = $1`,
      [formId]
    );

    const questionMap = new Map<string, { id: number; type: string }>(
      questions.map(
        (q: { id: number; field_key: string; question_type: string }) => [
          q.field_key,
          { id: q.id, type: q.question_type },
        ]
      )
    );

    // Match client from clients table (excluding random client survey - form_id = 4)
    // form_id = 3 is Success Story, so we should match
    const clientFields = extractClientFields(formData);
    const matchedClientId = await matchClient(
      clientFields.firstName,
      clientFields.lastName,
      clientFields.phoneNumber,
      clientFields.dateOfBirth
    );

    // Use matched client ID if found, otherwise use NULL (client_id now references clients table)
    const finalClientId = matchedClientId || null;

    // Generate a unique session_id for this success story submission
    // All responses from this submission will share the same session_id
    const sessionIdResult = await db.query("SELECT uuid_generate_v4() as session_id");
    const sessionId = sessionIdResult[0].session_id;

    // Insert responses for each field that has a corresponding question
    // All responses use the same session_id to group them together
    for (const [fieldKey, value] of Object.entries(formData)) {
      // Skip non-response fields
      if (fieldKey === 'client_id' || fieldKey === 'name') {
        continue;
      }

      const question = questionMap.get(fieldKey);
      if (question && value !== undefined && value !== null && value !== "") {
        // Convert value to string for storage
        let stringValue: string;
        if (typeof value === "boolean") {
          // Convert boolean to "yes" or "no" instead of "true" or "false"
          stringValue = value ? "yes" : "no";
        } else if (typeof value === "number") {
          stringValue = value.toString();
        } else if (typeof value === "object") {
          // For rating grids and other objects, stringify
          stringValue = JSON.stringify(value);
        } else {
          stringValue = String(value);
        }

        await db.query(
          `INSERT INTO intake_responses (client_id, question_id, response_value, form_id, session_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [finalClientId, question.id, stringValue, formId, sessionId]
        );
      }
    }

    res.status(200).json({ success: true, client_id: finalClientId, session_id: sessionId });
  } catch (err: unknown) {
    const error = err as Error & { message?: string };
    console.error("Error creating success story:", err);
    res.status(500).json({ error: error?.message || 'Unknown error occurred' });
  }
});

successRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      date,
      client_id,
      cm_id,
      previous_situation,
      cch_impact,
      where_now,
      tell_donors,
      quote,
      consent,
      site,
      exit_date,
      entrance_date,
    } = req.body;

    const user = await db.query(
      `UPDATE success_story SET
            date = COALESCE($1, date),
            client_id = COALESCE($2, client_id),
            cm_id = COALESCE($3, cm_id),
            previous_situation = COALESCE($4, previous_situation),
            cch_impact = COALESCE($5, cch_impact),
            where_now = COALESCE($6, where_now),
            tell_donors = COALESCE($7, tell_donors),
            quote = COALESCE($8, quote),
            consent = COALESCE($9, consent),
            site = COALESCE($10, site),
            exit_date = COALESCE($11, exit_date),
            entrance_date = COALESCE($12, entrance_date)
            WHERE id = $13
            RETURNING id`,
      [
        date,
        client_id,
        cm_id,
        previous_situation,
        cch_impact,
        where_now,
        tell_donors,
        quote,
        consent,
        site,
        exit_date,
        entrance_date,
        id,
      ]
    );

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

successRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await db.query(`DELETE FROM success_story WHERE id = $1`, [
      id,
    ]);
    res.status(200).json(keysToCamel(success));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export { successRouter };
