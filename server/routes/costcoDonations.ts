import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const costcoRouter = express.Router();
costcoRouter.use(express.json());

costcoRouter.get("/", async (req, res) => {
    try {
      const {start, end} = req.query;
      // Query database
      let query = `SELECT * FROM costco_donations`;
      if (start && end) {
        query += ` WHERE date >= '${start}' AND date <= '${end}'`;
      };
      const data = await db.query(query);
  
      res.status(200).json(keysToCamel(data));
    } catch (err) {
      res.status(500).send(err.message);
    }
});

costcoRouter.get("/valueSum", async (req, res) => {
  try {
    // Query database 
    const data = await db.query(
        `SELECT SUM(amount) FROM costco_donations`,
    );
    res.status(200).send(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
costcoRouter.post("/", async (req, res) => {
    try {
      const {date, amount, category} = req.body;
      const data = await db.query(
        `INSERT INTO costco_donations (date, amount, category) VALUES ($1, $2, $3) RETURNING id`,
        [date, amount, category]
      );
      res.status(200).json(keysToCamel(data));
    } catch (err) {
      res.status(500).send(err.message);
    }
});

costcoRouter.put("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {date, amount, category} = req.body;
        const data = await db.query(
            `UPDATE costco_donations SET date = COALESCE($1, date), amount = COALESCE($2, amount), category = COALESCE($3, category)
            WHERE id = $4 RETURNING id`,
            [date, amount, category, id]
        );
        res.status(200).json(keysToCamel(data[0]));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

costcoRouter.delete("/", async (req, res) => {
    try {
        const { ids } = req.body;

        const placeholders = ids.map((_, index) => `$${index + 1}`).join(", ");

        const query = `DELETE FROM costco_donations WHERE id IN (${placeholders})`;
        const data = await db.query(query, ids);

        res.status(200).json(keysToCamel(data));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export { costcoRouter };