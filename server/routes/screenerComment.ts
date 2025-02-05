import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const screenerCommentRouter = Router();

// Get all screener comment forms
screenerCommentRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM screener_comment;`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});