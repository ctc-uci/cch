import { Router } from "express";

import { keysToCamel } from "../common/utils";

import { db } from "../db/db-pgp"; // TODO: replace this db with
import { verifyRole } from "../src/middleware";


export const exitSurveyRouter = Router();

exitSurveyRouter.get("/", async (req, res) => {
  try {
    const data = await db.any("SELECT * FROM exit_survey");
    res.status(200).json({data});
  } catch (err) {
    res.status(500).send(err.message);
  }
});

exitSurveyRouter.get("/:clientId", async (req, res) => {
  try {
    const {clientId} = req.params;
    const data = await db.any("SELECT * FROM exit_survey WHERE id = $1", [clientId,]);
    res.status(200).json({data});
  } catch (err) {
    res.status(500).send(err.message);
  }
});

exitSurveyRouter.post("/", async (req, res) => {
  try {
    const {
      id,
      cmId,
      name,
      site,
      programDateCompletion,
      cchRating,
      cchLikeMost,
      cchCouldBeImproved,
      lifeSkillsHelpfulTopics,
      lifeSkillsOfferTopicsInTheFuture,
      cmRating,
      cmChangeAbout,
      cmMostBeneficial,
      experienceTakeaway,
      experienceAccomplished,
      experienceExtraNotes,
    } = req.body;

    const data = await db.query(
      `INSERT INTO exit_survey (
        id, cm_id, name, site, program_date_completion, cch_rating, cch_like_most, cch_could_be_improved, 
        life_skills_helpful_topics, life_skills_offer_topics_in_the_future, cm_rating, cm_change_about, 
        cm_most_beneficial, experience_takeaway, experience_accomplished, experience_extra_notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      )`,
      [
        id,
        cmId,
        name,
        site,
        programDateCompletion,
        cchRating,
        cchLikeMost,
        cchCouldBeImproved,
        lifeSkillsHelpfulTopics,
        lifeSkillsOfferTopicsInTheFuture,
        cmRating,
        cmChangeAbout,
        cmMostBeneficial,
        experienceTakeaway,
        experienceAccomplished,
        experienceExtraNotes,
      ]
    );
    
    res.status(200).json({id});
  } catch (err) { 
    res.status(500).send(err.message);
  }
});

exitSurveyRouter.put("/:id", async (req, res) => {
  try {
    const {
      id,
      cmId,
      name,
      site,
      programDateCompletion,
      cchRating,
      cchLikeMost,
      cchCouldBeImproved,
      lifeSkillsHelpfulTopics,
      lifeSkillsOfferTopicsInTheFuture,
      cmRating,
      cmChangeAbout,
      cmMostBeneficial,
      experienceTakeaway,
      experienceAccomplished,
      experienceExtraNotes,
    } = req.body;

    const user = await db.query(
      `UPDATE exit_survey 
      SET cm_id = $2, 
      name = $3, 
      site = $4, 
      program_date_completion = $5, 
      cch_rating = $6,
      cch_like_most = $7, 
      cch_could_be_improved = $8, 
      life_skills_helpful_topics = $9, 
      life_skills_offer_topics_in_the_future = $10, 
      cm_rating = $11, 
      cm_change_about = $12, 
      cm_most_beneficial = $13, 
      experience_takeaway = $14, 
      experience_accomplished = $15, 
      experience_extra_notes = $16  
      WHERE id = $1 RETURNING *`,
      [
        id,
        cmId,
        name,
        site,
        programDateCompletion,
        cchRating,
        cchLikeMost,
        cchCouldBeImproved,
        lifeSkillsHelpfulTopics,
        lifeSkillsOfferTopicsInTheFuture,
        cmRating,
        cmChangeAbout,
        cmMostBeneficial,
        experienceTakeaway,
        experienceAccomplished,
        experienceExtraNotes,
      ]
    );
    res.status(200).json({id});
  } catch (err) {
    res.status(500).send(err.message);
  }
});

exitSurveyRouter.delete("/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const data = await db.query("DELETE FROM exit_survey WHERE id = $1", [id,]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});