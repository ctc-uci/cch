import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp"; // TODO: replace this db with
// import { verifyRole } from "../src/middleware";

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

randomSurveyRouter.get("/table-data", async (req, res) => {
  try {
    const success = await db.query(`
      SELECT
        rs.id AS id, 
        cm.first_name AS cm_first_name,
        cm.last_name AS cm_last_name,
        rs.date,
        rs.cch_qos,
        rs.cm_qos,
        rs.courteous,
        rs.informative,
        rs.prompt_and_helpful,
        rs.entry_quality,
        rs.unit_quality,
        rs.clean,
        rs.overall_experience,
        rs.case_meeting_frequency,
        rs.lifeskills,
        rs.recommend,
        rs.recommend_reasoning,
        rs.make_cch_more_helpful,
        rs.cm_feedback,
        rs.other_comments
      FROM random_survey_table AS rs
      INNER JOIN case_managers AS cm ON rs.cm_id = cm.id
      `);
    res.status(200).json(keysToCamel(success));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

randomSurveyRouter.get("/search-filter", async (req, res) => {
  try {
    const { search, page, filter } = req.query;
    let queryStr = `
      SELECT rs.*, cm.first_name AS cm_first_name, cm.last_name AS cm_last_name
      FROM random_survey_table AS rs
      INNER JOIN case_managers AS cm ON rs.cm_id = cm.id
      WHERE 1=1
    `;

    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      queryStr += ` 
      AND (rs.id::TEXT ILIKE ${stringSearch}
        OR rs.date::TEXT ILIKE ${stringSearch}
        OR rs.cch_qos::TEXT ILIKE ${stringSearch}
        OR rs.cm_qos::TEXT ILIKE ${stringSearch}
        OR rs.courteous::TEXT ILIKE ${stringSearch}
        OR rs.informative::TEXT ILIKE ${stringSearch}
        OR rs.prompt_and_helpful::TEXT ILIKE ${stringSearch}
        OR rs.entry_quality::TEXT ILIKE ${stringSearch}
        OR rs.unit_quality::TEXT ILIKE ${stringSearch}
        OR rs.clean::TEXT ILIKE ${stringSearch}
        OR rs.overall_experience::TEXT ILIKE ${stringSearch}
        OR rs.case_meeting_frequency::TEXT ILIKE ${stringSearch}
        OR rs.lifeskills::TEXT ILIKE ${stringSearch}
        OR rs.recommend::TEXT ILIKE ${stringSearch}
        OR rs.recommend_reasoning::TEXT ILIKE ${stringSearch}
        OR rs.make_cch_more_helpful::TEXT ILIKE ${stringSearch}
        OR rs.cm_feedback::TEXT ILIKE ${stringSearch}
        OR rs.other_comments::TEXT ILIKE ${stringSearch}
        OR cm.first_name::TEXT ILIKE ${stringSearch}
        OR cm.last_name::TEXT ILIKE ${stringSearch}
      )`;
    }
    
    if (filter) {
      queryStr += `AND ${filter}`;
    }

    queryStr += " ORDER BY rs.id ASC";

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

randomSurveyRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query("SELECT * FROM random_survey_table WHERE id = $1", [id]);
    res.status(200).json(keysToCamel(data)[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create new randomSurvey - now posts to intake_responses with form_id = 4
randomSurveyRouter.post("/", async (req, res) => {
  try {
    const surveyData = req.body;
    const formId = 4; // Random Client Survey form_id

    // Extract cm_id if available (for case_manager_select field)
    let cmId: number | null = null;
    if (surveyData.cm_id !== undefined) {
      cmId = typeof surveyData.cm_id === 'number' ? surveyData.cm_id : Number(surveyData.cm_id);
    }
    // Also check for case_manager field (if that's the field_key)
    if (!cmId && surveyData.case_manager !== undefined) {
      cmId = typeof surveyData.case_manager === 'number' ? surveyData.case_manager : Number(surveyData.case_manager);
    }

    // Get first unit_id as default (or use 1 if none exists)
    let unitId = 1;
    try {
      const units = await db.query("SELECT id FROM units LIMIT 1");
      if (units.length > 0) {
        unitId = units[0].id;
      }
    } catch {
      // Use default unitId = 1
    }

    // Get all form questions for form_id = 4 to map field_key to question_id
    const questions = await db.query(
      `SELECT id, field_key, question_type FROM form_questions WHERE form_id = $1`,
      [formId]
    );

    const questionMap = new Map<string, { id: number; type: string }>(
      questions.map(
        (q: { id: number; field_key: string; question_type: string }) => [
          q.field_key,
          { id: q.id, type: q.question_type },
        ]
      )
    );

    // Find case_manager_select field to extract cm_id for created_by
    if (!cmId) {
      for (const q of questions) {
        if (q.question_type === 'case_manager_select' && surveyData[q.field_key] !== undefined) {
          const cmValue = surveyData[q.field_key];
          cmId = typeof cmValue === 'number' ? cmValue : Number(cmValue);
          if (!isNaN(cmId)) {
            break;
          }
        }
      }
    }
    const createdBy = cmId || 1;

    // Create a minimal client entry for the anonymous survey
    const clientResult = await db.query(
      `INSERT INTO intake_clients (created_by, unit_id, status, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [createdBy, unitId, "Active", "Random Survey", new Date().toISOString().slice(0, 10)]
    );

    const clientId = clientResult[0].id;

    // Generate a unique session_id for this survey submission
    // All responses from this submission will share the same session_id
    const sessionIdResult = await db.query("SELECT uuid_generate_v4() as session_id");
    const sessionId = sessionIdResult[0].session_id;

    // Insert responses for each field that has a corresponding question
    // All responses use the same session_id to group them together
    for (const [fieldKey, value] of Object.entries(surveyData)) {

      const question = questionMap.get(fieldKey);
      if (question && value !== undefined && value !== null && value !== "") {
        // Convert value to string for storage
        let stringValue: string;
        if (typeof value === "boolean") {
          // Convert boolean to "yes" or "no" instead of "true" or "false"
          stringValue = value ? "yes" : "no";
        } else if (typeof value === "number") {
          stringValue = value.toString();
        } else if (typeof value === "object") {
          // For rating grids and other objects, stringify
          stringValue = JSON.stringify(value);
        } else {
          stringValue = String(value);
        }

        const response = await db.query(
          `INSERT INTO intake_responses (client_id, question_id, response_value, form_id, session_id)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [clientId, question.id, stringValue, formId, sessionId]
        );
        console.log("response", response);
      }
    }

    res.status(200).json({ id: clientId });
  } catch (err) {
    console.error("Error creating random survey:", err);
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
