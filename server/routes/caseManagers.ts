import { Router } from "express";
import { db } from "../db/db-pgp"
import { keysToCamel } from "../common/utils";

export const caseManagersRouter = Router();

// Gets all the monthly case manager stats
// output {caseManagerMonthlyStats[]}
// create our own type?
// um where 2 put our types.

// caseManagersRouter.get("/", async (req, res) => {
//     try {
//         const { startMonth, endMonth } = req.query;
//         const baseQuery = 'SELECT * FROM cm_monthly_stats'
//         const whereClause = 'WHERE EXTRACT(MONTH from date) >= $1 and EXTRACT(MONTH from date) <= $2';

//         const query = `${baseQuery}${(startMonth && endMonth) ? ` ${whereClause}` : ''};`;
//         const params = (startMonth && endMonth)? [startMonth, endMonth] : []

//         const cmMonthlyStats = await db.query(query, params)

//         res.status(200).json(keysToCamel(cmMonthlyStats));
//     }
//     catch (err) {
//         res.status(500).send(err.message)
//     }
// });

// Get all case managers
caseManagersRouter.get("/", async(req, res) => {
    try{
        const data = await db.query(`SELECT * FROM case_managers;`)
        
        res.status(200).json(keysToCamel(data))
    }
    catch(err){
        res.status(500).send(err.message)
    }
});

// Get case manager by id
caseManagersRouter.get("/:id", async(req, res) => {
    try{
        const { id } = req.params
        const data = await db.query(`SELECT * FROM case_managers WHERE id = $1`, [id])
        
        res.status(200).json(keysToCamel(data))
    }
    catch(err){
        res.status(500).send(err.message)
    }
});

// Insert new case manager

caseManagersRouter.post("/", async(req, res) => {
    try{
        const { role, first_name, last_name, phone_number, email } = req.body;
        const data = await db.query(`INSERT INTO case_managers (role, first_name, last_name, phone_number, email) VALUES ($1, $2, $3, $4, $5) RETURNING id;`, [role, first_name, last_name, phone_number, email])
        
        res.status(200).json(keysToCamel(data))
    }
    catch(err){
        res.status(500).send(err.message)
    }
});

// Update case manager by id
caseManagersRouter.put("/:id", async(req, res) => {
    try{
        const { id } = req.params
        const { role, first_name, last_name, phone_number, email } = req.body;
        const data = await db.query(`UPDATE case_managers SET role = $1, first_name = $2, last_name = $3, phone_number = $4, email = $5 WHERE id = $6`, [role, first_name, last_name, phone_number, email, id])
        
        res.status(200).json(keysToCamel(data))
    }
    catch(err){
        res.status(500).send(err.message)
    }
});

// Delete case manager by id

caseManagersRouter.delete("/:id", async(req, res) => {
    try{
        const { id } = req.params
        const query = await db.query(`DELETE FROM case_managers WHERE id = $1`, [id])
        
        res.status(200).json(keysToCamel(query))
    }
    catch(err){
        res.status(500).send(err.message)
    }
});
