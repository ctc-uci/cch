import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const intakeClientsRouter = Router();

// Helper function to get intake client with all responses (optionally filtered by form)
const getIntakeClientWithResponses = async (
  clientId: number,
  formId?: number
) => {
  // Get core client data
  const clientResult = await db.query(
    `SELECT 
      intake_clients.*, 
      case_managers.first_name AS case_manager_first_name, 
      case_managers.last_name AS case_manager_last_name,
      locations.name AS location_name
    FROM intake_clients
    LEFT JOIN case_managers ON intake_clients.created_by = case_managers.id
    LEFT JOIN units ON intake_clients.unit_id = units.id
    LEFT JOIN locations ON units.location_id = locations.id
    WHERE intake_clients.id = $1`,
    [clientId]
  );

  if (clientResult.length === 0) return null;

  const client = clientResult[0];

  // Get responses for this client (optionally filtered by form)
  let responsesQuery = `
    SELECT 
      ir.response_value,
      ir.form_id,
      fq.field_key,
      fq.question_type,
      if.form_key
    FROM intake_responses ir
    JOIN form_questions fq ON ir.question_id = fq.id
    JOIN intake_forms if ON ir.form_id = if.id
    WHERE ir.client_id = $1
  `;
  const params: (number | undefined)[] = [clientId];

  if (formId) {
    params.push(formId);
    responsesQuery += ` AND ir.form_id = $2`;
  }

  const responses = await db.query(responsesQuery, params);

  // Convert responses to object grouped by form
  const responsesByForm: Record<string, Record<string, unknown>> = {};
  const flatResponses: Record<string, unknown> = {};

  for (const resp of responses) {
    let value: unknown = resp.response_value;

    // Convert based on question type
    switch (resp.question_type) {
      case "number":
        value = resp.response_value ? parseFloat(resp.response_value) : null;
        break;
      case "boolean":
        value = resp.response_value === "true";
        break;
      case "date":
        value = resp.response_value || null;
        break;
      default:
        value = resp.response_value || "";
    }

    // Group by form
    if (!responsesByForm[resp.form_key]) {
      responsesByForm[resp.form_key] = {};
    }
    responsesByForm[resp.form_key][resp.field_key] = value;

    // Also store flat (for backwards compatibility / single form use)
    flatResponses[resp.field_key] = value;
  }

  return {
    ...client,
    ...flatResponses,
    formResponses: responsesByForm,
  };
};

// Get a single intake client by ID with all responses
intakeClientsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { form_id } = req.query;
    const client = await getIntakeClientWithResponses(
      parseInt(id),
      form_id ? parseInt(form_id as string) : undefined
    );

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json(keysToCamel(client));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all intake clients with search and pagination
intakeClientsRouter.get("/", async (req, res) => {
  try {
    const { search, page, filter } = req.query;

    // Build the base query for intake clients
    let queryStr = `
      SELECT 
        intake_clients.*, 
        case_managers.first_name AS case_manager_first_name, 
        case_managers.last_name AS case_manager_last_name,
        locations.name AS location_name
      FROM intake_clients
      LEFT JOIN case_managers ON intake_clients.created_by = case_managers.id
      LEFT JOIN units ON intake_clients.unit_id = units.id
      LEFT JOIN locations ON units.location_id = locations.id
      WHERE 1=1
    `;

    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      // Search in core fields and in intake_responses
      queryStr += ` 
      AND (
        intake_clients.id::TEXT ILIKE ${stringSearch}
        OR intake_clients.first_name::TEXT ILIKE ${stringSearch}
        OR intake_clients.last_name::TEXT ILIKE ${stringSearch}
        OR intake_clients.status::TEXT ILIKE ${stringSearch}
        OR case_managers.first_name::TEXT ILIKE ${stringSearch}
        OR case_managers.last_name::TEXT ILIKE ${stringSearch}
        OR locations.name::TEXT ILIKE ${stringSearch}
        OR intake_clients.id IN (
          SELECT DISTINCT ir.client_id 
          FROM intake_responses ir 
          WHERE ir.response_value ILIKE ${stringSearch}
        )
      )`;
    }

    if (filter) {
      queryStr += ` AND ${filter}`;
    }

    queryStr += " ORDER BY intake_clients.id ASC";

    if (page) {
      queryStr += ` LIMIT ${page}`;
    }

    const clients = await db.query(queryStr);

    // Get all responses for all clients in one query for efficiency
    if (clients.length > 0) {
      const clientIds = clients.map((c: { id: number }) => c.id);
      const responses = await db.query(
        `SELECT 
          ir.client_id,
          ir.response_value,
          ir.form_id,
          fq.field_key,
          fq.question_type,
          if.form_key
        FROM intake_responses ir
        JOIN form_questions fq ON ir.question_id = fq.id
        JOIN intake_forms if ON ir.form_id = if.id
        WHERE ir.client_id = ANY($1)`,
        [clientIds]
      );

      // Group responses by client_id
      const responsesByClient: Record<number, Record<string, unknown>> = {};
      for (const resp of responses) {
        if (!responsesByClient[resp.client_id]) {
          responsesByClient[resp.client_id] = {};
        }

        let value: unknown = resp.response_value;
        switch (resp.question_type) {
          case "number":
            value = resp.response_value
              ? parseFloat(resp.response_value)
              : null;
            break;
          case "boolean":
            value = resp.response_value === "true";
            break;
          default:
            value = resp.response_value || "";
        }

        responsesByClient[resp.client_id]![resp.field_key] = value;
      }

      // Merge responses into client objects
      for (const client of clients) {
        Object.assign(client, responsesByClient[client.id] || {});
      }
    }

    res.status(200).json(keysToCamel(clients));
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

// Get intake client by email (searches in responses)
intakeClientsRouter.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const clients = await db.query(
      `SELECT DISTINCT c.* 
       FROM intake_clients c
       JOIN intake_responses ir ON c.id = ir.client_id
       JOIN form_questions fq ON ir.question_id = fq.id
       WHERE fq.field_key = 'email' AND ir.response_value = $1`,
      [email]
    );

    // Get full client data with responses
    const results = await Promise.all(
      clients.map((c: { id: number }) => getIntakeClientWithResponses(c.id))
    );

    res.status(200).json(keysToCamel(results.filter(Boolean)));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create a new intake client with responses
// form_id or form_key can be provided to specify which form (defaults to client_intake)
intakeClientsRouter.post("/", async (req, res) => {
  try {
    const {
      created_by,
      unit_id,
      status,
      first_name,
      last_name,
      form_id,
      form_key,
      ...responses
    } = req.body;

    // Determine the form_id to use
    let targetFormId = form_id;

    if (!targetFormId && form_key) {
      const formResult = await db.query(
        `SELECT id FROM intake_forms WHERE form_key = $1`,
        [form_key]
      );
      if (formResult.length === 0) {
        return res.status(400).json({ error: `Form '${form_key}' not found` });
      }
      targetFormId = formResult[0].id;
    }

    // Default to client_intake form (id = 1)
    if (!targetFormId) {
      const defaultForm = await db.query(
        `SELECT id FROM intake_forms WHERE form_key = 'client_intake'`
      );
      targetFormId = defaultForm.length > 0 ? defaultForm[0].id : 1;
    }

    // Insert core client data
    const clientResult = await db.query(
      `INSERT INTO intake_clients (created_by, unit_id, status, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [created_by, unit_id, status || "Active", first_name, last_name]
    );

    const clientId = clientResult[0].id;

    // Get all form questions for this form to map field_key to question_id
    const questions = await db.query(
      `SELECT id, field_key, question_type, form_id FROM form_questions WHERE form_id = $1`,
      [targetFormId]
    );

    const questionMap = new Map<
      string,
      { id: number; type: string; formId: number }
    >(
      questions.map(
        (q: {
          id: number;
          field_key: string;
          question_type: string;
          form_id: number;
        }) => [q.field_key, { id: q.id, type: q.question_type, formId: q.form_id }]
      )
    );

    // Insert responses for each field that has a corresponding question
    for (const [fieldKey, value] of Object.entries(responses)) {
      const question = questionMap.get(fieldKey);
      if (question && value !== undefined && value !== null && value !== "") {
        // Convert value to string for storage
        let stringValue: string;
        if (typeof value === "boolean") {
          stringValue = value.toString();
        } else if (typeof value === "number") {
          stringValue = value.toString();
        } else {
          stringValue = String(value);
        }

        await db.query(
          `INSERT INTO intake_responses (client_id, form_id, question_id, response_value, submitted_at)
           VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
          [clientId, question.formId, question.id, stringValue]
        );
      }
    }

    res.status(200).json({ id: clientId });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Submit a form for an existing client (for surveys, exit forms, etc.)
intakeClientsRouter.post("/:id/forms", async (req, res) => {
  try {
    const { id } = req.params;
    const { form_id, form_key, ...responses } = req.body;

    // Verify client exists
    const clientCheck = await db.query(
      `SELECT id FROM intake_clients WHERE id = $1`,
      [id]
    );
    if (clientCheck.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Determine the form_id to use
    let targetFormId = form_id;

    if (!targetFormId && form_key) {
      const formResult = await db.query(
        `SELECT id FROM intake_forms WHERE form_key = $1`,
        [form_key]
      );
      if (formResult.length === 0) {
        return res.status(400).json({ error: `Form '${form_key}' not found` });
      }
      targetFormId = formResult[0].id;
    }

    if (!targetFormId) {
      return res
        .status(400)
        .json({ error: "form_id or form_key is required" });
    }

    // Get all form questions for this form
    const questions = await db.query(
      `SELECT id, field_key, question_type FROM form_questions WHERE form_id = $1`,
      [targetFormId]
    );

    const questionMap = new Map<string, { id: number; type: string }>(
      questions.map(
        (q: { id: number; field_key: string; question_type: string }) => [
          q.field_key,
          { id: q.id, type: q.question_type },
        ]
      )
    );

    // Insert/update responses for each field
    for (const [fieldKey, value] of Object.entries(responses)) {
      const question = questionMap.get(fieldKey);
      if (question) {
        let stringValue: string | null = null;
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "boolean") {
            stringValue = value.toString();
          } else if (typeof value === "number") {
            stringValue = value.toString();
          } else {
            stringValue = String(value);
          }
        }

        await db.query(
          `INSERT INTO intake_responses (client_id, form_id, question_id, response_value, submitted_at)
           VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
           ON CONFLICT (client_id, form_id, question_id) 
           DO UPDATE SET response_value = $4, updated_at = CURRENT_TIMESTAMP, submitted_at = CURRENT_TIMESTAMP`,
          [id, targetFormId, question.id, stringValue]
        );
      }
    }

    res.status(200).json({ success: true, clientId: parseInt(id), formId: targetFormId });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Get all form submissions for a client
intakeClientsRouter.get("/:id/forms", async (req, res) => {
  try {
    const { id } = req.params;

    // Get all forms that have responses for this client
    const forms = await db.query(
      `SELECT DISTINCT 
        if.id, 
        if.form_key, 
        if.form_name,
        MAX(ir.submitted_at) as last_submitted
       FROM intake_responses ir
       JOIN intake_forms if ON ir.form_id = if.id
       WHERE ir.client_id = $1
       GROUP BY if.id, if.form_key, if.form_name
       ORDER BY last_submitted DESC`,
      [id]
    );

    res.status(200).json(keysToCamel(forms));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get responses for a specific form for a client
intakeClientsRouter.get("/:id/forms/:formId", async (req, res) => {
  try {
    const { id, formId } = req.params;

    const responses = await db.query(
      `SELECT 
        fq.field_key,
        fq.question_text,
        fq.question_type,
        ir.response_value,
        ir.submitted_at
       FROM intake_responses ir
       JOIN form_questions fq ON ir.question_id = fq.id
       WHERE ir.client_id = $1 AND ir.form_id = $2
       ORDER BY fq.display_order`,
      [id, formId]
    );

    // Convert to object
    const responseData: Record<string, unknown> = {};
    for (const resp of responses) {
      let value: unknown = resp.response_value;
      switch (resp.question_type) {
        case "number":
          value = resp.response_value ? parseFloat(resp.response_value) : null;
          break;
        case "boolean":
          value = resp.response_value === "true";
          break;
        default:
          value = resp.response_value || "";
      }
      responseData[resp.field_key] = value;
    }

    res.status(200).json(keysToCamel({
      clientId: parseInt(id),
      formId: parseInt(formId),
      responses: responseData,
      rawResponses: responses,
    }));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update an intake client and their responses
intakeClientsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      created_by,
      unit_id,
      status,
      first_name,
      last_name,
      form_id,
      form_key,
      ...responses
    } = req.body;

    // Update core client data
    await db.query(
      `UPDATE intake_clients SET
        created_by = COALESCE($1, created_by),
        unit_id = COALESCE($2, unit_id),
        status = COALESCE($3, status),
        first_name = COALESCE($4, first_name),
        last_name = COALESCE($5, last_name),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6`,
      [created_by, unit_id, status, first_name, last_name, id]
    );

    // Determine the form_id to use
    let targetFormId = form_id;

    if (!targetFormId && form_key) {
      const formResult = await db.query(
        `SELECT id FROM intake_forms WHERE form_key = $1`,
        [form_key]
      );
      if (formResult.length > 0) {
        targetFormId = formResult[0].id;
      }
    }

    // Default to client_intake form
    if (!targetFormId) {
      const defaultForm = await db.query(
        `SELECT id FROM intake_forms WHERE form_key = 'client_intake'`
      );
      targetFormId = defaultForm.length > 0 ? defaultForm[0].id : 1;
    }

    // Get all form questions for this form
    const questions = await db.query(
      `SELECT id, field_key, question_type FROM form_questions WHERE form_id = $1`,
      [targetFormId]
    );

    const questionMap = new Map<string, { id: number; type: string }>(
      questions.map(
        (q: { id: number; field_key: string; question_type: string }) => [
          q.field_key,
          { id: q.id, type: q.question_type },
        ]
      )
    );

    // Upsert responses for each field
    for (const [fieldKey, value] of Object.entries(responses)) {
      const question = questionMap.get(fieldKey);
      if (question) {
        // Convert value to string for storage
        let stringValue: string | null = null;
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "boolean") {
            stringValue = value.toString();
          } else if (typeof value === "number") {
            stringValue = value.toString();
          } else {
            stringValue = String(value);
          }
        }

        // Use upsert to insert or update
        await db.query(
          `INSERT INTO intake_responses (client_id, form_id, question_id, response_value)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (client_id, form_id, question_id) 
           DO UPDATE SET response_value = $4, updated_at = CURRENT_TIMESTAMP`,
          [id, targetFormId, question.id, stringValue]
        );
      }
    }

    res.status(200).json({ id: parseInt(id) });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Delete an intake client (cascade will handle responses)
intakeClientsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM intake_clients WHERE id = $1", [id]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
