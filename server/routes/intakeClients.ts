import { Router } from "express";

/**
 * Intake clients router - DEPRECATED.
 * Use /clients and the main clients table instead. This API is stubbed and no longer
 * reads or writes the intake_clients table. For lookups by email, use GET /clients/email/:email.
 */
export const intakeClientsRouter = Router();

// ----- Stub routes (must register /email/:email before /:id) -----

intakeClientsRouter.get("/", (_req, res) => {
  res.status(200).json([]);
});

intakeClientsRouter.get("/email/:email", (_req, res) => {
  res.status(200).json([]);
});

intakeClientsRouter.get("/:id", (_req, res) => {
  res.status(404).json({ error: "Not found", message: "Intake clients API is deprecated. Use /clients instead." });
});

intakeClientsRouter.post("/", (_req, res) => {
  res.status(201).json({ id: null });
});

intakeClientsRouter.put("/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({ id: id ? parseInt(id, 10) : null });
});

intakeClientsRouter.delete("/:id", (_req, res) => {
  res.status(200).json({ success: true });
});
