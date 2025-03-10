import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const childRouter = express.Router();
childRouter.use(express.json());

childRouter.get("/", async (req, res) => {
  try {
    const children = await db.query(`SELECT * FROM children`);
    res.status(200).json(keysToCamel(children));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

childRouter.get("/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const children = await db.query(
      `SELECT ALL * FROM children WHERE parent_id = $1`,
      [clientId]
    );
    res.status(200).json(keysToCamel(children));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

childRouter.post("/", async (req, res) => {
  try {
    const { first_name, last_name, parent_id, date_of_birth, reunified } =
      req.body;
    const child = await db.query(
      `INSERT INTO children (first_name, last_name, parent_id, date_of_birth, reunified, comments) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [first_name, last_name, parent_id, date_of_birth, reunified, comments]
    );
    res.status(200).json(keysToCamel(child));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

childRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, parent_id, date_of_birth, reunified, comment } =
      req.body;
    const user = await db.query(
      `UPDATE "children" SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        parent_id = COALESCE($3, parent_id),
        date_of_birth = COALESCE($4, date_of_birth),
        reunified = COALESCE($5, reunified),
        comments = COALESCE($6, comments)
        WHERE id = $7
        RETURNING id;
        `,
      [first_name, last_name, parent_id, date_of_birth, reunified, comment, id]
    );

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

childRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const child = await db.query(`DELETE FROM children WHERE id = $1`, [id]);
    res.status(200).json(keysToCamel(child));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export { childRouter };
