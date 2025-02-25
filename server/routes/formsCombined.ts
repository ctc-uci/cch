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
