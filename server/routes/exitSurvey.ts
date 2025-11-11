import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";
import { verifyRole } from "../src/middleware";

export const exitSurveyRouter = Router();

exitSurveyRouter.get("/", async (req, res) => {
  try {
    const success = await db.query(`SELECT * FROM exit_survey`);
    res.status(200).json(keysToCamel(success));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

exitSurveyRouter.get("/table-data", async (req, res) => {
  try {
    const success = await db.query(`
      SELECT
        es.id AS id, 
        cm.first_name AS cm_first_name,
        cm.last_name AS cm_last_name,
        l.name AS location,
        es.program_date_completion,
        es.cch_rating,
        es.cch_could_be_improved,
        es.cch_like_most,
        es.life_skills_rating,
        es.life_skills_helpful_topics,
        es.life_skills_offer_topics_in_the_future,
        es.cm_rating,
        es.cm_rating,
        es.cm_change_about,
        es.cm_most_beneficial,
        es.experience_takeaway,
        es.experience_accomplished,
        es.experience_extra_notes
      FROM exit_survey AS es
      INNER JOIN locations AS l ON es.site = l.id
      INNER JOIN case_managers AS cm ON es.cm_id = cm.id
      `);
    res.status(200).json(keysToCamel(success));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

exitSurveyRouter.get("/search-filter", async (req, res) => {
  try {
    const { search, page, filter } = req.query;
    let queryStr = `
      SELECT es.*, cm.first_name AS cm_first_name, cm.last_name AS cm_last_name, l.name AS location
      FROM exit_survey AS es
      INNER JOIN case_managers AS cm ON es.cm_id = cm.id
      INNER JOIN locations AS l ON es.site = l.id
      WHERE 1=1
    `;

    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      queryStr += ` 
      AND (es.id::TEXT ILIKE ${stringSearch}
        OR es.program_date_completion::TEXT ILIKE ${stringSearch}
        OR es.cch_rating::TEXT ILIKE ${stringSearch}
        OR es.cch_could_be_improved::TEXT ILIKE ${stringSearch}
        OR es.cch_like_most::TEXT ILIKE ${stringSearch}
        OR es.life_skills_rating::TEXT ILIKE ${stringSearch}
        OR es.life_skills_helpful_topics::TEXT ILIKE ${stringSearch}
        OR es.life_skills_offer_topics_in_the_future::TEXT ILIKE ${stringSearch}
        OR es.cm_rating::TEXT ILIKE ${stringSearch}
        OR es.cm_change_about::TEXT ILIKE ${stringSearch}
        OR es.cm_most_beneficial::TEXT ILIKE ${stringSearch}
        OR es.experience_takeaway::TEXT ILIKE ${stringSearch}
        OR es.experience_accomplished::TEXT ILIKE ${stringSearch}
        OR es.experience_extra_notes::TEXT ILIKE ${stringSearch}
        OR cm.first_name::TEXT ILIKE ${stringSearch}
        OR cm.last_name::TEXT ILIKE ${stringSearch}
        OR l.name::TEXT ILIKE ${stringSearch}
      )`;
    }
    
    if (filter) {
      queryStr += `AND ${filter}`;
    }

    queryStr += " ORDER BY es.id ASC";

    if (page) {
      queryStr += ` LIMIT ${page}`;
    }

    const success_story = await db.query(queryStr);
    res.status(200).json(keysToCamel(success_story));
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

exitSurveyRouter.get("/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const data = await db.any("SELECT * FROM exit_survey WHERE id = $1", [
      clientId,
    ]);
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

exitSurveyRouter.post("/", async (req, res) => {
  try {
    const {
      cmId,
      name,
      site,
      programDateCompletion,
      cchRating,
      cchLikeMost,
      cchCouldBeImproved,
      lifeSkillsRating,
      lifeSkillsHelpfulTopics,
      lifeSkillsOfferTopicsInTheFuture,
      cmRating,
      cmChangeAbout,
      cmMostBeneficial,
      experienceTakeaway,
      experienceAccomplished,
      experienceExtraNotes,
      client_id,
    } = req.body;

    const data = await db.query(
      `INSERT INTO exit_survey (
        cm_id, name, site, program_date_completion, cch_rating, cch_like_most, cch_could_be_improved,
        life_skills_rating, life_skills_helpful_topics, life_skills_offer_topics_in_the_future, cm_rating, cm_change_about,
        cm_most_beneficial, experience_takeaway, experience_accomplished, experience_extra_notes, client_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING id`,
      [
        cmId,
        name,
        site,
        programDateCompletion,
        cchRating,
        cchLikeMost,
        cchCouldBeImproved,
        lifeSkillsRating,
        lifeSkillsHelpfulTopics,
        lifeSkillsOfferTopicsInTheFuture,
        cmRating,
        cmChangeAbout,
        cmMostBeneficial,
        experienceTakeaway,
        experienceAccomplished,
        experienceExtraNotes,
        client_id,
      ]
    );

    res.status(200).json(data[0]);
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
      lifeSkillsRating,
      lifeSkillsHelpfulTopics,
      lifeSkillsOfferTopicsInTheFuture,
      cmRating,
      cmChangeAbout,
      cmMostBeneficial,
      experienceTakeaway,
      experienceAccomplished,
      experienceExtraNotes,
      date,
    } = req.body;

    const user = await db.query(
      `UPDATE exit_survey
      SET cm_id = COALESCE($2, cm_id),
      name = COALESCE($3, name),
      site = COALESCE($4, site),
      program_date_completion = COALESCE($5, program_date_completion),
      cch_rating = COALESCE($6, cch_rating),
      cch_like_most = COALESCE($7, cch_like_most),
      cch_could_be_improved = COALESCE($8, cch_could_be_improved),
      life_skills_rating = COALESCE($9, life_skills_rating),
      life_skills_helpful_topics = COALESCE($10, life_skills_helpful_topics),
      life_skills_offer_topics_in_the_future = COALESCE($11, life_skills_offer_topics_in_the_future),
      cm_rating = COALESCE($12, cm_rating),
      cm_change_about = COALESCE($13, cm_change_about),
      cm_most_beneficial = COALESCE($14, cm_most_beneficial),
      experience_takeaway = COALESCE($15, experience_takeaway),
      experience_accomplished = COALESCE($16, experience_accomplished),
      experience_extra_notes = COALESCE($17, experience_extra_notes),
      date = COALESCE($18, date)
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
        lifeSkillsRating,
        lifeSkillsHelpfulTopics,
        lifeSkillsOfferTopicsInTheFuture,
        cmRating,
        cmChangeAbout,
        cmMostBeneficial,
        experienceTakeaway,
        experienceAccomplished,
        experienceExtraNotes,
        date,
      ]
    );
    res.status(200).json({ id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

exitSurveyRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query("DELETE FROM exit_survey WHERE id = $1", [id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
