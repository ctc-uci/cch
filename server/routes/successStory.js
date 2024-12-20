import express from "express";
import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const successRouter = express.Router();
successRouter.use(express.json());

successRouter.get("/successStory", async(req, res) => {
    try{
        const success = await db.query(`SELECT * FROM success_story`);
        res.status(200).json(keysToCamel(success));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

successRouter.get("/successStory/:clientId", async (req, res) => {
    try {
        const { clientId } = req.params;
        const children = await db.query(`SELECT ALL * FROM success_story WHERE client_id = $1`, [clientId]);
        res.status(200).json(keysToCamel(children));
    } catch (err){
        res.status(400).send(err.message);
    }
});

successRouter.post("/successStory", async (req, res) => {
    try {
        const {
            date,
            client_id,
            cm_id,
            previous_situation,
            cch_impact,
            where_now,
            tell_donors,
            quote,
            consent
        } = req.body;
        const success = await db.query(`INSERT INTO success_story (date, client_id, cm_id, previous_situation, cch_impact, where_now, tell_donors, quote, consent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
            [date, client_id, cm_id, previous_situation, cch_impact, where_now, tell_donors, quote, consent]);
        res.status(200).json(keysToCamel(success));
    } catch (err) {
        res.status(500).send(err.message);
    }
})

successRouter.put("/successStory/:id", async (req, res) => {
    try {
      const {
        id,
        date,
        client_id,
        cm_id,
        previous_situation,
        cch_impact,
        where_now,
        tell_donors,
        quote,
        consent
       } = req.body;
  
      const user = await db.query(
        `UPDATE "success_story" SET
        date = $1,
        client_id = $2,
        cm_id = $3,
        previous_situation = $4,
        cch_impact = $5,
        where_now = $6,
        tell_donors = $7,
        quote = $8,
        consent = $9
        WHERE id = $10
        RETURNING id;`,
        [date, client_id, cm_id, previous_situation, cch_impact, where_now, tell_donors, quote, consent, id]
      );
  
      res.status(200).json(keysToCamel(user));
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

successRouter.delete("/successStory/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const success = await db.query(`DELETE FROM success_story WHERE id = $1`, [id]);
        res.status(200).json(keysToCamel(success));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

export { successRouter };