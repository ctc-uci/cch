import dotenv from "dotenv";
import { Router } from "express";

import { emailSender, sendEmail, transporter } from "../common/transporter";
import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";
import { admin } from "../config/firebase";

dotenv.config();
export const authentificationRouter = Router();

authentificationRouter.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.query;
    const data = await db.query(
          ` SELECT 1
        FROM auth_codes AS a
        JOIN users AS u ON u.email COLLATE "C" = a.email COLLATE "C"
        WHERE a.email COLLATE "C" = $1 AND a.code = $2;`,
          [email, code]
    );
    return res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
    console.error(err);
  }
});

authentificationRouter.delete("/email", async (req, res) => {
  try {
    const { email } = req.query;
    const data = await db.query(
      `DELETE FROM auth_codes AS a
                                USING users u
                                WHERE a.email COLLATE "C" = u.email COLLATE "C" AND a.email COLLATE "C" = $1;`,
      [email]
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

authentificationRouter.post("/", async (req, res) => {
  try {
    const { email, validUntil } = req.body;

    const code = Math.floor(100000 + Math.random() * 900000);

    const data = await db.query(
      `
      INSERT INTO auth_codes (code, email, valid_until, created_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP, $3)
      ON CONFLICT (email)
      DO UPDATE SET code = $1, created_at = CURRENT_TIMESTAMP, valid_until = $3;`,
      [code, email, validUntil]
    );

   const message = `Hi,

          Your two-factor authentication (2FA) code is:

          ${code}

          This code will expire in 24 hours. If you did not request this code, please ignore this email or contact our support team immediately.

          Stay secure,

          Collete's Children's Home
          `;

  if (!email) {
    return res.status(400).json({ error: "Email and message are required" });
  }

  const mail = {
    from: "cchautomatedemail@gmail.com",
    to: email,
    subject: "Your Two-Factor Authentication Code",
    text: message,
  };

  transporter.sendMail(mail);
  return res.status(200).json(keysToCamel(data));
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
      console.error(err.message);
      res.status(500).send(err.message);
    } else {
      res.status(200).json(keysToCamel(emailSender));
    }
  });
});

authentificationRouter.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user exists in Firebase
    try {
      await admin.auth().getUserByEmail(email);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        return res.status(400).json({ error: "No user found with that email address" });
      }
      throw err;
    }

    // Generate 6-digit reset code (similar to 2FA)
    const code = Math.floor(100000 + Math.random() * 900000);

    // Store reset code in database (using auth_codes table with a type indicator or separate handling)
    // For now, we'll use the same table but could add a type column later
    // Use database function to calculate valid_until to ensure timezone consistency
    await db.query(
      `
      INSERT INTO auth_codes (code, email, valid_until, created_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '1 hour', CURRENT_TIMESTAMP)
      ON CONFLICT (email)
      DO UPDATE SET code = $1, created_at = CURRENT_TIMESTAMP, valid_until = CURRENT_TIMESTAMP + INTERVAL '1 hour';`,
      [code, email]
    );

    const resetUrl = process.env.NODE_ENV === "development"
      ? `${process.env.DEV_CLIENT_HOSTNAME}:${process.env.DEV_CLIENT_PORT}/reset-password?email=${encodeURIComponent(email)}&code=${code}`
      : `${process.env.PROD_CLIENT_HOSTNAME}/reset-password?email=${encodeURIComponent(email)}&code=${code}`;

    const message = `Hi,

You requested to reset your password for your Collete's Children's Home account.

Click the link below to reset your password:

${resetUrl}

This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact our support team immediately.

Stay secure,

Collete's Children's Home`;

    const mail = {
      from: "cchautomatedemail@gmail.com",
      to: email,
      subject: "Reset Your Password",
      text: message,
    };

    await transporter.sendMail(mail);
    return res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (err) {
    console.error("Error sending password reset email:", err);
    
    return res.status(500).send(err.message || "Failed to send password reset email");
  }
});

authentificationRouter.post("/verify-reset-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }

    // Verify the reset code
    const data = await db.query(
      `SELECT 1
       FROM auth_codes
       WHERE email COLLATE "C" = $1 AND code = $2 AND valid_until > CURRENT_TIMESTAMP`,
      [email, code]
    );

    if (data.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    return res.status(200).json({ message: "Reset code verified successfully" });
  } catch (err) {
    console.error("Error verifying reset code:", err);
    return res.status(500).send(err.message || "Failed to verify reset code");
  }
});

authentificationRouter.post("/confirm-reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "Email, code, and new password are required" });
    }

    // Verify the reset code
    const verifyData = await db.query(
      `SELECT 1
       FROM auth_codes
       WHERE email COLLATE "C" = $1 AND code = $2 AND valid_until > CURRENT_TIMESTAMP`,
      [email, code]
    );

    if (verifyData.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    // Get user from Firebase
    const user = await admin.auth().getUserByEmail(email);

    // Update password using Firebase Admin SDK
    await admin.auth().updateUser(user.uid, {
      password: newPassword,
    });

    // Delete the used reset code
    await db.query(
      `DELETE FROM auth_codes WHERE email COLLATE "C" = $1 AND code = $2`,
      [email, code]
    );

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error resetting password:", err);
    
    if (err.code === "auth/user-not-found") {
      return res.status(400).json({ error: "No user found with that email address" });
    }
    
    if (err.code === "auth/weak-password") {
      return res.status(400).json({ error: "Password is too weak. Please choose a stronger password." });
    }
    
    return res.status(500).send(err.message || "Failed to reset password");
  }
});
