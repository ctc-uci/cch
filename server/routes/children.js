import express from "express";
import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const childRouter = express.Router();
childRouter.use(express.json());

childRouter.get('/children', async(req, res) => {
    try {
        const children = await db.query(`SELECT * FROM children`);
        res.status(200).json(keysToCamel(children));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

childRouter.get("/children/:clientId", async (req, res) => {
    try {
        const { clientId } = req.params;
        const children = await db.query(`SELECT ALL * FROM children WHERE parent_id = $1`, [clientId]);
        res.status(200).json(keysToCamel(children));
    }catch (err){
        res.status(400).send(err.message);
    }
});

childRouter.post("/children", async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            parent_id,
            date_of_birth,
            reunified,
        } = req.body;
        const child = await db.query(`INSERT INTO children (first_name, last_name, parent_id, date_of_birth, reunified) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [first_name, last_name, parent_id, date_of_birth, reunified]);
        res.status(200).json(keysToCamel(child));
    } catch (err) {
        res.status(500).send(err.message);
    }
});


childRouter.put("/children/id", async (req, res) => {
    try {
      const {
        id,
        first_name,
        last_name,
        parent_id,
        date_of_birth,
        reunified,
       } = req.body;
  
      const user = await db.query(
        `UPDATE "children" SET
        first_name = $1,
        last_name = $2,
        parent_id = $3,
        date_of_birth = $4,
        reunified = $5
        WHERE id = $6
        RETURNING id;`,
        [ 
        first_name,
        last_name,
        parent_id,
        date_of_birth,
        reunified,
        id
        ]
      );
  
      res.status(200).json(keysToCamel(user));
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

childRouter.delete("/children/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const child = await db.query(`DELETE FROM children WHERE id = $1`, [id]);
        res.status(200).json(keysToCamel(child));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

export { childRouter };