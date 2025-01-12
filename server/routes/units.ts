import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const unitsRouter = Router();

// Get all units
unitsRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM units;`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get units by location id
unitsRouter.get("/:locationId", async (req, res) => {
  try {
    const { locationId } = req.params;
    const data = await db.query(`SELECT * FROM units WHERE location_id = $1`, [
      locationId,
    ]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Insert new unit
unitsRouter.post("/", async (req, res) => {
  try {
    const { locationId, name, type } = req.body;
    const data = await db.query(
      `INSERT INTO units (location_id, name, type) VALUES ($1, $2, $3) RETURNING id;`,
      [locationId, name, type]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update unit by id
unitsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { locationId, name, type } = req.body;
    const data = await db.query(
      `UPDATE units
       SET location_id = COALESCE($1, location_id),
       name = COALESCE($2, name),
       type = COALESCE($3, type)
       WHERE id = $4
       RETURNING id`,
      [locationId, name, type, id]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete unit by id
unitsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(`DELETE FROM units WHERE id = $1`, [id]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
