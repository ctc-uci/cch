import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const intakeExitSurveyRouter = Router();

// Get all intake exit surveys
intakeExitSurveyRouter.get("/", async (req, res) => {
  try {
    const surveys = await db.query(`SELECT * FROM intake_exit_survey`);
    res.status(200).json(keysToCamel(surveys));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get exit surveys with joined data for table display
intakeExitSurveyRouter.get("/table-data", async (req, res) => {
  try {
    const surveys = await db.query(`
      SELECT
        ies.id AS id, 
        cm.first_name AS cm_first_name,
        cm.last_name AS cm_last_name,
        l.name AS location,
        ies.program_date_completion,
        ies.cch_rating,
        ies.cch_could_be_improved,
        ies.cch_like_most,
        ies.life_skills_rating,
        ies.life_skills_helpful_topics,
        ies.life_skills_offer_topics_in_the_future,
        ies.cm_rating,
        ies.cm_change_about,
        ies.cm_most_beneficial,
        ies.experience_takeaway,
        ies.experience_accomplished,
        ies.experience_extra_notes
      FROM intake_exit_survey AS ies
      INNER JOIN locations AS l ON ies.site = l.id
      INNER JOIN case_managers AS cm ON ies.cm_id = cm.id
    `);
    res.status(200).json(keysToCamel(surveys));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Search and filter exit surveys
intakeExitSurveyRouter.get("/search-filter", async (req, res) => {
  try {
    const { search, page, filter } = req.query;
    let queryStr = `
      SELECT ies.*, cm.first_name AS cm_first_name, cm.last_name AS cm_last_name, l.name AS location
      FROM intake_exit_survey AS ies
      INNER JOIN case_managers AS cm ON ies.cm_id = cm.id
      INNER JOIN locations AS l ON ies.site = l.id
      WHERE 1=1
    `;

    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      queryStr += ` 
      AND (ies.id::TEXT ILIKE ${stringSearch}
        OR ies.program_date_completion::TEXT ILIKE ${stringSearch}
        OR ies.cch_rating::TEXT ILIKE ${stringSearch}
        OR ies.cch_could_be_improved::TEXT ILIKE ${stringSearch}
        OR ies.cch_like_most::TEXT ILIKE ${stringSearch}
        OR ies.life_skills_rating::TEXT ILIKE ${stringSearch}
        OR ies.life_skills_helpful_topics::TEXT ILIKE ${stringSearch}
        OR ies.life_skills_offer_topics_in_the_future::TEXT ILIKE ${stringSearch}
        OR ies.cm_rating::TEXT ILIKE ${stringSearch}
        OR ies.cm_change_about::TEXT ILIKE ${stringSearch}
        OR ies.cm_most_beneficial::TEXT ILIKE ${stringSearch}
        OR ies.experience_takeaway::TEXT ILIKE ${stringSearch}
        OR ies.experience_accomplished::TEXT ILIKE ${stringSearch}
        OR ies.experience_extra_notes::TEXT ILIKE ${stringSearch}
        OR cm.first_name::TEXT ILIKE ${stringSearch}
        OR cm.last_name::TEXT ILIKE ${stringSearch}
        OR l.name::TEXT ILIKE ${stringSearch}
      )`;
    }
    
    if (filter) {
      queryStr += ` AND ${filter}`;
    }

    queryStr += " ORDER BY ies.id ASC";

    if (page) {
      queryStr += ` LIMIT ${page}`;
    }

    const surveys = await db.query(queryStr);
    res.status(200).json(keysToCamel(surveys));
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Get exit survey by client ID
intakeExitSurveyRouter.get("/client/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const surveys = await db.query(
      "SELECT * FROM intake_exit_survey WHERE client_id = $1",
      [clientId]
    );
    res.status(200).json(keysToCamel(surveys));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get single exit survey by ID
intakeExitSurveyRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query("SELECT * FROM intake_exit_survey WHERE id = $1", [id]);
    if (data.length === 0) {
      return res.status(404).json({ error: "Exit survey not found" });
    }
    res.status(200).json(keysToCamel(data[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create a new exit survey
intakeExitSurveyRouter.post("/", async (req, res) => {
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
      `INSERT INTO intake_exit_survey (
        cm_id, name, site, program_date_completion, cch_rating, cch_like_most, cch_could_be_improved,
        life_skills_rating, life_skills_helpful_topics, life_skills_offer_topics_in_the_future, cm_rating, cm_change_about,
        cm_most_beneficial, experience_takeaway, experience_accomplished, experience_extra_notes, client_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING *`,
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

    res.status(200).json(keysToCamel(data[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update an exit survey
intakeExitSurveyRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
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
      date,
    } = req.body;

    const data = await db.query(
      `UPDATE intake_exit_survey
      SET cm_id = COALESCE($1, cm_id),
      name = COALESCE($2, name),
      site = COALESCE($3, site),
      program_date_completion = COALESCE($4, program_date_completion),
      cch_rating = COALESCE($5, cch_rating),
      cch_like_most = COALESCE($6, cch_like_most),
      cch_could_be_improved = COALESCE($7, cch_could_be_improved),
      life_skills_rating = COALESCE($8, life_skills_rating),
      life_skills_helpful_topics = COALESCE($9, life_skills_helpful_topics),
      life_skills_offer_topics_in_the_future = COALESCE($10, life_skills_offer_topics_in_the_future),
      cm_rating = COALESCE($11, cm_rating),
      cm_change_about = COALESCE($12, cm_change_about),
      cm_most_beneficial = COALESCE($13, cm_most_beneficial),
      experience_takeaway = COALESCE($14, experience_takeaway),
      experience_accomplished = COALESCE($15, experience_accomplished),
      experience_extra_notes = COALESCE($16, experience_extra_notes),
      date = COALESCE($17, date),
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $18 RETURNING *`,
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
        date,
        id,
      ]
    );

    if (data.length === 0) {
      return res.status(404).json({ error: "Exit survey not found" });
    }
    res.status(200).json(keysToCamel(data[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete an exit survey
intakeExitSurveyRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM intake_exit_survey WHERE id = $1", [id]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

