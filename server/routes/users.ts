import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { admin } from "../config/firebase";
import { db } from "../db/db-pgp"; // TODO: replace this db with
import { verifyRole } from "../src/middleware";

export const usersRouter = Router();

// Get all users
usersRouter.get("/", async (req, res) => {
  try {
    const users = await db.query(`SELECT * FROM users ORDER BY id ASC`);

    res.status(200).json(keysToCamel(users));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get a user by ID
usersRouter.get("/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const user = await db.query("SELECT * FROM users WHERE firebase_uid = $1", [
      firebaseUid,
    ]);

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get a user by email
usersRouter.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a user by ID, both in Firebase and NPO DB
usersRouter.delete("/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    await admin.auth().deleteUser(firebaseUid);
    const user = await db.query("DELETE FROM users WHERE firebase_uid = $1", [
      firebaseUid,
    ]);

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a user by email
usersRouter.delete("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await db.query("DELETE FROM users WHERE email = $1", [
      email,
    ]);

    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;
    await admin.auth().deleteUser(uid);

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create user
usersRouter.post("/create", async (req, res) => {
  try {
    const { email, firebaseUid, firstName, lastName, phoneNumber, role } = req.body;

    const user = await db.query(
      "INSERT INTO users (email, firebase_uid, first_name, last_name, phone_number, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [email, firebaseUid, firstName, lastName, phoneNumber, role]
    );

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err);
  }
});

// Create user with invitation
usersRouter.post("/invite", async (req, res) => {
  try {
    const { email, role } = req.body;

    const user = await db.query(
      "INSERT INTO users (email, role) VALUES ($1, $2) RETURNING *",
      [email, role]
    );

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err);
  }
});

// Update a user by ID
usersRouter.put("/update", async (req, res) => {
  try {
    const { email, firebaseUid, firstName, lastName, phoneNumber } = req.body;

    const user = await db.query(
      `UPDATE users
       SET email = COALESCE($1, email), 
       first_name = COALESCE($2, first_name), 
       last_name = COALESCE($3, last_name), 
       phone_number = COALESCE($4, phone_number)
       WHERE firebase_uid = $5
       RETURNING *`,
       [email, firstName, lastName, phoneNumber, firebaseUid]
    );
    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all users (as admin)
usersRouter.get("/admin/all", verifyRole("admin"), async (req, res) => {
  try {
    const users = await db.query(`SELECT * FROM users`);

    res.status(200).json(keysToCamel(users));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update a user's role
usersRouter.put("/update/set-role", verifyRole("admin"), async (req, res) => {
  try {
    const { role, firebaseUid } = req.body;

    const user = await db.query(
      "UPDATE users SET role = $1 WHERE firebase_uid = $2 RETURNING *",
      [role, firebaseUid]
    );

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
