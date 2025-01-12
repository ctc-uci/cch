import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import schedule from "node-schedule"; // TODO: Keep only if scheduling cronjobs

import { exitSurveyRouter } from "../routes/exitSurvey"; // TODO: delete sample router
import { randomSurveyRouter } from "../routes/randomSurvey";
import { caseManagerMonthlyStatsRouter } from "../routes/caseManagerMonthlyStats.js";
import { usersRouter } from "../routes/users";
import { childRouter } from "../routes/children";
import { successRouter } from "../routes/successStory";
import { caseManagersRouter } from "../routes/caseManagers";
import { locationsRouter } from "../routes/locations"
import { unitsRouter } from "../routes/units"
import { clientsRouter } from '../routes/clients'
import { verifyToken } from "./middleware";
import { donationRouter } from "../routes/foodDonations";
import { frontDeskRouter } from "../routes/frontDesk";

dotenv.config();

schedule.scheduleJob("0 0 0 0 0", () => console.info("Hello Cron Job!")); // TODO: delete sample cronjob

const CLIENT_HOSTNAME =
  process.env.NODE_ENV === "development"
    ? `${process.env.DEV_CLIENT_HOSTNAME}:${process.env.DEV_CLIENT_PORT}`
    : process.env.PROD_CLIENT_HOSTNAME;

const SERVER_PORT =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_SERVER_PORT
    : process.env.PROD_SERVER_PORT;

const app = express();
app.use(
  cors({
    origin: CLIENT_HOSTNAME,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV === "production") {
  app.use(verifyToken);
}

app.use("/exitSurvey", exitSurveyRouter);
app.use("/users", usersRouter);
app.use("/children", childRouter);
app.use("/successStory", successRouter);
app.use("/caseManagers", caseManagersRouter);
app.use("/locations", locationsRouter);
app.use("/units", unitsRouter);
app.use("/randomSurvey", randomSurveyRouter);
app.use("/foodDonations",donationRouter);
app.use("/frontDesk", frontDeskRouter);
app.use('/clients', clientsRouter)
app.use("/caseManagerMonthlyStats", caseManagerMonthlyStatsRouter);

app.listen(SERVER_PORT, () => {
  console.info(`Server listening on ${SERVER_PORT}`);
});
