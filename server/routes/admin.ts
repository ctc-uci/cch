import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const adminRouter = Router();

// Get all case managers
adminRouter.get("/admins", async (req, res) => {
  try {
    const data = await db.query(`
      SELECT cm.first_name, cm.last_name, cm.email, cm.id, locs.name AS location FROM case_managers AS cm
      LEFT JOIN locations AS locs ON cm.id = locs.cm_id
      WHERE cm.role = 'superadmin' OR cm.role = 'admin';
    `);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all clients
adminRouter.get("/clients", async (req, res) => {
  try {
    const data = await db.query(`
        SELECT c.first_name, c.last_name, c.email, locs.name AS location FROM clients AS c
        INNER JOIN case_managers AS cm ON c.created_by = cm.id
        LEFT JOIN locations AS locs ON cm.id = locs.cm_id;
      `);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

adminRouter.get("/caseManagers", async (req, res) => {
  try {
    const data = await db.query(`
        SELECT cm.id, cm.first_name, cm.last_name, cm.email, locs.name AS location FROM case_managers AS cm
        LEFT JOIN locations AS locs ON cm.id = locs.cm_id
        WHERE cm.role = 'case manager';`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all clients for a specific case manager
adminRouter.get("/:cm_id", async (req, res) => {
  try {
    const { cm_id } = req.params;
    const data = await db.query(
      `
      SELECT c.id, c.first_name, c.last_name FROM clients AS c
      INNER JOIN case_managers AS cm ON c.created_by = cm.id
      WHERE c.created_by = $1`,
      [cm_id]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
