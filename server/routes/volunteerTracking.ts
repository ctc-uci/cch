import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const volunteerRouter = express.Router();
volunteerRouter.use(express.json());

// Get all users Case 1a
volunteerRouter.get("/", async (req, res) => {
  try {
    const users = await db.query(`SELECT * FROM volunteers ORDER BY id ASC`);
    res.status(200).json(keysToCamel(users));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
// Get all users under specific event Case 1b
volunteerRouter.get("/:event", async (req, res) => {
  try {
    const { event } = req.params;
    const users = await db.query(
      `SELECT * FROM volunteers WHERE event_type = $1 ORDER BY id ASC`,
      [event]
    );
    res.status(200).json(keysToCamel(users));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Total number of hours
volunteerRouter.get("/total-hours", async (req, res) => {
  try {
    const data = await db.query(
      `SELECT SUM(hours) AS total_hours FROM volunteers`
    );
    res.status(200).json(keysToCamel(data[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//Total volunteers
volunteerRouter.get("/total-volunteers", async (req, res) => {
  try {
    const data = await db.query(
      `SELECT COUNT(DISTINCT first_name, last_name, email) AS total_volunteers FROM volunteers`
    );
    res.status(200).json(keysToCamel(data[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default volunteerRouter;
