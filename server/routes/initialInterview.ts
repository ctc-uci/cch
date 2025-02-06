import { Router } from "express";
import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";
export const initialInterviewRouter = Router();
// Get all initial interview form objects
initialInterviewRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM initial_interview;`);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
