import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const formQuestionsRouter = Router();

// Get all visible form questions (for rendering the intake form)
formQuestionsRouter.get("/", async (req, res) => {
  try {
    const { includeHidden } = req.query;

    const queryStr = `
      SELECT * FROM form_questions
      ${includeHidden !== "true" ? "WHERE is_visible = true" : ""}
      ORDER BY display_order ASC
    `;

    const questions = await db.query(queryStr);
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
      `SELECT * FROM form_questions WHERE id = $1`,
      [id]
    );
    res.status(200).json(keysToCamel(questions[0] || null));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Category-based grouping was removed; keep this route for backward compatibility
// but return a clear error.
formQuestionsRouter.get("/category/:category", async (_req, res) => {
  return res.status(410).json({
    error:
      "Category support has been removed from form_questions. Fetch all questions and render by display_order instead.",
  });
});

// Get questions by form type
formQuestionsRouter.get("/form/:formId", async (req, res) => {
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


// Create a new question
formQuestionsRouter.post("/", async (req, res) => {
  try {
    const {
      field_key,
      question_text,
      question_type,
      options,
      is_required,
      is_visible,
      is_core,
      display_order,
      validation_rules,
      form_id,
    } = req.body;

    // Get the max display_order if not provided
    let order = display_order;
    if (order === undefined || order === null) {
      const maxOrder = await db.query(
        `SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM form_questions`
      );
      order = maxOrder[0].next_order;
    }

    const data = await db.query(
      `INSERT INTO form_questions (
        field_key,
        question_text,
        question_type,
        form_id,
        options,
        is_required,
        is_visible,
        is_core,
        display_order,
        validation_rules
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        field_key,
        question_text,
        question_type,
        form_id,
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
    res.status(500).send(err.message);
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
      options,
      is_required,
      is_visible,
      is_core,
      display_order,
      validation_rules,
    } = req.body;

    // Check if this is a core question - can't hide core questions
    const existing = await db.query(
      `SELECT is_core, is_visible FROM form_questions WHERE id = $1`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    // If setting is_core to true, ensure is_visible is also true
    // If is_core is true and trying to hide, prevent it
    const finalIsCore = is_core !== undefined ? is_core : existing[0].is_core;
    const finalIsVisible = is_visible !== undefined ? is_visible : existing[0].is_visible;

    if (finalIsCore && finalIsVisible === false) {
      return res.status(400).json({ error: "Cannot hide core questions" });
    }

    const data = await db.query(
      `UPDATE form_questions SET
        field_key = COALESCE($1, field_key),
        question_text = COALESCE($2, question_text),
        question_type = COALESCE($3, question_type),
        options = COALESCE($4, options),
        is_required = COALESCE($5, is_required),
        is_visible = COALESCE($6, is_visible),
        is_core = COALESCE($7, is_core),
        display_order = COALESCE($8, display_order),
        validation_rules = COALESCE($9, validation_rules),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *`,
      [
        field_key,
        question_text,
        question_type,
        options ? JSON.stringify(options) : null,
        is_required,
        finalIsVisible,
        finalIsCore,
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

// Reorder questions (batch update display_order)
formQuestionsRouter.patch("/reorder", async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, display_order }

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

    // Return updated questions
    const questions = await db.query(
      `SELECT * FROM form_questions ORDER BY display_order ASC`
    );
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
