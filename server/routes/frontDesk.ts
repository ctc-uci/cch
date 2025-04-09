// TODO: delete sample router file

import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const frontDeskRouter = express.Router();
frontDeskRouter.use(express.json());

frontDeskRouter.get("/", async (req, res) => {
  try {
    // Query database
    const data = await db.query(`SELECT * FROM front_desk_monthly`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});


frontDeskRouter.get("/get-stat/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db.query(
      `SELECT * FROM front_desk_monthly WHERE id = $1`,
      [id]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

frontDeskRouter.get("/:date", async (req, res) => {
  try {
    // Query database
    const { date } = req.query;
    const data = await db.query(
      `SELECT * FROM front_desk_monthly WHERE date = $1`,
      [date]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});



frontDeskRouter.get('/stats/:year', async (req, res) => {
  try {
    const { year } = req.params;
    const data = await db.query(`
          SELECT
              DATE_TRUNC('month', date) AS month,
              DATE_TRUNC('year', date) AS year,
              SUM(total_office_visits) AS total_office_visits,
              SUM(total_calls) AS total_calls,
              SUM(total_unduplicated_calls) AS total_unduplicated_calls,
              SUM(total_visits_hb_donations_room) AS total_visits_hb_donations_room,
              SUM(total_served_hb_donations_room) AS total_served_hb_donations_room,
              SUM(total_visits_hb_pantry) AS total_visits_hb_pantry,
              SUM(total_served_hb_pantry) AS total_served_hb_pantry,
              SUM(total_visits_placentia_pantry) AS total_visits_placentia_pantry,
              SUM(total_served_placentia_pantry) AS total_served_placentia_pantry,
              SUM(total_visits_placentia_neighborhood) AS total_visits_placentia_neighborhood,
              SUM(total_served_placentia_neighborhood) AS total_served_placentia_neighborhood
          FROM front_desk_monthly
          WHERE EXTRACT(YEAR FROM date) = $1
          GROUP BY DATE_TRUNC('month', date), DATE_TRUNC('year', date)
          ORDER BY month;
      `, [year]);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

frontDeskRouter.post("/", async (req, res) => {
  try {
    // Destructure req.body
    const {
      id,
      date,
      total_office_visits,
      total_calls,
      total_unduplicated_calles,
      total_visits_to_pantry_and_donations_room,
      total_number_of_people_served_in_pantry,
      total_visits_to_placentia_pantry,
      total_number_of_people_served_in_placentia_pantry,
    } = req.body;
    // Do something with request body
    const data = await db.query(
      `INSERT INTO front_desk_monthly (id, date, total_office_visits, total_calls, total_unduplicated_calles, total_visits_to_pantry_and_donations_room, total_number_of_people_served_in_pantry, total_visits_to_placentia_pantry, total_number_of_people_served_in_placentia_pantry ) VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9) RETURNING id`,
      [
        id,
        date,
        total_office_visits,
        total_calls,
        total_unduplicated_calles,
        total_visits_to_pantry_and_donations_room,
        total_number_of_people_served_in_pantry,
        total_visits_to_placentia_pantry,
        total_number_of_people_served_in_placentia_pantry,
      ]
    );

    res.status(200).json(keysToCamel(data[0]["id"]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

frontDeskRouter.put("/:id", async (req, res) => {
  try {
    const {
      total_office_visits,
      total_calls,
      total_unduplicated_calles,
      total_visits_to_pantry_and_donations_room,
      total_number_of_people_served_in_pantry,
      total_visits_to_placentia_pantry,
      total_number_of_people_served_in_placentia_pantry,
    } = req.body;
    const { id } = req.params;

    const data = await db.query(
      `UPDATE front_desk_monthly SET
    total_office_visits = COALESCE($2, total_office_visits),
    total_calls = COALESCE($3, total_calls),
    total_unduplicated_calles = COALESCE($4, total_unduplicated_calles),
    total_visits_to_pantry_and_donations_room = COALESCE($5, total_visits_to_pantry_and_donations_room),
    total_number_of_people_served_in_pantry = COALESCE($6, total_number_of_people_served_in_pantry),
    total_visits_to_placentia_pantry = COALESCE($7, total_visits_to_placentia_pantry),
    total_number_of_people_served_in_placentia_pantry = COALESCE($8, total_number_of_people_served_in_placentia_pantry)  WHERE id = $9 RETURNING id`,
      [
        total_office_visits,
        total_calls,
        total_unduplicated_calles,
        total_visits_to_pantry_and_donations_room,
        total_number_of_people_served_in_pantry,
        total_visits_to_placentia_pantry,
        total_number_of_people_served_in_placentia_pantry,
        id,
      ]
    );
    // console.log(data[0]);
    res.status(200).json(keysToCamel(data[0]["id"]));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

frontDeskRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.query(
      "DELETE FROM front_desk_monthly WHERE id = $1",
      [id]
    );

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export { frontDeskRouter };
