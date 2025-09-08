import express from 'express';
import { getActivityLogs } from '../models/activityLog.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const { teacherId, action, dateFrom, dateTo, page = 1, pageSize = 20, export: exp } = req.query;
  const offset = (page - 1) * pageSize;
  const result = await getActivityLogs({ teacherId, action, dateFrom, dateTo, offset, pageSize: +pageSize });

  if (exp === 'csv') {
    res.setHeader('Content-Disposition', 'attachment; filename="activity_logs.csv"');
    res.csv(result.logs); // use a csv middleware
  } else {
    res.json({ logs: result.logs, totalPages: Math.ceil(result.total / pageSize) });
  }
});

export default router;
