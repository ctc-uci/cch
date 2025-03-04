import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const caseManagersRouter = Router();

// Get all case managers
caseManagersRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM case_managers;`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all case manager names
caseManagersRouter.get("/names", async (req, res) => {
  try {
    const data = await db.query(`SELECT first_name, last_name FROM case_managers;`);

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

// Insert new case manager
caseManagersRouter.post("/", async (req, res) => {
  try {
    const { role, firstName, lastName, phoneNumber, email } = req.body;
    const data = await db.query(
      `INSERT INTO case_managers (role, first_name, last_name, phone_number, email) VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
      [role, firstName, lastName, phoneNumber, email]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
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

// Delete case manager by id
caseManagersRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(`DELETE FROM case_managers WHERE id = $1`, [
      id,
    ]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
