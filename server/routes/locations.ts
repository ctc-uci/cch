import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

/**
 * Locations router - DEPRECATED.
 * The locations table is deprecated. Case manager location is stored in case_managers.location.
 * Only get-location and update-location are still used (they read/write case_managers.location).
 * All other endpoints are stubbed and do not touch the locations table.
 */
export const locationsRouter = Router();

// Stub: return empty array (locations table deprecated)
locationsRouter.get("/", async (_req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

// Still used: writes to case_managers.location
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

// Still used: reads from case_managers.location
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

// Stub: return 404 (locations table deprecated)
locationsRouter.get("/:id", async (req, res) => {
  try {
    res.status(404).json({ error: "Not found", message: "Locations API is deprecated." });
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

// Stub: no-op, return 201 (locations table deprecated)
locationsRouter.post("/", async (_req, res) => {
  try {
    res.status(201).json([{ id: null }]);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

// Stub: no-op, return 200 (locations table deprecated)
locationsRouter.put("/:id", async (_req, res) => {
  try {
    res.status(200).json([{ id: null }]);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

// Stub: no-op, return 200 (locations table deprecated)
locationsRouter.delete("/:id", async (_req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});
