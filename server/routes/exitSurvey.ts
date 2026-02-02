import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";
import { matchClient, extractClientFields } from "../common/clientMatching";

export const exitSurveyRouter = Router();

exitSurveyRouter.get("/", async (req, res) => {
  try {
    const success = await db.query(`SELECT * FROM exit_survey ORDER BY date DESC`);
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

    queryStr += " ORDER BY es.date DESC";

    if (page) {
      queryStr += ` LIMIT ${page}`;
    }

    const success_story = await db.query(queryStr);
    res.status(200).json(keysToCamel(success_story));
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

exitSurveyRouter.get("/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    
    // Check if clientId is a UUID (session-based form) or integer (old table)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clientId);
    
    if (isUUID) {
      // Fetch from intake_responses using session_id
      const sessionResult = await db.query(
        `SELECT DISTINCT ir.session_id, ir.client_id, ir.submitted_at, ir.form_id, c.first_name, c.last_name
        FROM intake_responses ir
        LEFT JOIN clients c ON ir.client_id = c.id
        WHERE ir.session_id = $1 AND ir.form_id = 2
        LIMIT 1`,
        [clientId]
      );

      if (sessionResult.length === 0) {
        return res.status(404).json({ error: "Form not found" });
      }

      const session = sessionResult[0];
      
      // Get all responses for this session
      const responses = await db.query(
        `SELECT 
          ir.response_value,
          fq.field_key,
          fq.question_type
        FROM intake_responses ir
        JOIN form_questions fq ON ir.question_id = fq.id
        WHERE ir.session_id = $1 AND ir.form_id = 2
        ORDER BY fq.display_order ASC`,
        [clientId]
      );

      // Build response object matching exit_survey structure
      const formData: Record<string, unknown> = {
        id: session.session_id,
        client_id: session.client_id,
        date: session.submitted_at,
        name: session.first_name && session.last_name 
          ? `${session.first_name} ${session.last_name}`.trim() 
          : 'Unknown',
      };

      // Convert responses to form data
      for (const resp of responses) {
        let value: unknown = resp.response_value;
        
        // Convert based on question type
        switch (resp.question_type) {
          case "number":
            value = resp.response_value ? parseFloat(resp.response_value) : null;
            break;
          case "boolean":
            value = resp.response_value === "true" || resp.response_value === "yes";
            break;
          case "date":
            value = resp.response_value || null;
            break;
          default:
            value = resp.response_value || "";
        }
        
        // Convert field_key from snake_case to match exit_survey column names
        formData[resp.field_key] = value;
      }

      res.status(200).json({ data: [formData] });
    } else {
      // Fetch from old exit_survey table
      const data = await db.any("SELECT * FROM exit_survey WHERE id = $1", [
        clientId,
      ]);
      res.status(200).json({ data });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create new exit survey - now posts to intake_responses with form_id = 2
exitSurveyRouter.post("/", async (req, res) => {
  try {
    const formData = req.body;
    const formId = 2; // Exit Survey form_id

    // Get all form questions for form_id = 2 to map field_key to question_id
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

    // Match client from clients table (excluding random client survey - form_id = 4)
    // form_id = 2 is Exit Survey, so we should match
    const clientFields = extractClientFields(formData);
    const matchedClientId = await matchClient(
      clientFields.firstName,
      clientFields.lastName,
      clientFields.phoneNumber,
      clientFields.dateOfBirth
    );

    // Use matched client ID if found, otherwise use NULL (client_id now references clients table)
    const finalClientId = matchedClientId || null;

    // Generate a unique session_id for this exit survey submission
    // All responses from this submission will share the same session_id
    const sessionIdResult = await db.query("SELECT uuid_generate_v4() as session_id");
    const sessionId = sessionIdResult[0].session_id;

    // Insert responses for each field that has a corresponding question
    // All responses use the same session_id to group them together
    for (const [fieldKey, value] of Object.entries(formData)) {
      // Skip non-response fields
      if (fieldKey === 'client_id' || fieldKey === 'name') {
        continue;
      }

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

        await db.query(
          `INSERT INTO intake_responses (client_id, question_id, response_value, form_id, session_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [finalClientId, question.id, stringValue, formId, sessionId]
        );
      }
    }

    res.status(200).json({ success: true, client_id: finalClientId, session_id: sessionId });
  } catch (err: unknown) {
    const error = err as Error & { message?: string };
    console.error("Error creating exit survey:", err);
    res.status(500).json({ error: error?.message || 'Unknown error occurred' });
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

    await db.query(
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
    await db.query("DELETE FROM exit_survey WHERE id = $1", [id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
