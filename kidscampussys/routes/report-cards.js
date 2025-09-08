import express from 'express';
import { getReportData, sendReportEmail } from '../models/reportCard.js';
const router = express.Router();

// Data for client-side PDF
router.get('/', async (req, res) => {
  const { term, class: classId } = req.query;
  const pupils = await getReportData({ term, classId, summaryOnly: true });
  res.json(pupils);
});

router.get('/:pupilId', async (req, res) => {
  const { pupilId } = req.params;
  const { term } = req.query;
  const data = await getReportData({ term, pupilId });
  res.json(data);
});

// Email report (server sends PDF as attachment)
router.post('/email', async (req, res) => {
  const { pupilId, termId, to } = req.body;
  await sendReportEmail({ pupilId, termId, to });
  res.json({ message: 'Report emailed.' });
});

export default router;
