import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const formQuestionsRouter = Router();

// Get all questions (optionally filter by form_id)
formQuestionsRouter.get("/", async (req, res) => {
  try {
    const { includeHidden, form_id } = req.query;

    let queryStr = `
      SELECT fq.*, if.form_key, if.form_name 
      FROM form_questions fq
      JOIN intake_forms if ON fq.form_id = if.id
      WHERE 1=1
    `;

    const params: (string | number)[] = [];

    if (form_id) {
      params.push(Number(form_id));
      queryStr += ` AND fq.form_id = $${params.length}`;
    }

    if (includeHidden !== "true") {
      queryStr += ` AND fq.is_visible = true`;
    }

    queryStr += ` ORDER BY fq.form_id, fq.display_order ASC`;

    const questions = await db.query(queryStr, params);
    res.status(200).json(keysToCamel(questions));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get questions by form key (e.g., 'client_intake', 'random_survey')
formQuestionsRouter.get("/form/:formKey", async (req, res) => {
  try {
    const { formKey } = req.params;
    const { includeHidden } = req.query;

    // First get the form_id
    const form = await db.query(
      `SELECT id FROM intake_forms WHERE form_key = $1`,
      [formKey]
    );

    if (form.length === 0) {
      return res.status(404).json({ error: "Form not found" });
    }

    const formId = form[0].id;

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

// Get a single question by ID
formQuestionsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const questions = await db.query(
      `SELECT fq.*, if.form_key, if.form_name 
       FROM form_questions fq
       JOIN intake_forms if ON fq.form_id = if.id
       WHERE fq.id = $1`,
      [id]
    );

    if (questions.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json(keysToCamel(questions[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get questions by category (optionally filter by form_id)
formQuestionsRouter.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const { includeHidden, form_id } = req.query;

    let queryStr = `
      SELECT * FROM form_questions
      WHERE category = $1
    `;
    const params: (string | number)[] = [category];

    if (form_id) {
      params.push(Number(form_id));
      queryStr += ` AND form_id = $${params.length}`;
    }

    if (includeHidden !== "true") {
      queryStr += ` AND is_visible = true`;
    }

    queryStr += ` ORDER BY display_order ASC`;

    const questions = await db.query(queryStr, params);
    res.status(200).json(keysToCamel(questions));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create a new question (requires form_id)
formQuestionsRouter.post("/", async (req, res) => {
  try {
    const {
      form_id,
      field_key,
      question_text,
      question_type,
      category,
      options,
      is_required,
      is_visible,
      is_core,
      display_order,
      validation_rules,
    } = req.body;

    // Validate required fields
    if (!form_id) {
      return res.status(400).json({ error: "form_id is required" });
    }

    // Verify form exists
    const formCheck = await db.query(
      `SELECT id FROM intake_forms WHERE id = $1`,
      [form_id]
    );
    if (formCheck.length === 0) {
      return res.status(400).json({ error: "Form not found" });
    }

    // Get the max display_order for this form if not provided
    let order = display_order;
    if (order === undefined || order === null) {
      const maxOrder = await db.query(
        `SELECT COALESCE(MAX(display_order), 0) + 1 as next_order 
         FROM form_questions WHERE form_id = $1`,
        [form_id]
      );
      order = maxOrder[0].next_order;
    }

    const data = await db.query(
      `INSERT INTO form_questions (
        form_id,
        field_key,
        question_text,
        question_type,
        category,
        options,
        is_required,
        is_visible,
        is_core,
        display_order,
        validation_rules
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        form_id,
        field_key,
        question_text,
        question_type,
        category,
        options ? JSON.stringify(options) : null,
        is_required ?? true,
        is_visible ?? true,
        is_core ?? false,
        order,
        validation_rules ? JSON.stringify(validation_rules) : null,
      ]
    );

    res.status(201).json(keysToCamel(data[0]));
  } catch (err) {
    console.error("Error creating form question:", err);
    
    if (err.message.includes("duplicate key")) {
      return res.status(400).json({
        error: "A question with this field_key already exists in this form",
      });
    }
    
    // Check for ENUM type errors
    if (err.message.includes("invalid input value for enum")) {
      return res.status(400).json({
        error: `Invalid enum value: ${err.message}`,
        hint: "Check that question_type is one of: text, number, boolean, date, select, textarea. Check that category is one of: personal, contact, housing, demographics, program, exit, survey, feedback, general."
      });
    }
    
    // Check for foreign key errors
    if (err.message.includes("violates foreign key constraint")) {
      return res.status(400).json({
        error: "Invalid form_id - form does not exist",
      });
    }
    
    res.status(500).json({ error: err.message });
  }
});

// Update a question
formQuestionsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      field_key,
      question_text,
      question_type,
      category,
      options,
      is_required,
      is_visible,
      display_order,
      validation_rules,
    } = req.body;

    // Check if this is a core question - can't hide core questions
    const existing = await db.query(
      `SELECT is_core FROM form_questions WHERE id = $1`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (existing[0].is_core && is_visible === false) {
      return res.status(400).json({ error: "Cannot hide core questions" });
    }

    const data = await db.query(
      `UPDATE form_questions SET
        field_key = COALESCE($1, field_key),
        question_text = COALESCE($2, question_text),
        question_type = COALESCE($3, question_type),
        category = COALESCE($4, category),
        options = COALESCE($5, options),
        is_required = COALESCE($6, is_required),
        is_visible = COALESCE($7, is_visible),
        display_order = COALESCE($8, display_order),
        validation_rules = COALESCE($9, validation_rules),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *`,
      [
        field_key,
        question_text,
        question_type,
        category,
        options ? JSON.stringify(options) : null,
        is_required,
        is_visible,
        display_order,
        validation_rules ? JSON.stringify(validation_rules) : null,
        id,
      ]
    );

    res.status(200).json(keysToCamel(data[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Toggle visibility of a question (soft delete/restore)
formQuestionsRouter.patch("/:id/visibility", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_visible } = req.body;

    // Check if this is a core question
    const existing = await db.query(
      `SELECT is_core FROM form_questions WHERE id = $1`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (existing[0].is_core && is_visible === false) {
      return res.status(400).json({ error: "Cannot hide core questions" });
    }

    const data = await db.query(
      `UPDATE form_questions SET
        is_visible = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *`,
      [is_visible, id]
    );

    res.status(200).json(keysToCamel(data[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Reorder questions within a form (batch update display_order)
formQuestionsRouter.patch("/reorder", async (req, res) => {
  try {
    const { form_id, orders } = req.body; // form_id and Array of { id, display_order }

    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: "Orders must be an array" });
    }

    // Update each question's order
    for (const item of orders) {
      await db.query(
        `UPDATE form_questions SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [item.display_order, item.id]
      );
    }

    // Return updated questions for the form
    let queryStr = `SELECT * FROM form_questions`;
    const params: number[] = [];

    if (form_id) {
      params.push(form_id);
      queryStr += ` WHERE form_id = $1`;
    }

    queryStr += ` ORDER BY form_id, display_order ASC`;

    const questions = await db.query(queryStr, params);
    res.status(200).json(keysToCamel(questions));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a question (only if not core and has no responses)
formQuestionsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if this is a core question
    const existing = await db.query(
      `SELECT is_core FROM form_questions WHERE id = $1`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (existing[0].is_core) {
      return res.status(400).json({ error: "Cannot delete core questions" });
    }

    // Check if there are any responses to this question
    const responses = await db.query(
      `SELECT COUNT(*) as count FROM intake_responses WHERE question_id = $1`,
      [id]
    );

    if (parseInt(responses[0].count) > 0) {
      return res.status(400).json({
        error:
          "Cannot delete question with existing responses. Use visibility toggle instead.",
      });
    }

    await db.query(`DELETE FROM form_questions WHERE id = $1`, [id]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
