import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const authentificationRouter = Router();

// Get auth code by email
authentificationRouter.get("/email", async (req, res) => {
  try {
    const { email } = req.query;
    const data = await db.query(`SELECT a.code
                                 FROM auth_codes AS a
                                    JOIN users AS u ON u.email = a.email
                                 WHERE a.email = $1`, [email]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Insert new auth pin
authentificationRouter.post("/", async (req, res) => {
  try {
    const { email, validUntil } = req.body;

    const code = Math.floor(100000 + Math.random() * 900000);

    const data = await db.query(
      `INSERT INTO auth_codes (code, email, valid_until) VALUES ($1, $2, $3) RETURNING id;`,
      [code, email, validUntil]
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});
