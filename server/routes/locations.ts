import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const locationsRouter = Router();

// Get all locations
locationsRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT DISTINCT ON (name) *
                                 FROM locations
                                 ORDER BY name, id;`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

locationsRouter.put("/update-location", async (req, res) => {
  try {
    const { uid, locationName, date, calOptimaFunded } = req.body;

    const location = await db.query(
      `UPDATE locations l
       SET name = $1,
           date = $2,
           caloptima_funded = $3
       FROM case_managers cm JOIN users u ON cm.email = u.email
       WHERE l.cm_id = cm.id AND u.firebase_uid = $4`,
      [locationName, date, calOptimaFunded, uid]
    );

    res.status(200).json(keysToCamel(location));
  } catch (err) {
    res.status(400).send(err.message);
  }
})

locationsRouter.get("/get-location", async (req, res) => {
  try {
    const { uid } = req.query;

    const location = await db.query(`SELECT l.*
                                     FROM locations l
                                            JOIN case_managers cm ON l.cm_id = cm.id
                                            JOIN users u ON cm.email = u.email
                                     WHERE u.firebase_uid = $1;`, [
      uid,
    ]);

    res.status(200).json(keysToCamel(location));
  } catch (err) {
    res.status(400).send(err.message);
  }
})

// Get location by id
locationsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(`SELECT * FROM locations WHERE id = $1`, [id]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Insert new location
locationsRouter.post("/", async (req, res) => {
  try {
    const { cmId, name, date, caloptimaFunded } = req.body;
    const data = await db.query(
      `INSERT INTO locations (cm_id, name, date, caloptima_funded) VALUES ($1, $2, $3, $4) RETURNING id;`,
      [cmId, name, date, caloptimaFunded]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update location by id
locationsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cmId, name, date, caloptimaFunded } = req.body;
    const data = await db.query(
      `UPDATE locations
      SET cm_id = COALESCE($1, cm_id),
      name = COALESCE($2, name),
      date = COALESCE($3, date),
      caloptima_funded = COALESCE($4, caloptima_funded)
      WHERE id = $5 RETURNING id`,
      [cmId, name, date, caloptimaFunded, id]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete location by id
locationsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(`DELETE FROM locations WHERE id = $1`, [id]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
