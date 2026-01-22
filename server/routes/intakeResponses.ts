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
    // If search is provided, find sessions where any response value matches
    let sessionQuery: string;
    const queryParams: unknown[] = [formId];

    if (search) {
      const stringSearch = `%${String(search)}%`;
      queryParams.push(stringSearch);
      
      // Search across all response values, client names, session_id, and submitted_at
      sessionQuery = `
        SELECT DISTINCT ir.session_id, ir.client_id, ir.submitted_at, ic.first_name, ic.last_name
        FROM intake_responses ir
        JOIN intake_clients ic ON ir.client_id = ic.id
        WHERE ir.form_id = $1
        AND (
          ic.first_name::TEXT ILIKE $2
          OR ic.last_name::TEXT ILIKE $2
          OR ir.session_id::TEXT ILIKE $2
          OR ir.submitted_at::TEXT ILIKE $2
          OR ir.response_value::TEXT ILIKE $2
        )
      `;
    } else {
      sessionQuery = `
        SELECT DISTINCT ir.session_id, ir.client_id, ir.submitted_at, ic.first_name, ic.last_name
        FROM intake_responses ir
        JOIN intake_clients ic ON ir.client_id = ic.id
        WHERE ir.form_id = $1
      `;
    }

    if (filter) {
      // Parse filter to handle dynamic field_keys
      // Filters come in format like: "AND field_key ILIKE '%value%'"
      // We need to convert field_key filters to check intake_responses.response_value
      const filterStr = String(filter);
      
      // Get all field_keys for this form to identify which filters are dynamic fields
      const formQuestions = await db.query(
        `SELECT field_key FROM form_questions WHERE form_id = $1`,
        [formId]
      );
      const fieldKeys = formQuestions.map((q: { field_key: string }) => q.field_key);
      
      // Parse and convert filter queries
      // Split by AND/OR and process each condition
      const filterParts = filterStr.split(/(\s+(?:AND|OR)\s+)/i);
      const convertedFilters: string[] = [];
      
      for (let i = 0; i < filterParts.length; i++) {
        const part = filterParts[i]?.trim();
        if (!part) continue;
        
        // Skip AND/OR operators
        if (/^(AND|OR)$/i.test(part)) {
          convertedFilters.push(part);
          continue;
        }
        
        // Check if this is a field_key filter (not a table.column format)
        const matchingFieldKey = fieldKeys.find((fk: string) => part.includes(fk) && !part.includes('.'));
        
        if (matchingFieldKey) {
          // Extract field_key, operator, and value from filter
          // Format: "field_key ILIKE '%value%'" or "field_key = 'value'"
          const match = part.match(/(\w+)\s+(ILIKE|LIKE|=|!=|>|<|>=|<=)\s+['"]?([^'"]*)['"]?/i);
          if (match && match[1] && match[2] && match[3]) {
            const fieldKey = match[1];
            const operator = match[2];
            const value = match[3];
            const escapedValue = value.replace(/'/g, "''");
            const paramIndex = queryParams.length + 1;
            
            // Convert to subquery that checks intake_responses
            // Find sessions where there's a response with matching field_key and value
            convertedFilters.push(`ir.session_id IN (
              SELECT DISTINCT ir2.session_id 
              FROM intake_responses ir2
              JOIN form_questions fq2 ON ir2.question_id = fq2.id
              WHERE ir2.form_id = $${paramIndex}
              AND fq2.field_key = $${paramIndex + 1}
              AND ir2.response_value::TEXT ${operator} $${paramIndex + 2}
            )`);
            queryParams.push(formId, fieldKey, operator === 'ILIKE' || operator === 'LIKE' ? `%${escapedValue}%` : escapedValue);
          } else {
            // If parsing fails, keep original filter
            convertedFilters.push(part);
          }
        } else {
          // Keep non-field_key filters as-is (like ic.first_name, etc.)
          convertedFilters.push(part);
        }
      }
      
      sessionQuery += ` AND ${convertedFilters.join(' ')}`;
    }

    sessionQuery += ` ORDER BY ir.submitted_at DESC`;

    if (page) {
      queryParams.push(page);
      sessionQuery += ` LIMIT $${queryParams.length}`;
    }

    const sessions = await db.query(sessionQuery, queryParams);

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
    const responsesBySession: Record<string, Record<string, unknown>> = {};
    
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

// Get a single form response by session_id
intakeResponsesRouter.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Get session info
    const sessionResult = await db.query(
      `SELECT DISTINCT ir.session_id, ir.client_id, ir.submitted_at, ir.form_id, ic.first_name, ic.last_name
      FROM intake_responses ir
      JOIN intake_clients ic ON ir.client_id = ic.id
      WHERE ir.session_id = $1
      LIMIT 1`,
      [sessionId]
    );

    if (sessionResult.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    const session = sessionResult[0];
    const formId = session.form_id;

    // Get all responses for this session
    const responses = await db.query(
      `SELECT 
        ir.response_value,
        ir.submitted_at,
        fq.field_key,
        fq.question_text,
        fq.question_type,
        fq.display_order,
        fq.options
      FROM intake_responses ir
      JOIN form_questions fq ON ir.question_id = fq.id
      WHERE ir.session_id = $1
      ORDER BY fq.display_order ASC`,
      [sessionId]
    );

    // Build response object
    const responseData: Record<string, unknown> = {
      sessionId: session.session_id,
      session_id: session.session_id,
      clientId: session.client_id,
      client_id: session.client_id,
      submittedAt: session.submitted_at,
      submitted_at: session.submitted_at,
      firstName: session.first_name,
      first_name: session.first_name,
      lastName: session.last_name,
      last_name: session.last_name,
      formId: formId,
      form_id: formId,
    };

    // Add response values
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
        case "rating_grid":
          try {
            value = JSON.parse(resp.response_value);
          } catch {
            value = resp.response_value || "";
          }
          break;
        default:
          value = resp.response_value || "";
      }

      // Use camelCase field_key
      const camelFieldKey = toCamel(resp.field_key);
      responseData[camelFieldKey] = value;
      // Also keep snake_case for compatibility
      responseData[resp.field_key] = value;
    }

    res.status(200).json(keysToCamel(responseData));
  } catch (err) {
    console.error("Error fetching intake response:", err);
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
