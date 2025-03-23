import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const lastUpdatedRouter = Router();

lastUpdatedRouter.get("/:table_name", async (req, res) => {
  try {
    const { table_name } = req.params;
    const data = await db.query(`SELECT * FROM last_updated WHERE table_name = $1;`, table_name);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
