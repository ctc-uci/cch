import { Router } from "express";
import { transporter, emailSender, sendEmail } from "../common/transporter";
import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";


import dotenv from "dotenv";
dotenv.config();
// export const emailRouter = Router();

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

// Delete auth code by email
authentificationRouter.delete("/email", async (req, res) => {
  try {
    const { email } = req.query;
    const data = await db.query(`DELETE FROM auth_codes AS a
                                USING users u
                                WHERE a.email = u.email AND a.email = $1;`, [email])
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// Insert new auth pin
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
  }

  transporter.sendMail(mail, (err) => {
    if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        res.status(200).json(keysToCamel(emailSender));
      }
  });
})