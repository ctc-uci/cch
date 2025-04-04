import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const intakeStatsFormRouter = Router();

// Get all initial interview form objects
intakeStatsFormRouter.post("/", async (req, res) => {
  try {
    // Insert data into intake stats form table
    // get attributes from request body
    // connect to db and perform insert with attributes from request body
    // need to insert data into table for intake stats form, as well as children data, if applicable
    console.log(req.body)
    console.log("Posting to database");
  } catch (err) {
    res.status(500).send(err.message);
  }
  
});
