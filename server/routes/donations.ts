// TODO: delete sample router file

import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const donationRouter = express.Router();
donationRouter.use(express.json());

donationRouter.get("/", async (req, res) => {
  try {
    // Query database
    const data = await db.query(`SELECT * FROM donations`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/date", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await db.query(
      `SELECT * FROM food_donations WHERE date >= $1 AND date < $2`,
      [startDate, endDate]
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/valueSum", async (req, res) => {
  try {
    const data = await db.query(
        `SELECT SUM(value) FROM donations`,
    );
    res.status(200).send(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/weightSum", async (req, res) => {
  try {
    const data = await db.query(
        `SELECT SUM(weight) FROM donations`,
    );
    res.status(200).send(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/filter/", async (req, res) => {
  try {
    // Query database
    const { donor, startDate, endDate } = req.query;
    let query = `SELECT * FROM donations`;
    if (donor || startDate || endDate) {
      query += " WHERE";
    }
    if (donor) {
      query += ` donor = '${donor}'`;
    }
    if (startDate) {
      query += ` date >= '${startDate}'`;
    }
    if (endDate) {
      query += ` date <= '${endDate}'`;
    }
    const data = await db.query(query);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.post("/", async (req, res) => {
  try {
    const { date, weight, value, donor } = req.body;
    const data = await db.query(
      `INSERT INTO donations (date, weight, value, donor) VALUES ($1, $2, $3, $4) RETURNING id`,
      [date, weight, value, donor]
    );

    res.status(200).json(keysToCamel(data[0]["id"]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.put("/:id", async (req, res) => {
  try {
    const { date, weight, value, donor } = req.body;
    const { id } = req.params;

    const data = await db.query(
      `UPDATE donations SET date = COALESCE($1, date),weight = COALESCE($2, weight),value = COALESCE($3, value),
    category = COALESCE($4, donor) WHERE id = $5 RETURNING id`,
      [date, weight, value, donor, id]
    );
    // console.log(data[0]);
    res.status(200).json(keysToCamel(data[0]["id"]));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

donationRouter.delete("/", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) {
      return res.status(200).json();
    }
    const placeholders = ids.map((_item: number, index: number) => `$${index + 1}`).join(",");

    const query = `DELETE FROM donations WHERE id IN (${placeholders})`;
    await db.query(query, ids);

    res.status(200).json();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export { donationRouter };
