import express from 'express';
import {
  listRequirements,
  getInventoryStatus,
  updateSubmission,
  bulkUpdateSubmissions,
  notifyMissingItems
} from '../models/requirements.js';

const router = express.Router();

// List all requirement types
router.get('/', async (req, res) => {
  const reqs = await listRequirements();
  res.json(reqs);
});

// Get pupils + their submission statuses
router.get('/tracker', async (req, res) => {
  const { term, class: classId, section } = req.query;
  const data = await getInventoryStatus({ term, classId, section });
  res.json(data);
});

// Update single submission status
router.post('/tracker', async (req, res) => {
  const { pupilId, reqId, submitted } = req.body;
  await updateSubmission({ pupilId, reqId, submitted });
  res.json({ message: 'Updated' });
});

// Bulk update for one pupil
router.post('/tracker/bulk', async (req, res) => {
  const { pupilId, updates } = req.body; // updates: [{reqId, submitted},…]
  await bulkUpdateSubmissions(pupilId, updates);
  res.json({ message: 'Bulk updated' });
});

// Send missing items notification
router.post('/tracker/notify', async (req, res) => {
  await notifyMissingItems(req.body); 
  res.json({ message: 'Notifications sent' });
});

export default router;
