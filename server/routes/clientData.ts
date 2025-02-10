import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const clientDataRouter = Router();

// Get all case managers
clientDataRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT c.id, c.first_name, c.last_name, u.type, c.bed_nights_children, cm.first_name AS cm_first, cm.last_name AS cm_last, l.name AS l_name
                                 FROM clients AS c
	                                 INNER JOIN units AS u ON u.id = c.unit_id
	                                 INNER JOIN case_managers AS cm ON cm.id = c.created_by
	                                 INNER JOIN locations AS l ON l.cm_id = cm.id;`);
                                   
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
