import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const successRouter = express.Router();
successRouter.use(express.json());

successRouter.get("/", async (req, res) => {
  try {
    const success = await db.query(`SELECT * FROM success_story`);
    res.status(200).json(keysToCamel(success));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

successRouter.get("/search-filter", async (req, res) => {
  try {
    const { search, page, filter } = req.query;
    let queryStr = `
      SELECT ss.*, cm.first_name AS cm_first_name, cm.last_name AS cm_last_name, l.name AS location
      FROM success_story AS ss
      INNER JOIN case_managers AS cm ON ss.cm_id = cm.id
      INNER JOIN locations AS l ON ss.site = l.id
      WHERE 1=1
    `;

    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      queryStr += ` 
      AND (ss.id::TEXT ILIKE ${stringSearch}
        OR ss.previous_situation::TEXT ILIKE ${stringSearch}
        OR ss.cch_impact::TEXT ILIKE ${stringSearch}
        OR ss.where_now::TEXT ILIKE ${stringSearch}
        OR ss.tell_donors::TEXT ILIKE ${stringSearch}
        OR ss.quote::TEXT ILIKE ${stringSearch}
        OR ss.entrance_date::TEXT ILIKE ${stringSearch}
        OR ss.exit_date::TEXT ILIKE ${stringSearch}
        OR cm.first_name::TEXT ILIKE ${stringSearch}
        OR cm.last_name::TEXT ILIKE ${stringSearch}
        OR l.name::TEXT ILIKE ${stringSearch}
      )`;
    }

    if (filter) {
      queryStr += `AND ${filter}`;
    }

    queryStr += " ORDER BY ss.id ASC";

    if (page) {
      queryStr += ` LIMIT ${page}`;
    }

    const success_story = await db.query(queryStr);
    res.status(200).json(keysToCamel(success_story));
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

successRouter.get("/table-data", async (req, res) => {
  try {
    const success = await db.query(`
      SELECT
        ss.id AS id, 
        cm.first_name AS cm_first_name,
        cm.last_name AS cm_last_name,
        l.name AS location,
        ss.entrance_date,
        ss.exit_date,
        ss.previous_situation,
        ss.where_now,
        ss.cch_impact,
        ss.tell_donors,
        ss.quote
      FROM success_story AS ss
      INNER JOIN locations AS l ON ss.site = l.id
      INNER JOIN case_managers AS cm ON ss.cm_id = cm.id
      `);
    res.status(200).json(keysToCamel(success));
  } catch (err) {
    res.status(400).send(err.message);
  }
});


successRouter.get("/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const children = await db.query(
      `SELECT * FROM success_story WHERE client_id = $1`,
      [clientId]
    );
    res.status(200).json(keysToCamel(children));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

successRouter.post("/", async (req, res) => {
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

    const success = await db.query(
      `INSERT INTO success_story 
            (date, client_id, name, cm_id, previous_situation, cch_impact, where_now, tell_donors, quote, consent, site, exit_date, entrance_date) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
            RETURNING id`,
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
        consent,
        site,
        exit_date,
        entrance_date,
      ]
    );
    res.status(200).json(keysToCamel(success));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

successRouter.put("/:id", async (req, res) => {
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

    const user = await db.query(
      `UPDATE success_story SET
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
            entrance_date = COALESCE($12, entrance_date)
            WHERE id = $13
            RETURNING id`,
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

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

successRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await db.query(`DELETE FROM success_story WHERE id = $1`, [
      id,
    ]);
    res.status(200).json(keysToCamel(success));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export { successRouter };
