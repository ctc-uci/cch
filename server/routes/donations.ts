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
    const { donor, startDate, endDate } = req.query;
    let query = `SELECT SUM(value*weight) FROM donations`;
    if (donor || startDate || endDate) {
      query += " WHERE";
    }
    const queryParams = [];
    if (donor) {
      queryParams.push(` donor = '${donor}'`);
    }
    if (startDate) {
      queryParams.push(` date >= '${startDate}'`);
    }
    if (endDate) {
      queryParams.push(` date <= '${endDate}'`);
    }
    query += queryParams.join(" AND");
    const data = await db.query(
        query
    );
    res.status(200).send(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/weightSum", async (req, res) => {
  try {
    const { donor, startDate, endDate } = req.query;
    let query = `SELECT SUM(ROUND(CAST(weight * value AS DECIMAL), 2)) FROM donations`;
    if (donor || startDate || endDate) {
      query += " WHERE";
    }
    const queryParams = [];
    if (donor) {
      queryParams.push(` donor = '${donor}'`);
    }
    if (startDate) {
      queryParams.push(` date >= '${startDate}'`);
    }
    if (endDate) {
      queryParams.push(` date <= '${endDate}'`);
    }
    query += queryParams.join(" AND");
    const data = await db.query(
        query
    );
    res.status(200).send(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/filter/", async (req, res) => {
  try {
    // Query database
    const { donor, startDate, endDate, } = req.query;
    let query = `SELECT *, ROUND(CAST(weight * value AS DECIMAL), 2) as total FROM donations`;
    if (donor || startDate || endDate) {
      query += " WHERE";
    }
    const queryParams = [];
    if (donor) {
      queryParams.push(` donor = '${donor}'`);
    }
    if (startDate) {
      queryParams.push(` date >= '${startDate}'`);
    }
    if (endDate) {
      queryParams.push(` date <= '${endDate}'`);
    }
    query += queryParams.join(" AND");
    query += ` ORDER BY date DESC`;  
    const data = await db.query(query);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/monthfilter/", async (req, res) => {
  try {
    const { donor, startDate, endDate} = req.query;
    let query = `SELECT 
                  donor,
                  category,
                  TO_CHAR(date, 'FMMonth YYYY') AS month_year,
                  ROUND(SUM(weight * value)::numeric, 2) AS total_value,
                  ROUND(SUM(weight)::numeric, 2) AS total_weight,
                  MAX(date) AS latest_date
                FROM donations`;
    if (donor || startDate || endDate) {
      query += " WHERE";
    }
    const queryParams = [];
    if (donor) {
      queryParams.push(` donor = '${donor}'`);
    }
    if (startDate) {
      queryParams.push(` date >= '${startDate}'`);
    }
    if (endDate) {
      queryParams.push(` date <= '${endDate}'`);
    }
    query += queryParams.join(" AND");
    query += ` GROUP BY donor, category, month_year`;
    query += ` ORDER BY latest_date DESC`;    
    
    const data = await db.query(query);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/yearfilter/", async (req, res) => {
  try {
    const { donor, startDate, endDate} = req.query;
    let query = `SELECT 
                  donor,
                  category,
                  TO_CHAR(date, 'FMYYYY') AS month_year,
                  ROUND(SUM(weight * value)::numeric, 2) AS total_value,
                  ROUND(SUM(weight)::numeric, 2) AS total_weight,
                  MAX(date) AS latest_date
                FROM donations`;
    if (donor || startDate || endDate) {
      query += " WHERE";
    }
    const queryParams = [];
    if (donor) {
      queryParams.push(` donor = '${donor}'`);
    }
    if (startDate) {
      queryParams.push(` date >= '${startDate}'`);
    }
    if (endDate) {
      queryParams.push(` date <= '${endDate}'`);
    }
    query += queryParams.join(" AND");
    query += ` GROUP BY donor, category, month_year`;
    query += ` ORDER BY latest_date DESC`;    
    
    const data = await db.query(query);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.post("/", async (req, res) => {
  try {
    const { date, weight, value, donor, category } = req.body;
    const data = await db.query(
      `INSERT INTO donations (date, weight, value, donor, category) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [date, weight, value, donor, category]
    );

    res.status(200).json(keysToCamel(data[0]["id"]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.put("/:id", async (req, res) => {
  try {
    const { date, weight, value, donor, category } = req.body;
    const { id } = req.params;

    const data = await db.query(
      `UPDATE donations SET date = COALESCE($1, date),weight = COALESCE($2, weight),value = COALESCE($3, value),
    donor = COALESCE($4, donor), category = COALESCE($5, category) WHERE id = $6 RETURNING id`,
      [date, weight, value, donor, category, id]
    );
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
