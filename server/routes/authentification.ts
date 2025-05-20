import dotenv from "dotenv";
import { Router } from "express";

import { emailSender, sendEmail, transporter } from "../common/transporter";
import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

dotenv.config();
export const authentificationRouter = Router();

authentificationRouter.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.query;
    const data = await db.query(
          ` SELECT 1
        FROM auth_codes AS a
        JOIN users AS u ON u.email = a.email
        WHERE a.email = $1 AND a.code = $2;`,
          [email, code]
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

authentificationRouter.delete("/email", async (req, res) => {
  try {
    const { email } = req.query;
    const data = await db.query(
      `DELETE FROM auth_codes AS a
                                USING users u
                                WHERE a.email = u.email AND a.email = $1;`,
      [email]
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

authentificationRouter.post("/", async (req, res) => {
  try {
    const { email, validUntil } = req.body;

    const code = Math.floor(100000 + Math.random() * 900000);

    const data = await db.query(
      `INSERT INTO auth_codes (code, email, valid_until) VALUES ($1, $2, $3) RETURNING code;`,
      [code, email, validUntil]
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

authentificationRouter.post("/email", (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Email and message are required" });
  }

  const mail = {
    from: sendEmail,
    to: email,
    subject: "Your Two-Factor Authentication Code",
    text: message,
  };

  transporter.sendMail(mail, (err) => {
    if (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    } else {
      res.status(200).json(keysToCamel(emailSender));
    }
  });
});
