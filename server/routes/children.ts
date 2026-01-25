import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const childRouter = Router();

// Get all children
childRouter.get("/", async (req, res) => {
  try {
    const children = await db.query(`SELECT * FROM children ORDER BY id ASC`);
    res.status(200).json(keysToCamel(children));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get children by client/parent ID
childRouter.get("/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const children = await db.query(
      `SELECT * FROM children WHERE parent_id = $1 ORDER BY id ASC`,
      [clientId]
    );
    res.status(200).json(keysToCamel(children));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create a new child
childRouter.post("/", async (req, res) => {
  try {
    const { firstName, lastName, parentId, dateOfBirth, reunified, comments } = req.body;
    
    const child = await db.query(
      `INSERT INTO children (first_name, last_name, parent_id, date_of_birth, reunified, comments) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [firstName, lastName, parentId, dateOfBirth, reunified || false, comments || null]
    );
    res.status(201).json(keysToCamel(child[0]));
  } catch (err) {
    console.error("Error creating child:", err);
    res.status(500).send(err.message);
  }
});

// Update a child by ID
childRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, parentId, dateOfBirth, reunified, comments } = req.body;
    
    const child = await db.query(
      `UPDATE children SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        parent_id = COALESCE($3, parent_id),
        date_of_birth = COALESCE($4, date_of_birth),
        reunified = COALESCE($5, reunified),
        comments = COALESCE($6, comments)
      WHERE id = $7
      RETURNING *`,
      [firstName, lastName, parentId, dateOfBirth, reunified, comments, id]
    );
    
    if (child.length === 0) {
      return res.status(404).json({ error: "Child not found" });
    }
    
    res.status(200).json(keysToCamel(child[0]));
  } catch (err) {
    console.error("Error updating child:", err);
    res.status(400).send(err.message);
  }
});

// Delete a child by ID
childRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const child = await db.query(
      `DELETE FROM children WHERE id = $1 RETURNING *`,
      [id]
    );
    
    if (child.length === 0) {
      return res.status(404).json({ error: "Child not found" });
    }
    
    res.status(200).json(keysToCamel(child[0]));
  } catch (err) {
    console.error("Error deleting child:", err);
    res.status(400).send(err.message);
  }
});
