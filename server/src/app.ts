import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import schedule from "node-schedule"; // TODO: Keep only if scheduling cronjobs

import { adminRouter } from "../routes/admin";
import { caseManagerMonthlyStatsRouter } from "../routes/caseManagerMonthlyStats.js";
import { caseManagersRouter } from "../routes/caseManagers";
import { childRouter } from "../routes/children";
import { clientDataRouter } from "../routes/clientData";
import { clientsRouter } from "../routes/clients";
import { exitSurveyRouter } from "../routes/exitSurvey";
import { donationRouter } from "../routes/donations";
import { frontDeskRouter } from "../routes/frontDesk";
import { initialInterviewRouter } from "../routes/initialInterview";
import { locationsRouter } from "../routes/locations";
import { randomSurveyRouter } from "../routes/randomSurvey";
import { screenerCommentRouter } from "../routes/screenerComment";
import { successRouter } from "../routes/successStory";
import { unitsRouter } from "../routes/units";
import { usersRouter } from "../routes/users";
import { verifyToken } from "./middleware";
import { intakeStatsFormRouter } from "../routes/intakeStatsForm.js";
import { calculateMonthlyStats } from "../routes/calculateMonthlyStats";
import { formsCombinedRouter } from "../routes/formsCombined.js";
import { requestRouter } from "../routes/request.js";
import { volunteersRouter } from "../routes/volunteers";
import { lastUpdatedRouter } from "../routes/lastUpdated";
import { emailRouter } from "../routes/nodemailer";
import { authentificationRouter } from "../routes/authentification";

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
app.use("/donations", donationRouter);
app.use("/frontDesk", frontDeskRouter);
app.use("/clients", clientsRouter);
app.use("/caseManagerMonthlyStats", caseManagerMonthlyStatsRouter);
app.use("/admin", adminRouter);
app.use("/clientData", clientDataRouter);
app.use("/screenerComment", screenerCommentRouter);
app.use("/initialInterview", initialInterviewRouter);
app.use("/intakeStatsForm", intakeStatsFormRouter);
app.use("/calculateMonthlyStats", calculateMonthlyStats);
app.use("/formsCombined", formsCombinedRouter);
app.use("/request", requestRouter);
app.use("/volunteers", volunteersRouter);
app.use("/lastUpdated", lastUpdatedRouter);
app.use("/email", emailRouter);
app.use("/authentification", authentificationRouter)

app.listen(SERVER_PORT, () => {
  console.info(`Server listening on ${SERVER_PORT}`);
});
