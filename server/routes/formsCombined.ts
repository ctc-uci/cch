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

    const client = clientResult[0];
    const clientFirstName = client.first_name || '';
    const clientLastName = client.last_name || '';
    const clientPhoneNumber = client.phone_number || '';
    const clientDateOfBirth = client.date_of_birth || '';

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

    // Query for forms in intake_responses that match by field_keys
    // We need to find sessions where all four fields match:
    // 1. field_key containing "first_name" with matching value
    // 2. field_key containing "last_name" with matching value
    // 3. field_key containing "phone_number" with matching value
    // 4. field_key containing "date_of_birth" with matching value
    interface FormMatch {
      id: string | number;
      client_id: number | null;
      date: string | Date;
      type: string;
    }
    
    const fieldMatches: FormMatch[] = [];
    
    if (clientFirstName && clientLastName && clientPhoneNumber && clientDateOfBirth) {
      // Normalize phone numbers (remove non-digits) for comparison
      const normalizedClientPhone = (clientPhoneNumber || '').replace(/\D/g, '');
      
      // Find sessions that have all four matching fields
      // We'll use a subquery approach to check each condition
      const matchingSessions = await db.query(
        `SELECT 
          ir.session_id, 
          ir.form_id, 
          ir.submitted_at AS date
        FROM intake_responses ir
        WHERE ir.session_id IN (
          -- Sessions matching first_name
          SELECT DISTINCT ir1.session_id
          FROM intake_responses ir1
          JOIN form_questions fq1 ON ir1.question_id = fq1.id
          WHERE LOWER(fq1.field_key) LIKE '%first_name%' 
            AND LOWER(TRIM(ir1.response_value)) = LOWER(TRIM($1))
          
          INTERSECT
          
          -- Sessions matching last_name
          SELECT DISTINCT ir2.session_id
          FROM intake_responses ir2
          JOIN form_questions fq2 ON ir2.question_id = fq2.id
          WHERE LOWER(fq2.field_key) LIKE '%last_name%' 
            AND LOWER(TRIM(ir2.response_value)) = LOWER(TRIM($2))
          
          INTERSECT
          
          -- Sessions matching phone_number
          SELECT DISTINCT ir3.session_id
          FROM intake_responses ir3
          JOIN form_questions fq3 ON ir3.question_id = fq3.id
          WHERE LOWER(fq3.field_key) LIKE '%phone_number%' 
            AND REGEXP_REPLACE(ir3.response_value, '[^0-9]', '', 'g') = $3
          
          INTERSECT
          
          -- Sessions matching date_of_birth
          SELECT DISTINCT ir4.session_id
          FROM intake_responses ir4
          JOIN form_questions fq4 ON ir4.question_id = fq4.id
          WHERE LOWER(fq4.field_key) LIKE '%date_of_birth%' 
            AND (
              -- Try to match as date
              (ir4.response_value::date = $4::date)
              OR
              -- Try to match as text (in case date format differs)
              (LOWER(TRIM(ir4.response_value)) = LOWER(TRIM($4::text)))
            )
        )
        GROUP BY ir.session_id, ir.form_id, ir.submitted_at
        ORDER BY ir.submitted_at DESC`,
        [
          clientFirstName, 
          clientLastName, 
          normalizedClientPhone, 
          clientDateOfBirth
        ]
      );

      // Deduplicate by session_id (in case there are any duplicates)
      const seenSessionIds = new Set<string>();
      
      // Convert matching sessions to form items with appropriate types
      for (const form of matchingSessions as Array<{ session_id: string; form_id: number; date: Date | string | null }>) {
        // Skip if we've already processed this session_id
        if (seenSessionIds.has(form.session_id)) {
          continue;
        }
        seenSessionIds.add(form.session_id);
        
        fieldMatches.push({
          id: form.session_id, // Use session_id as identifier (UUID string)
          client_id: null, // These forms don't have a direct client_id
          date: form.date || new Date(),
          type: form.form_id === 1 ? 'Initial Interview' :
                form.form_id === 2 ? 'Exit Survey' :
                form.form_id === 3 ? 'Success Story' :
                'Unknown'
        });
      }
    }

    // Combine both results
    const allForms = [...directMatches, ...fieldMatches];
    
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

