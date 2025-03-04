// TODO: delete sample router file

import express from "express";

import { keysToCamel } from "../common/utils";
import { admin } from "../config/firebase";
import { db } from "../db/db-pgp";

const donationRouter = express.Router();
donationRouter.use(express.json());

donationRouter.get("/", async (req, res) => {
  try {
    // Query database
    const data = await db.query(`SELECT * FROM food_donations`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/date", async (req, res) => {
  try {
    // Query database
    const { date } = req.body;
    const data = await db.query(
      `SELECT * FROM food_donations WHERE date = $1`,
      [date]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.post("/", async (req, res) => {
  try {
    // Destructure req.body
    const { id, date, weight, value, category } = req.body;
    // Do something with request body
    const data = await db.query(
      `INSERT INTO food_donations (id, date, weight, value, category) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [id, date, weight, value, category]
    );

    res.status(200).json(keysToCamel(data[0]["id"]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.put("/:id", async (req, res) => {
  try {
    const { date, weight, value, category } = req.body;
    const { id } = req.params;

    const data = await db.query(
      `UPDATE food_donations SET date = COALESCE($1, date),weight = COALESCE($2, weight),value = COALESCE($3, value),
    category = COALESCE($4, category) WHERE id = $5 RETURNING id`,
      [date, weight, value, category, id]
    );
    // console.log(data[0]);
    res.status(200).json(keysToCamel(data[0]["id"]));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

donationRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.query("DELETE FROM food_donations WHERE id = $1", [
      id,
    ]);

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export { donationRouter };
