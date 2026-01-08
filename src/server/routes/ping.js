
import { Router } from "express";

const router = Router()
const baseURL =  'http://localhost:3001'

 router.get(`/ping`, (req, res) => {
  res.sendStatus(200);
});

export default router 
