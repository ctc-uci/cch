import { Router } from 'express';
import { keysToCamel } from '../common/utils';

import { db } from '../db/db-pgp';

export const formsCombinedRouter = Router();

formsCombinedRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await db.query(
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
    res.status(200).json(keysToCamel(data));
  } catch (err) {
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

