import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp"; // TODO: replace this db with
import { verifyRole } from "../src/middleware";

export const randomSurveyRouter = Router();

// Get all randomSurveys
randomSurveyRouter.get("/", async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM random_survey_table");
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create new randomSurvey
randomSurveyRouter.post("/", async (req, res) => {
  try {
    const {
      date,
      cch_qos,
      cm_qos,
      courteous,
      informative,
      prompt_and_helpful,
      entry_quality,
      unit_quality,
      clean,
      overall_experience,
      case_meeting_frequency,
      lifeskills,
      recommend,
      recommend_reasoning,
      make_cch_more_helpful,
      cm_id,
      cm_feedback,
      other_comments,
    } = req.body;

    const query = `
        INSERT INTO random_survey_table ( 
            date, 
            cch_qos, 
            cm_qos, 
            courteous, 
            informative, 
            prompt_and_helpful, 
            entry_quality, 
            unit_quality, 
            clean, 
            overall_experience, 
            case_meeting_frequency, 
            lifeskills, 
            recommend, 
            recommend_reasoning, 
            make_cch_more_helpful, 
            cm_id, 
            cm_feedback, 
            other_comments
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        )
        RETURNING id;
    `;

    const data = await db.query(query, [
      date,
      cch_qos,
      cm_qos,
      courteous,
      informative,
      prompt_and_helpful,
      entry_quality,
      unit_quality,
      clean,
      overall_experience,
      case_meeting_frequency,
      lifeskills,
      recommend,
      recommend_reasoning,
      make_cch_more_helpful,
      cm_id,
      cm_feedback,
      other_comments,
    ]);

    res.status(200).json({id: data[0].id})
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update randomSurvey
randomSurveyRouter.put("/:id", async (req, res) => {
  try {
    const {
      date,
      cch_qos,
      cm_qos,
      courteous,
      informative,
      prompt_and_helpful,
      entry_quality,
      unit_quality,
      clean,
      overall_experience,
      case_meeting_frequency,
      lifeskills,
      recommend,
      recommend_reasoning,
      make_cch_more_helpful,
      cm_id,
      cm_feedback,
      other_comments,
    } = req.body;

    const { id } = req.params;

    await db.query(
      `
        UPDATE random_survey_table
        SET
            date = COALESCE($1, date),
            cch_qos = COALESCE($2, cch_qos),
            cm_qos = COALESCE($3, cm_qos),
            courteous = COALESCE($4, courteous),
            informative = COALESCE($5, informative),
            prompt_and_helpful = COALESCE($6, prompt_and_helpful),
            entry_quality = COALESCE($7, entry_quality),
            unit_quality = COALESCE($8, unit_quality),
            clean = COALESCE($9, clean),
            overall_experience = COALESCE($10, overall_experience),
            case_meeting_frequency = COALESCE($11, case_meeting_frequency),
            lifeskills = COALESCE($12, lifeskills),
            recommend = COALESCE($13, recommend),
            recommend_reasoning = COALESCE($14, recommend_reasoning),
            make_cch_more_helpful = COALESCE($15, make_cch_more_helpful),
            cm_id = COALESCE($16, cm_id),
            cm_feedback = COALESCE($17, cm_feedback),
            other_comments = COALESCE($18, other_comments)
        WHERE id = $19;
      `,
      [
        date,
        cch_qos,
        cm_qos,
        courteous,
        informative,
        prompt_and_helpful,
        entry_quality,
        unit_quality,
        clean,
        overall_experience,
        case_meeting_frequency,
        lifeskills,
        recommend,
        recommend_reasoning,
        make_cch_more_helpful,
        cm_id,
        cm_feedback,
        other_comments,
        id,
      ]
    );

    res.status(200).json({ id: id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Delete randomSurvey
randomSurveyRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM random_survey_table WHERE id = $1", [id]);
    res.status(200).json();
  } catch (err) {
    res.status(500).send(err.message);
  }
});
