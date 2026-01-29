import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const adminRouter = Router();

// Get all case managers
adminRouter.get("/admins", async (req, res) => {
  try {
    const data = await db.query(`
      SELECT 
        cm.first_name, 
        cm.last_name, 
        cm.phone_number, 
        cm.email, 
        cm.id, 
        cm.notes, 
        locs.name AS location,
        CASE 
          WHEN u.email IS NULL THEN true
          WHEN u.firebase_uid IS NULL OR u.firebase_uid = '' THEN true
          ELSE false
        END AS is_pending
      FROM case_managers AS cm
      LEFT JOIN locations AS locs ON cm.id = locs.cm_id
      LEFT JOIN users AS u ON cm.email COLLATE "C" = u.email COLLATE "C"
      WHERE cm.role = 'superadmin' OR cm.role = 'admin'
      ORDER BY cm.id DESC;
    `);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// // Get all clients
// adminRouter.get("/clients", async (req, res) => {
//   try {
//     const data = await db.query(`
//         SELECT c.first_name, c.last_name, c.email, locs.name AS location FROM clients AS c
//         INNER JOIN case_managers AS cm ON c.created_by = cm.id
//         LEFT JOIN locations AS locs ON cm.id = locs.cm_id;
//       `);
//     res.status(200).json(keysToCamel(data));
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

adminRouter.get("/clients", async (req, res) => {
  try {
    const data = await db.query(`
        SELECT 
          u.first_name, 
          u.last_name, 
          u.email as email, 
          CASE 
            WHEN u.email IS NULL OR u.email = '' THEN true
            ELSE false
          END AS is_pending
        FROM users AS u
        ORDER BY u.id DESC;
      `);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

adminRouter.get("/caseManagers", async (req, res) => {
  try {
    const data = await db.query(`
        SELECT 
          cm.id, 
          cm.first_name, 
          cm.last_name, 
          cm.phone_number, 
          cm.email, 
          cm.notes, 
          locs.name AS location,
          CASE 
            WHEN u.email IS NOT NULL AND (u.firebase_uid IS NULL OR u.firebase_uid = '') THEN true
            ELSE false
          END AS is_pending
        FROM case_managers AS cm
        LEFT JOIN locations AS locs ON cm.id = locs.cm_id
        LEFT JOIN users AS u ON cm.email COLLATE "C" = u.email COLLATE "C"
        WHERE cm.role = 'case manager'
        ORDER BY cm.id DESC;`);

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
      WHERE c.created_by = $1
      ORDER BY c.id DESC`,
      [cm_id]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
