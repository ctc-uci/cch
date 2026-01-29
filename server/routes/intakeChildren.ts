import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const intakeChildrenRouter = Router();

// Get all intake children
intakeChildrenRouter.get("/", async (req, res) => {
  try {
    const children = await db.query(`SELECT * FROM intake_children`);
    res.status(200).json(keysToCamel(children));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get children by parent (intake_client) ID
intakeChildrenRouter.get("/parent/:parentId", async (req, res) => {
  try {
    const { parentId } = req.params;
    const children = await db.query(
      `SELECT * FROM intake_children WHERE parent_id = $1 ORDER BY id ASC`,
      [parentId]
    );
    res.status(200).json(keysToCamel(children));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get single child by ID
intakeChildrenRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const children = await db.query(
      `SELECT * FROM intake_children WHERE id = $1`,
      [id]
    );
    if (children.length === 0) {
      return res.status(404).json({ error: "Child not found" });
    }
    res.status(200).json(keysToCamel(children[0]));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create a new child
intakeChildrenRouter.post("/", async (req, res) => {
  try {
    const { first_name, last_name, parent_id, date_of_birth, reunified, comments } =
      req.body;
    
    const child = await db.query(
      `INSERT INTO intake_children (first_name, last_name, parent_id, date_of_birth, reunified, comments) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [first_name, last_name, parent_id, date_of_birth, reunified ?? false, comments]
    );
    res.status(200).json(keysToCamel(child[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update a child
intakeChildrenRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, parent_id, date_of_birth, reunified, comments } =
      req.body;
    
    const child = await db.query(
      `UPDATE intake_children SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        parent_id = COALESCE($3, parent_id),
        date_of_birth = COALESCE($4, date_of_birth),
        reunified = COALESCE($5, reunified),
        comments = COALESCE($6, comments),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *`,
      [first_name, last_name, parent_id, date_of_birth, reunified, comments, id]
    );

    if (child.length === 0) {
      return res.status(404).json({ error: "Child not found" });
    }
    res.status(200).json(keysToCamel(child[0]));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a child
intakeChildrenRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM intake_children WHERE id = $1`, [id]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

