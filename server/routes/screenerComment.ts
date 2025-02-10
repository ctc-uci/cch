import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";
export const screenerCommentRouter = Router();
// Get all screener comment forms
screenerCommentRouter.get("/", async (req, res) => {
  try {
    const { search, sortBy} = req.query;
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
    console.log(sortBy)
    queryStr += " ORDER BY " + sortBy + " ASC";

    const data = await db.query(queryStr);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});