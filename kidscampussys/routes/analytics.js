import express from 'express';
import { getAnalytics } from '../models/analytics.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const { term, class: classId, gender, section } = req.query;
  const data = await getAnalytics({ term, classId, gender, section });
  res.json(data);
});

export default router;

// routes/analytics.js (excerpt)
router.get('/', async (req, res) => {
  const { term, class: classId, gender, section } = req.query;
  const data = await getAnalytics({ term, classId, gender, section });
  // data.gradeDistribution, data.heatmap, data.heatmapMin, data.heatmapMax, data.terms
  res.json(data);
});
