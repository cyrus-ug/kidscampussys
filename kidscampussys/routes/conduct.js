import express from 'express';
import { saveConductReports } from '../models/conduct.js';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    await saveConductReports(req.body);
    res.json({ message: 'Reports saved.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
