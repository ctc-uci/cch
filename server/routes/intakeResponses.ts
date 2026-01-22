import { Router } from "express";
import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

// Helper function to convert snake_case to camelCase
const toCamel = (string: string) => {
  return string.replace(/([-_][a-z])/g, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
};

export const intakeResponsesRouter = Router();

// Get all form responses grouped by session_id for a specific form_id
intakeResponsesRouter.get("/form/:formId", async (req, res) => {
  try {
    const { formId } = req.params;
    const { search, page, filter } = req.query;

    // First, get all unique sessions for this form_id
    let sessionQuery = `
      SELECT DISTINCT ir.session_id, ir.client_id, ir.submitted_at, ic.first_name, ic.last_name
      FROM intake_responses ir
      JOIN intake_clients ic ON ir.client_id = ic.id
      WHERE ir.form_id = $1
    `;

    const stringSearch = search ? `'%${String(search)}%'` : null;

    if (search) {
      sessionQuery += `
        AND (
          ic.first_name::TEXT ILIKE ${stringSearch}
          OR ic.last_name::TEXT ILIKE ${stringSearch}
          OR ir.session_id::TEXT ILIKE ${stringSearch}
          OR ir.submitted_at::TEXT ILIKE ${stringSearch}
        )
      `;
    }

    if (filter) {
      sessionQuery += ` AND ${filter}`;
    }

    sessionQuery += ` ORDER BY ir.submitted_at DESC`;

    if (page) {
      sessionQuery += ` LIMIT ${page}`;
    }

    const sessions = await db.query(sessionQuery, [formId]);

    if (sessions.length === 0) {
      return res.status(200).json([]);
    }

    const sessionIds = sessions.map((s: { session_id: string }) => s.session_id);

    // Get all responses for these sessions
    const responses = await db.query(
      `SELECT 
        ir.session_id,
        ir.client_id,
        ir.response_value,
        ir.submitted_at,
        fq.field_key,
        fq.question_text,
        fq.question_type,
        fq.display_order,
        ic.first_name,
        ic.last_name
      FROM intake_responses ir
      JOIN form_questions fq ON ir.question_id = fq.id
      JOIN intake_clients ic ON ir.client_id = ic.id
      WHERE ir.session_id = ANY($1::uuid[])
      AND ir.form_id = $2
      ORDER BY ir.submitted_at DESC, fq.display_order ASC`,
      [sessionIds, formId]
    );

    // Group responses by session_id
    const responsesBySession: Record<string, any> = {};
    
    for (const session of sessions) {
      const sessionId = session.session_id;
      responsesBySession[sessionId] = {
        sessionId: sessionId, // Use camelCase for frontend
        session_id: sessionId, // Keep snake_case for compatibility
        clientId: session.client_id,
        client_id: session.client_id,
        submittedAt: session.submitted_at,
        submitted_at: session.submitted_at,
        firstName: session.first_name,
        first_name: session.first_name,
        lastName: session.last_name,
        last_name: session.last_name,
      };
    }

    // Add response values to each session
    for (const resp of responses) {
      const sessionId = resp.session_id;
      if (responsesBySession[sessionId]) {
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
          case "rating_grid":
            // Keep rating_grid as JSON string or parsed object for frontend to handle
            try {
              value = JSON.parse(resp.response_value);
            } catch {
              value = resp.response_value || "";
            }
            break;
          default:
            value = resp.response_value || "";
        }

        // Convert field_key from snake_case to camelCase for frontend compatibility
        const camelFieldKey = toCamel(resp.field_key);
        responsesBySession[sessionId][camelFieldKey] = value;
      }
    }

    // Convert to array
    const result = Object.values(responsesBySession);

    res.status(200).json(keysToCamel(result));
  } catch (err) {
    console.error("Error fetching intake responses:", err);
    res.status(500).send(err.message);
  }
});

// Get form questions for a specific form_id (for building dynamic columns)
intakeResponsesRouter.get("/form/:formId/questions", async (req, res) => {
  try {
    const { formId } = req.params;
    const { includeHidden } = req.query;

    const queryStr = `
      SELECT * FROM form_questions
      WHERE form_id = $1
      ${includeHidden !== "true" ? "AND is_visible = true" : ""}
      ORDER BY display_order ASC
    `;

    const questions = await db.query(queryStr, [formId]);
    res.status(200).json(keysToCamel(questions));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete responses by session_id (deletes all responses in a session)
intakeResponsesRouter.delete("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    await db.query(
      `DELETE FROM intake_responses WHERE session_id = $1`,
      [sessionId]
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error deleting intake responses:", err);
    res.status(500).send(err.message);
  }
});
