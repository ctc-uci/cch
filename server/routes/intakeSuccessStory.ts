import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const intakeSuccessStoryRouter = Router();

// Get all intake success stories
intakeSuccessStoryRouter.get("/", async (req, res) => {
  try {
    const stories = await db.query(`SELECT * FROM intake_success_story`);
    res.status(200).json(keysToCamel(stories));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Search and filter success stories
intakeSuccessStoryRouter.get("/search-filter", async (req, res) => {
  try {
    const { search, page, filter } = req.query;
    let queryStr = `
      SELECT iss.*, cm.first_name AS cm_first_name, cm.last_name AS cm_last_name, l.name AS location
      FROM intake_success_story AS iss
      INNER JOIN case_managers AS cm ON iss.cm_id = cm.id
      LEFT JOIN locations AS l ON iss.site = l.id
      WHERE 1=1
    `;

    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      queryStr += ` 
      AND (iss.id::TEXT ILIKE ${stringSearch}
        OR iss.previous_situation::TEXT ILIKE ${stringSearch}
        OR iss.cch_impact::TEXT ILIKE ${stringSearch}
        OR iss.where_now::TEXT ILIKE ${stringSearch}
        OR iss.tell_donors::TEXT ILIKE ${stringSearch}
        OR iss.quote::TEXT ILIKE ${stringSearch}
        OR iss.entrance_date::TEXT ILIKE ${stringSearch}
        OR iss.exit_date::TEXT ILIKE ${stringSearch}
        OR cm.first_name::TEXT ILIKE ${stringSearch}
        OR cm.last_name::TEXT ILIKE ${stringSearch}
        OR l.name::TEXT ILIKE ${stringSearch}
      )`;
    }

    if (filter) {
      queryStr += ` AND ${filter}`;
    }

    queryStr += " ORDER BY iss.id ASC";

    if (page) {
      queryStr += ` LIMIT ${page}`;
    }

    const stories = await db.query(queryStr);
    res.status(200).json(keysToCamel(stories));
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

// Get success stories with joined data for table display
intakeSuccessStoryRouter.get("/table-data", async (req, res) => {
  try {
    const stories = await db.query(`
      SELECT
        iss.id AS id, 
        cm.first_name AS cm_first_name,
        cm.last_name AS cm_last_name,
        l.name AS location,
        iss.entrance_date,
        iss.exit_date,
        iss.previous_situation,
        iss.where_now,
        iss.cch_impact,
        iss.tell_donors,
        iss.quote
      FROM intake_success_story AS iss
      LEFT JOIN locations AS l ON iss.site = l.id
      INNER JOIN case_managers AS cm ON iss.cm_id = cm.id
    `);
    res.status(200).json(keysToCamel(stories));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get success stories by client ID
intakeSuccessStoryRouter.get("/client/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const stories = await db.query(
      `SELECT * FROM intake_success_story WHERE client_id = $1`,
      [clientId]
    );
    res.status(200).json(keysToCamel(stories));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get single success story by ID
intakeSuccessStoryRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const stories = await db.query(
      `SELECT * FROM intake_success_story WHERE id = $1`,
      [id]
    );
    if (stories.length === 0) {
      return res.status(404).json({ error: "Success story not found" });
    }
    res.status(200).json(keysToCamel(stories[0]));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create a new success story
intakeSuccessStoryRouter.post("/", async (req, res) => {
  try {
    const {
      date,
      client_id,
      name,
      cm_id,
      previous_situation,
      cch_impact,
      where_now,
      tell_donors,
      quote,
      consent,
      site,
      exit_date,
      entrance_date,
    } = req.body;

    const story = await db.query(
      `INSERT INTO intake_success_story 
        (date, client_id, name, cm_id, previous_situation, cch_impact, where_now, tell_donors, quote, consent, site, exit_date, entrance_date) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
        RETURNING *`,
      [
        date,
        client_id,
        name,
        cm_id,
        previous_situation,
        cch_impact,
        where_now,
        tell_donors,
        quote,
        consent ?? false,
        site,
        exit_date,
        entrance_date,
      ]
    );
    res.status(200).json(keysToCamel(story[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update a success story
intakeSuccessStoryRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      date,
      client_id,
      cm_id,
      previous_situation,
      cch_impact,
      where_now,
      tell_donors,
      quote,
      consent,
      site,
      exit_date,
      entrance_date,
    } = req.body;

    const story = await db.query(
      `UPDATE intake_success_story SET
        date = COALESCE($1, date),
        client_id = COALESCE($2, client_id),
        cm_id = COALESCE($3, cm_id),
        previous_situation = COALESCE($4, previous_situation),
        cch_impact = COALESCE($5, cch_impact),
        where_now = COALESCE($6, where_now),
        tell_donors = COALESCE($7, tell_donors),
        quote = COALESCE($8, quote),
        consent = COALESCE($9, consent),
        site = COALESCE($10, site),
        exit_date = COALESCE($11, exit_date),
        entrance_date = COALESCE($12, entrance_date),
        updated_at = CURRENT_TIMESTAMP
        WHERE id = $13
        RETURNING *`,
      [
        date,
        client_id,
        cm_id,
        previous_situation,
        cch_impact,
        where_now,
        tell_donors,
        quote,
        consent,
        site,
        exit_date,
        entrance_date,
        id,
      ]
    );

    if (story.length === 0) {
      return res.status(404).json({ error: "Success story not found" });
    }
    res.status(200).json(keysToCamel(story[0]));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a success story
intakeSuccessStoryRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM intake_success_story WHERE id = $1`, [id]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

