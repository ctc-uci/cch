import { Router } from "express";

/**
 * Units router - DEPRECATED.
 * The units table is deprecated. Client unit is stored as clients.unit_name (VARCHAR).
 * All endpoints are stubbed and do not touch the units table.
 */
export const unitsRouter = Router();

// Stub: return empty array (units table deprecated)
unitsRouter.get("/", async (_req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

// Stub: return 404 (units table deprecated)
unitsRouter.get("/:locationId", async (_req, res) => {
  try {
    res.status(404).json({ error: "Not found", message: "Units API is deprecated." });
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

// Stub: no-op, return 201 (units table deprecated)
unitsRouter.post("/", async (_req, res) => {
  try {
    res.status(201).json([{ id: null }]);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

// Stub: no-op, return 200 (units table deprecated)
unitsRouter.put("/:id", async (_req, res) => {
  try {
    res.status(200).json([{ id: null }]);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

// Stub: no-op, return 200 (units table deprecated)
unitsRouter.delete("/:id", async (_req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});
