import { Router } from "express";
import { db } from "../db/db-pgp"
import { keysToCamel } from "../common/utils";

export const caseManagersRouter = Router();

// Gets all the monthly case manager stats
// output {caseManagerMonthlyStats[]}
// create our own type?
// um where 2 put our types.




caseManagersRouter.get("/", async (req, res) => {
    try {
        const { startMonth, endMonth } = req.query;
        let cmMonthlyStats;

        if (startMonth && endMonth) {
            cmMonthlyStats = await db.query(`SELECT * FROM cm_monthly_stats WHERE MONTH(date) >= $1 and MONTH(date) <= $2`, [startMonth, endMonth]);

        }
        else {
            cmMonthlyStats = await db.query(`SELECT * FROM cm_monthly_stats`);
        }

        res.status(200).json(keysToCamel(cmMonthlyStats));
    }
    catch (err) {
        res.status(500).send(err.message)
    }
});

// caseManagersRouter.