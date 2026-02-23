import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const clientDataRouter = Router();

// Get all case managers (no JOIN to deprecated units table; type is no longer available)
clientDataRouter.get("/", async (req, res) => {
  try {
    const rows = await db.query(
      `SELECT c.id, c.first_name, c.last_name, c.unit_name, c.bed_nights_children,
              cm.first_name AS cm_first, cm.last_name AS cm_last, cm.location AS l_name
       FROM clients AS c
       INNER JOIN case_managers AS cm ON cm.id = c.created_by`
    );
    const data = rows.map((r: { [k: string]: unknown }) => ({ ...r, type: null }));
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
