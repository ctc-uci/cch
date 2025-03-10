import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const volunteersRouter = Router();

// GET route to get volunteers
volunteersRouter.get("/", async (req, res) => {
  try {
    const { eventType, startDate, endDate } = req.query;
    let query = `SELECT *,
          ROUND(CAST(hours * value AS DECIMAL), 2) as total
          FROM volunteers`;
    if (eventType || startDate || endDate) {
      query += " WHERE";
    }
    const queryParams = [];
    if( eventType) {
      queryParams.push(` event_type = '${eventType}'`);
    }
    if (startDate) {
      queryParams.push(` date >= '${startDate}'`);
    }
    if (endDate) {
      queryParams.push(` date <= '${endDate}'`);
    }
    query += queryParams.join(" AND");
    query += ` ORDER BY date DESC;`;
    const users = await db.query(query);
    res.status(200).json(keysToCamel(users));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// GET route to get total number of hours from all volunteers
volunteersRouter.get("/total-hours", async (req, res) => {
  try {
    const { eventType, startDate, endDate } = req.query;
    let query = `SELECT SUM(hours) AS total_hours FROM volunteers`;
    if (eventType || startDate || endDate) {
      query += " WHERE";
    }
    const queryParams = [];
    if( eventType) {
      queryParams.push(` event_type = '${eventType}'`);
    }
    if (startDate) {
      queryParams.push(` date >= '${startDate}'`);
    }
    if (endDate) {
      queryParams.push(` date <= '${endDate}'`);
    }
    query += queryParams.join(" AND");
    query += `;`;
    const data = await db.query(
      query
    );
    res.status(200).json(keysToCamel(data[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//GET route to get total number of unique volunteers
volunteersRouter.get("/total-volunteers", async (req, res) => {
  try {
    const { eventType, startDate, endDate } = req.query;
    let query = `SELECT COUNT(DISTINCT (first_name, last_name, email)) AS total_volunteers FROM volunteers`;
    if (eventType || startDate || endDate) {
      query += " WHERE";
    }
    const queryParams = [];
    if( eventType) {
      queryParams.push(` event_type = '${eventType}'`);
    }
    if (startDate) {
      queryParams.push(` date >= '${startDate}'`);
    }
    if (endDate) {
      queryParams.push(` date <= '${endDate}'`);
    }
    query += queryParams.join(" AND");
    query += `;`;
    const data = await db.query(
      query
    );
    res.status(200).json(keysToCamel(data[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST route to create volunteers
volunteersRouter.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, eventType, hours, date, value } =
      req.body;
    const newVolunteer = await db.query(
      `INSERT INTO volunteers (first_name, last_name, email, event_type, date, hours, value) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [firstName, lastName, email, eventType, date, hours, value]
    );
    res.status(201).json(keysToCamel(newVolunteer[0]));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// PUT route to update volunteers
volunteersRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, eventType, date, hours, value } =
    req.body;

  try {
    const updatedVolunteer = await db.query(
      `UPDATE volunteers
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           email = COALESCE($3, email),
           event_type = COALESCE($4, event_type),
           date = COALESCE($5, date),
           hours = COALESCE($6, hours),
           value = COALESCE($7, value)
       WHERE id = $8
       RETURNING *`,
      [firstName, lastName, email, eventType, date, hours, value, id]
    );

    if (updatedVolunteer.length === 0) {
      return res.status(404).send("Volunteer not found");
    }

    res.status(200).json(keysToCamel(updatedVolunteer[0]));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// DELETE route to delete volunteers
volunteersRouter.delete("/", async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send("Invalid input: ids must be a non-empty array");
  }

  try {
    const result = await db.query(
      `DELETE FROM volunteers
       WHERE id = ANY($1::int[])`,
      [ids]
    );

    res.status(204).send({ numRowsDeleted: result.rowCount });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default volunteersRouter;
