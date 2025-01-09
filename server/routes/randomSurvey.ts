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

// // Get all randomSurveys associated with given client id
// randomSurveyRouter.get("/:clientId", async (req, res) => {
//   try {
//     const { clientId } = req.params;
//     const data = await db.query(
//       `SELECT * FROM random_survey_table WHERE cm_id = $1`,
//       [clientId]
//     );
//     res.status(200).json(keysToCamel(data));
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

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
            date = $1,
            cch_qos = $2,
            cm_qos = $3,
            courteous = $4,
            informative = $5,
            prompt_and_helpful = $6,
            entry_quality = $7,
            unit_quality = $8,
            clean = $9,
            overall_experience = $10,
            case_meeting_frequency = $11,
            lifeskills = $12,
            recommend = $13,
            recommend_reasoning = $14,
            make_cch_more_helpful = $15,
            cm_id = $16,
            cm_feedback = $17,
            other_comments = $18
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
