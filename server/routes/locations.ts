import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

/**
 * Locations router - DEPRECATED.
 * The locations table is deprecated. Case manager location is stored in case_managers.location.
 * Only get-location and update-location are still used (they read/write case_managers.location).
 * All other routes are stubbed and do not touch the database.
 */
export const locationsRouter = Router();

// ----- Still used: read/write case_managers.location (must be registered before /:id) -----

locationsRouter.put("/update-location", async (req, res) => {
  try {
    const { uid, locationName } = req.body;
    const result = await db.query(
      `UPDATE case_managers cm
       SET location = $1
       FROM users u
       WHERE cm.email COLLATE "C" = u.email COLLATE "C" AND u.firebase_uid = $2`,
      [locationName ?? null, uid]
    );
    res.status(200).json(keysToCamel(result));
  } catch (err) {
    res.status(400).send((err as Error).message);
  }
});

locationsRouter.get("/get-location", async (req, res) => {
  try {
    const { uid } = req.query;
    const rows = await db.query(
      `SELECT cm.location AS name
       FROM case_managers cm
       JOIN users u ON cm.email COLLATE "C" = u.email COLLATE "C"
       WHERE u.firebase_uid = $1`,
      [uid]
    );
    res.status(200).json(keysToCamel(rows.length > 0 ? [{ name: rows[0].name }] : []));
  } catch (err) {
    res.status(400).send((err as Error).message);
  }
});

// ----- Stub routes (locations table deprecated) -----

locationsRouter.get("/", (_req, res) => {
  res.status(200).json([]);
});

locationsRouter.post("/", (_req, res) => {
  res.status(201).json([{ id: null }]);
});

locationsRouter.get("/:id", (_req, res) => {
  res.status(404).json({ error: "Not found", message: "Locations API is deprecated." });
});

locationsRouter.put("/:id", (_req, res) => {
  res.status(200).json([{ id: null }]);
});

locationsRouter.delete("/:id", (_req, res) => {
  res.status(200).json([]);
});
