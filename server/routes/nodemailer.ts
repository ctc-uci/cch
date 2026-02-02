import { Router } from "express";
import { transporter, emailSender, sendEmail } from "../common/transporter";
import { keysToCamel } from "../common/utils";

import dotenv from "dotenv";
dotenv.config();
export const emailRouter = Router();

emailRouter.post("/", (req, res) => {

  const { email, message } = req.body;


  const mail = {
    from: sendEmail,
    to: email,
    subject: "Create your account now!",
    text: message
  }

  transporter.sendMail(mail, (err) => {
    if (err) {
        console.error(err.message);
        res.status(500).send(err.message);
      } else {
        res.status(200).json(keysToCamel(emailSender));
      }
  });
})

