import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const screenerCommentRouter = Router();

// Get all screener comment forms
screenerCommentRouter.get("/", async (req, res) => {
  try {
    const { search, sortBy } = req.query;
    let queryStr = `SELECT * FROM screener_comment`;
    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      queryStr = queryStr.concat(
        " ",
        `WHERE id::TEXT ILIKE ${stringSearch}
          OR initial_interview_id::TEXT ILIKE ${stringSearch}
          OR cm_id::TEXT ILIKE ${stringSearch}
          OR willingness::TEXT ILIKE ${stringSearch}
          OR employability::TEXT ILIKE ${stringSearch}
          OR attitude::TEXT ILIKE ${stringSearch}
          OR length_of_sobriety::TEXT ILIKE ${stringSearch}
          OR completed_tx::TEXT ILIKE ${stringSearch}
          OR drug_test_results::TEXT ILIKE ${stringSearch}
          OR homeless_episode_one::TEXT ILIKE ${stringSearch}
          OR homeless_episode_two::TEXT ILIKE ${stringSearch}
          OR homeless_episode_three::TEXT ILIKE ${stringSearch}
          OR homeless_episode_four::TEXT ILIKE ${stringSearch}
          OR disabling_condition::TEXT ILIKE ${stringSearch}
          OR employed::TEXT ILIKE ${stringSearch}
          OR driver_license::TEXT ILIKE ${stringSearch}
          OR num_of_children::TEXT ILIKE ${stringSearch}
          OR children_in_custody::TEXT ILIKE ${stringSearch}
          OR last_city_perm_residence::TEXT ILIKE ${stringSearch}
          OR decision::TEXT ILIKE ${stringSearch}
          OR additional_comments::TEXT ILIKE ${stringSearch}`
      );
    }
    if (sortBy) {
      queryStr += " ORDER BY " + sortBy + " ASC";
    }

    const data = await db.query(queryStr);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

screenerCommentRouter.post("/", async (req, res) => {
  try {
    const {
      // Legacy link to the old initial_interview table (optional)
      initial_interview_id,
      // Required screener comment fields
      cm_id,
      willingness,
      employability,
      attitude,
      length_of_sobriety,
      completed_tx,
      // Optional fields
      drug_test_results,
      homeless_episode_one,
      homeless_episode_two,
      homeless_episode_three,
      homeless_episode_four,
      disabling_condition,
      employed,
      driver_license,
      num_of_children,
      children_in_custody,
      last_city_perm_residence,
      decision,
      additional_comments,
      // New dynamic-forms association
      session_id,
      // Applicant type status enum
      applicant_type_status,
    } = req.body;

    // Validate applicant_type_status if present
    if (applicant_type_status !== undefined && applicant_type_status !== null) {
      const validValues = ['single', 'family'];
      const normalizedValue = String(applicant_type_status).toLowerCase().trim();
      if (!validValues.includes(normalizedValue)) {
        return res.status(400).json({ 
          error: `Invalid applicant_type_status. Must be one of: ${validValues.join(', ')}` 
        });
      }
      applicant_type_status = normalizedValue;
    }

    const query = `
      INSERT INTO screener_comment (
        initial_interview_id,
        cm_id,
        willingness,
        employability,
        attitude,
        length_of_sobriety,
        completed_tx,
        drug_test_results,
        homeless_episode_one,
        homeless_episode_two,
        homeless_episode_three,
        homeless_episode_four,
        disabling_condition,
        employed,
        driver_license,
        num_of_children,
        children_in_custody,
        last_city_perm_residence,
        decision,
        additional_comments,
        session_id,
        applicant_type_status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22
      )
      RETURNING *;
    `;

    const values = [
      initial_interview_id ?? null,
      cm_id,
      willingness,
      employability,
      attitude,
      length_of_sobriety,
      completed_tx,
      drug_test_results ?? null,
      homeless_episode_one ?? null,
      homeless_episode_two ?? null,
      homeless_episode_three ?? null,
      homeless_episode_four ?? null,
      disabling_condition ?? null,
      employed ?? null,
      driver_license ?? null,
      num_of_children ?? null,
      children_in_custody ?? null,
      last_city_perm_residence ?? null,
      decision ?? null,
      additional_comments ?? null,
      session_id ?? null,
      applicant_type_status ?? null, // Already validated and normalized above
    ];

    const result = await db.query(query, values);
    res.status(201).json(keysToCamel(result));
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

screenerCommentRouter.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Validate applicant_type_status if present
    if (updates.applicant_type_status !== undefined && updates.applicant_type_status !== null) {
      const validValues = ['single', 'family'];
      const normalizedValue = String(updates.applicant_type_status).toLowerCase().trim();
      if (!validValues.includes(normalizedValue)) {
        return res.status(400).json({ 
          error: `Invalid applicant_type_status. Must be one of: ${validValues.join(', ')}` 
        });
      }
      updates.applicant_type_status = normalizedValue;
    }

    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const values = Object.values(updates);

    const query = `UPDATE screener_comment SET ${setClause} WHERE id = $${values.length + 1} RETURNING *;`;
    const result = await db.query(query, [...values, id]);

    res.status(200).json({
      message: "Client updated successfully",
      result: result,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

screenerCommentRouter.get("/interview/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `SELECT id FROM screener_comment WHERE initial_interview_id = ${id}`;
    const result = await db.query(query);


    res.status(200).json({
      message: "Sucessfully found id",
      result: result,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

screenerCommentRouter.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    // IMPORTANT: session_id is a UUID; always use parameterized queries.
    const query = `
      WITH client_responses AS (
        SELECT
          MAX(CASE WHEN fq.field_key = 'name' THEN ir.response_value END) AS name_field,
          MAX(CASE WHEN fq.field_key = 'first_name' THEN ir.response_value END) AS first_name_field,
          MAX(CASE WHEN fq.field_key = 'last_name' THEN ir.response_value END) AS last_name_field,
          MAX(CASE WHEN fq.field_key = 'applicant_type' THEN ir.response_value END) AS applicant_type
        FROM intake_responses ir
        JOIN form_questions fq ON ir.question_id = fq.id
        WHERE ir.session_id = $1
          AND ir.form_id = 1
      ),
      client_session AS (
        SELECT DISTINCT ir.client_id, ir.session_id
        FROM intake_responses ir
        WHERE ir.session_id = $1
        LIMIT 1
      )
      SELECT
        COALESCE(
          client_responses.first_name_field,
          c.first_name,
          SPLIT_PART(client_responses.name_field, ' ', 1)
        ) AS client_first_name,
        COALESCE(
          client_responses.last_name_field,
          c.last_name,
          CASE 
            WHEN client_responses.name_field IS NOT NULL 
              AND POSITION(' ' IN client_responses.name_field) > 0
            THEN SUBSTRING(client_responses.name_field FROM POSITION(' ' IN client_responses.name_field) + 1)
            ELSE NULL
          END
        ) AS client_last_name,
        COALESCE(
          client_responses.name_field,
          CONCAT(c.first_name, ' ', c.last_name),
          CONCAT(
            COALESCE(client_responses.first_name_field, ''),
            ' ',
            COALESCE(client_responses.last_name_field, '')
          )
        ) AS client_name,
        cm.first_name AS cm_first_name,
        cm.last_name AS cm_last_name,
        s.initial_interview_id AS initialid,
        client_responses.applicant_type AS applicant_type,
        s.willingness,
        s.employability,
        s.attitude,
        s.length_of_sobriety,
        s.completed_tx,
        s.drug_test_results,
        s.homeless_episode_one,
        s.homeless_episode_two,
        s.homeless_episode_three,
        s.homeless_episode_four,
        s.disabling_condition,
        s.employed,
        -- Frontend expects driversLicense (plural)
        s.driver_license AS drivers_license,
        s.num_of_children,
        s.children_in_custody,
        s.last_city_perm_residence,
        s.decision,
        s.additional_comments,
        s.applicant_type_status,
        s.id,
        s.session_id
      FROM screener_comment s
      JOIN case_managers cm ON s.cm_id = cm.id
      CROSS JOIN client_responses
      CROSS JOIN client_session
      LEFT JOIN clients c ON client_session.client_id = c.id
      WHERE s.session_id = $1;
    `;

    const result = await db.query(query, [sessionId]);
    return res.status(200).json(keysToCamel(result));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});