
import { Router } from "express";

const router = Router()
// Add GET handler
router.get('/api/ping', (req, res) => {
 console.log('Ping received at:', new Date().toISOString());
 res.json({
  status: 'ok',
  timestamp: new Date().toISOString(),
  uptime: process.uptime()
 });
});

export default router;
