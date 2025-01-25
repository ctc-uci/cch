import express from "express";
import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const successRouter = express.Router();
successRouter.use(express.json());

successRouter.get("/", async(req, res) => {
    try{
        const success = await db.query(`SELECT * FROM success_story`);
        res.status(200).json(keysToCamel(success));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

successRouter.get("/:clientId", async (req, res) => {
    try {
        const { clientId } = req.params;
        const children = await db.query(`SELECT ALL * FROM success_story WHERE client_id = $1`, [clientId]);
        res.status(200).json(keysToCamel(children));
    } catch (err){
        res.status(400).send(err.message);
    }
});

successRouter.post("/", async (req, res) => {
    try {
        const {
            date,
            client_id,
            name,
            cm_id,
            previous_situation,
            cch_impact,
            where_now,
            tell_donors,
            quote,
            consent
        } = req.body;
        const success = await db.query(`INSERT INTO success_story (date, client_id, name, cm_id, previous_situation, cch_impact, where_now, tell_donors, quote, consent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [date, client_id, name, cm_id, previous_situation, cch_impact, where_now, tell_donors, quote, consent]);
        res.status(200).json(keysToCamel(success));
    } catch (err) {
        res.status(500).send(err.message);
    }
})

successRouter.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
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

      const user = await db.query(
        `UPDATE "success_story" SET
        date = COALESCE($1, date),
        client_id = COALESCE($2, client_id),
        cm_id = COALESCE($3, cm_id),
        previous_situation = COALESCE($4, previous_situation),
        cch_impact = COALESCE($5, cch_impact),
        where_now = COALESCE($6, where_now),
        tell_donors = COALESCE($7, tell_donors),
        quote = COALESCE($8, quote),
        consent = COALESCE($9, consent)
        WHERE id = $10
        RETURNING id;
        `,
        [date, client_id, cm_id, previous_situation, cch_impact, where_now, tell_donors, quote, consent, id]
      );

      res.status(200).json(keysToCamel(user));
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

successRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const success = await db.query(`DELETE FROM success_story WHERE id = $1`, [id]);
        res.status(200).json(keysToCamel(success));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

export { successRouter };
