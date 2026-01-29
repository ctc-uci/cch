import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const caseManagersRouter = Router();

// Get all case managers
caseManagersRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM case_managers ORDER BY id DESC;`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all case manager names
caseManagersRouter.get("/names", async (req, res) => {
  try {
    const data = await db.query(`SELECT DISTINCT first_name, last_name, id FROM case_managers;`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get case manager by id
caseManagersRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(`SELECT * FROM case_managers WHERE id = $1`, [
      id,
    ]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get case manager id by email
caseManagersRouter.get("/id-by-email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const data = await db.query(`SELECT id FROM case_managers WHERE email COLLATE "C" = $1`, [
      email,
    ]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Insert new case manager
caseManagersRouter.post("/", async (req, res) => {
  try {
    const { role, firstName, lastName, phoneNumber, email, notes } = req.body;
    
    // Check if email already exists
    const existing = await db.query(
      `SELECT id FROM case_managers WHERE email COLLATE "C" = $1`,
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ 
        error: "Duplicate email", 
        message: `A case manager with email ${email} already exists.` 
      });
    }
    
    const data = await db.query(
      `INSERT INTO case_managers (role, first_name, last_name, phone_number, email, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`,
      [role, firstName, lastName, phoneNumber, email, notes]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    // Handle unique constraint violation
    if (err.code === '23505' || err.message?.includes('unique') || err.message?.includes('duplicate')) {
      return res.status(400).json({ 
        error: "Duplicate email", 
        message: `A case manager with email ${req.body.email} already exists.` 
      });
    }
    res.status(500).send(err.message);
  }
});

// Update case manager by id
caseManagersRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role, firstName, lastName, phoneNumber, email } = req.body;
    const data = await db.query(
      `UPDATE case_managers 
      SET role = COALESCE($1, role), 
      first_name = COALESCE($2, first_name), 
      last_name = COALESCE($3, last_name),
      phone_number = COALESCE($4, phone_number), 
      email = COALESCE ($5, email) 
      WHERE id = $6 
      RETURNING id`,
      [role, firstName, lastName, phoneNumber, email, id]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete case manager by id with cascade
caseManagersRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Start a transaction to ensure all deletes succeed or fail together
    await db.query('BEGIN');
    
    try {
      // Delete related records in order (respecting foreign key constraints)
      // Delete screener comments first
      await db.query(`DELETE FROM screener_comment WHERE cm_id = $1`, [id]);
      
      // Delete random survey records
      await db.query(`DELETE FROM random_survey_table WHERE cm_id = $1`, [id]);
      
      // Delete intake statistics forms
      await db.query(`DELETE FROM intake_statistics_form WHERE cm_id = $1`, [id]);
      
      // Delete success stories
      await db.query(`DELETE FROM success_story WHERE cm_id = $1`, [id]);
      
      // Delete exit surveys
      await db.query(`DELETE FROM exit_survey WHERE cm_id = $1`, [id]);
      
      // Delete case manager monthly stats
      await db.query(`DELETE FROM cm_monthly_stats WHERE cm_id = $1`, [id]);
      
      // Delete locations
      await db.query(`DELETE FROM locations WHERE cm_id = $1`, [id]);
      
      // Update clients to set created_by to NULL (or handle as needed)
      // Note: This might need different handling based on business logic
      await db.query(`UPDATE clients SET created_by = NULL WHERE created_by = $1`, [id]);
      
      // Finally delete the case manager
      const data = await db.query(`DELETE FROM case_managers WHERE id = $1 RETURNING *`, [id]);
      
      // Commit the transaction
      await db.query('COMMIT');
      
      res.status(200).json(keysToCamel(data));
    } catch (error) {
      // Rollback the transaction if any step fails
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});
