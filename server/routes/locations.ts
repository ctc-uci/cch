import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const locationsRouter = Router();

// Get all locations
locationsRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM locations;`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

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
