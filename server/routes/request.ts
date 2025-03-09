import { Router } from 'express';
import { db } from "../db/db-pgp";


export const requestRouter = Router();
requestRouter.get('/', async (req, res) => {
  try{
    const requests = await db.query('SELECT * FROM requests');
    res.status(200).json(requests);
  }catch(err){
    res.status(500).json(err.message);
  }
});

requestRouter.get('/activeRequests', async (req, res) => {
  try{
    const query = `SELECT r.id, c.first_name, c.last_name, r.created_at, cm.first_name AS cm_first_name, cm.last_name AS cm_last_name, r.comments
                  FROM clients AS c 
                    INNER JOIN requests AS r ON r.client_id = c.id 
                    INNER JOIN case_managers AS cm ON cm.id = r.created_by
                  WHERE r.status = 'active' ORDER BY created_at DESC`;
    const requests = await db.query(query);
    res.status(200).json(requests);
  }catch(err){
    res.status(500).json(err.message);
  }
});

requestRouter.post('/', async (req, res) => {
  try{
    const { comments, cm_id, client_ids } = req.body;
    const newComments = comments || '';
    const values = client_ids.map((client_id: number) => `('${newComments}', ${cm_id}, ${client_id})`).join(',');
    const request = await db.query(`INSERT INTO requests(comments, created_by, client_id) VALUES ${values} RETURNING *`);
    res.status(200).json(request);
  }catch(err){
    res.status(500).json(err.message);
  }
});

requestRouter.put('/:id', async (req, res) => {
  try{
    const { id } = req.params;
    const { status, admin } = req.body;

    const userQuery = await db.query(`SELECT id FROM users WHERE firebase_uid = $1`, [admin.uid]);

    if (userQuery.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const internalUserId = userQuery[0].id;

    const request = await db.query(`UPDATE requests SET status = $1, updated_by = $2, updated_at = NOW() WHERE id = $3 RETURNING *`, [status, internalUserId, id]);
    res.status(200).json(request);
  }catch(err){
    res.status(500).json(err.message);
  }
});
