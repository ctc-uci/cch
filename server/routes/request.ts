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

requestRouter.post('/', async (req, res) => {
  try{
    const { comments, cm_id, client_ids } = req.body;
    const newComments = comments || '';
    const values = client_ids.map((client_id: number) => `('${newComments}', ${cm_id}, ${client_id})`).join(',');
    const request = await db.query(`INSERT INTO requests(comments, created_by, client_id) VALUES ${values} RETURNING *`);
    res.status(500).json(request);
  }catch(err){
    res.status(500).json(err.message);
  }
});
