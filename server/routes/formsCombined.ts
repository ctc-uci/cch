import { Router } from 'express';
import { keysToCamel } from '../common/utils';

import { db } from '../db/db-pgp';

export const formsCombinedRouter = Router();

formsCombinedRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // First, get the client's information
    const clientResult = await db.query(
      `SELECT first_name, last_name, phone_number, date_of_birth FROM clients WHERE id = $1`,
      [id]
    );

    if (clientResult.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Query for forms with direct client_id matches (old tables)
    const directMatches = await db.query(
      `SELECT id, client_id, date, 'Exit Survey' AS type
      FROM exit_survey
      WHERE client_id = $1

      UNION ALL

      SELECT id, client_id, date, 'Success Story' AS type
      FROM success_story
      WHERE client_id = $1

      UNION ALL

      SELECT id, client_id, date, 'Initial Interview' AS type
      FROM initial_interview
      WHERE client_id = $1;`,
      [id]
    );

    // Query for forms in intake_responses that match by client_id
    // Exclude random client survey (form_id = 4)
    // Group by session_id to ensure one row per form submission
    const matchedForms = await db.query(
      `SELECT 
        ir.session_id AS id,
        ir.client_id,
        MAX(ir.submitted_at) AS date,
        MAX(CASE ir.form_id
          WHEN 1 THEN 'Initial Interview'
          WHEN 2 THEN 'Exit Survey'
          WHEN 3 THEN 'Success Story'
          ELSE 'Unknown'
        END) AS type
      FROM intake_responses ir
      WHERE ir.client_id = $1
        AND ir.form_id != 4
      GROUP BY ir.session_id, ir.client_id
      ORDER BY MAX(ir.submitted_at) DESC`,
      [id]
    );

    // Combine both results
    const allForms = [...directMatches, ...matchedForms];
    
    res.status(200).json(keysToCamel(allForms));
  } catch (err) {
    console.error('Error in /formsCombined:', err);
    res.status(500).send(err.message);
  }
});

// formsCombinedRouter.get("/", async (req, res) => {
//   const { filter, search } = req.query;

//   try {
//     const baseQuery = `
//       SELECT id, name, date, title FROM (
//         SELECT 
//           id,
//           name,
//           date,
//           'Initial Screeners' AS title
//         FROM initial_interview

//         UNION ALL

//         SELECT 
//           id,
//           CONCAT(first_name, ' ', last_name) AS name,
//           date,
//           'Client Tracking Statistics (Intake Statistics)' AS title
//         FROM intake_statistics_form

//         UNION ALL

//         SELECT 
//           id,
//           '' AS name,
//           date,
//           'Front Desk Monthly Statistics' AS title
//         FROM front_desk_monthly

//         UNION ALL

//         SELECT 
//           id,
//           '' AS name,
//           date,
//           'Case Manager Monthly Statistics' AS title
//         FROM cm_monthly_stats

//         UNION ALL

//         SELECT 
//           id,
//           '' AS name,
//           date,
//           'Exit Surveys' AS title
//         FROM exit_survey

//         UNION ALL

//         SELECT 
//           id,
//           '' AS name,
//           date,
//           'Success Stories' AS title
//         FROM success_story

//         UNION ALL

//         SELECT 
//           id,
//           '' AS name,
//           date,
//           'Random Client Surveys' AS title
//         FROM random_survey_table
//       ) AS forms
//       WHERE 1=1
//     `;

//     const values: (string | number | boolean | null)[] = [];
//     let query = baseQuery;

//     if (search) {
//       values.push(`%${search}%`);
//       const i = values.length;
//       query += `
//         AND (
//           name ILIKE $${i} OR
//           title ILIKE $${i} OR
//           CAST(date AS TEXT) ILIKE $${i}
//         )
//       `;
//     }

//     if (filter) {
//       query += ` AND ${filter}`;
//     }

//     query += " ORDER BY date DESC";

//     const results = await db.query(query, values);
//     res.status(200).json(keysToCamel(results));
//   } catch (err) {
//     console.error("Error in /formsCombined:", err.message);
//     res.status(500).send(err.message);
//   }
// });

