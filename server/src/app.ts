import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import schedule from "node-schedule"; // TODO: Keep only if scheduling cronjobs

import { caseManagerMonthlyStatsRouter } from "../routes/caseManagerMonthlyStats.js";
import { caseManagersRouter } from "../routes/caseManagers";
import { childRouter } from "../routes/children";
import { clientsRouter } from "../routes/clients";
import { exitSurveyRouter } from "../routes/exitSurvey"; // TODO: delete sample router

import { donationRouter } from "../routes/foodDonations";
import { frontDeskRouter } from "../routes/frontDesk";
import { locationsRouter } from "../routes/locations";
import { randomSurveyRouter } from "../routes/randomSurvey";
import { successRouter } from "../routes/successStory";
import { screenerCommentRouter } from "../routes/screenerComment.js";
import { initialInterviewRouter } from "../routes/initialInterview.js";
import { unitsRouter } from "../routes/units";
import { usersRouter } from "../routes/users";
import { verifyToken } from "./middleware";
import { clientDataRouter } from "../routes/clientData";
import { adminRouter } from "../routes/admin";

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
app.use("/foodDonations", donationRouter);
app.use("/frontDesk", frontDeskRouter);
app.use("/clients", clientsRouter);
app.use("/caseManagerMonthlyStats", caseManagerMonthlyStatsRouter);
app.use("/admin", adminRouter);
app.use("/clientData", clientDataRouter);
app.use("/screenerComment", screenerCommentRouter);
app.use("/initialInterview", initialInterviewRouter);

app.listen(SERVER_PORT, () => {
  console.info(`Server listening on ${SERVER_PORT}`);
});
