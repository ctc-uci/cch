import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const intakeFormsRouter = Router();

// Get all forms (optionally filter by active status)
intakeFormsRouter.get("/", async (req, res) => {
  try {
    const { includeInactive } = req.query;

    const queryStr = `
      SELECT * FROM intake_forms
      ${includeInactive !== "true" ? "WHERE is_active = true" : ""}
      ORDER BY id ASC
    `;

    const forms = await db.query(queryStr);
    res.status(200).json(keysToCamel(forms));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get a single form by ID
intakeFormsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const forms = await db.query(`SELECT * FROM intake_forms WHERE id = $1`, [id]);

    if (forms.length === 0) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.status(200).json(keysToCamel(forms[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get a form by form_key
intakeFormsRouter.get("/key/:formKey", async (req, res) => {
  try {
    const { formKey } = req.params;
    const forms = await db.query(`SELECT * FROM intake_forms WHERE form_key = $1`, [
      formKey,
    ]);

    if (forms.length === 0) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.status(200).json(keysToCamel(forms[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get a form with all its questions
intakeFormsRouter.get("/:id/questions", async (req, res) => {
  try {
    const { id } = req.params;
    const { includeHidden } = req.query;

    // Get the form
    const forms = await db.query(`SELECT * FROM intake_forms WHERE id = $1`, [id]);
    if (forms.length === 0) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Get the questions for this form
    const questionsQuery = `
      SELECT * FROM form_questions 
      WHERE form_id = $1
      ${includeHidden !== "true" ? "AND is_visible = true" : ""}
      ORDER BY display_order ASC
    `;
    const questions = await db.query(questionsQuery, [id]);

    res.status(200).json({
      ...keysToCamel(forms[0]),
      questions: keysToCamel(questions),
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get a form with questions by form_key
intakeFormsRouter.get("/key/:formKey/questions", async (req, res) => {
  try {
    const { formKey } = req.params;
    const { includeHidden } = req.query;

    // Get the form
    const forms = await db.query(`SELECT * FROM intake_forms WHERE form_key = $1`, [
      formKey,
    ]);
    if (forms.length === 0) {
      return res.status(404).json({ error: "Form not found" });
    }

    const form = forms[0];

    // Get the questions for this form
    const questionsQuery = `
      SELECT * FROM form_questions 
      WHERE form_id = $1
      ${includeHidden !== "true" ? "AND is_visible = true" : ""}
      ORDER BY display_order ASC
    `;
    const questions = await db.query(questionsQuery, [form.id]);

    res.status(200).json({
      ...keysToCamel(form),
      questions: keysToCamel(questions),
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create a new form
intakeFormsRouter.post("/", async (req, res) => {
  try {
    const { form_key, form_name, description, is_active } = req.body;

    if (!form_key || !form_name) {
      return res.status(400).json({ error: "form_key and form_name are required" });
    }

    const data = await db.query(
      `INSERT INTO intake_forms (form_key, form_name, description, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [form_key, form_name, description, is_active ?? true]
    );

    res.status(201).json(keysToCamel(data[0]));
  } catch (err) {
    if (err.message.includes("duplicate key")) {
      return res.status(400).json({ error: "A form with this form_key already exists" });
    }
    res.status(500).send(err.message);
  }
});

// Update a form
intakeFormsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { form_key, form_name, description, is_active } = req.body;

    const data = await db.query(
      `UPDATE intake_forms SET
        form_key = COALESCE($1, form_key),
        form_name = COALESCE($2, form_name),
        description = COALESCE($3, description),
        is_active = COALESCE($4, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *`,
      [form_key, form_name, description, is_active, id]
    );

    if (data.length === 0) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.status(200).json(keysToCamel(data[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Toggle form active status
intakeFormsRouter.patch("/:id/active", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const data = await db.query(
      `UPDATE intake_forms SET
        is_active = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *`,
      [is_active, id]
    );

    if (data.length === 0) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.status(200).json(keysToCamel(data[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a form (only if no questions or responses exist)
intakeFormsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if there are questions for this form
    const questions = await db.query(
      `SELECT COUNT(*) as count FROM form_questions WHERE form_id = $1`,
      [id]
    );

    if (parseInt(questions[0].count) > 0) {
      return res.status(400).json({
        error:
          "Cannot delete form with existing questions. Delete questions first or deactivate the form.",
      });
    }

    // Check if there are responses for this form
    const responses = await db.query(
      `SELECT COUNT(*) as count FROM intake_responses WHERE form_id = $1`,
      [id]
    );

    if (parseInt(responses[0].count) > 0) {
      return res.status(400).json({
        error:
          "Cannot delete form with existing responses. Use is_active toggle instead.",
      });
    }

    await db.query(`DELETE FROM intake_forms WHERE id = $1`, [id]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
