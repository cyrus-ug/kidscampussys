import express from 'express';
import {
  getChildrenNotifications,
  saveChildrenNotifications
} from '../models/parentNotifications.js';

const router = express.Router();

// Returns list of children, events, and current settings
router.get('/children-notifications', async (req, res) => {
  const data = await getChildrenNotifications(req.user.id);
  res.json(data);
});

// Saves bulk preferences
router.post('/children-notifications', async (req, res) => {
  await saveChildrenNotifications(req.user.id, req.body.preferences);
  res.json({ message: 'Preferences updated.' });
});

export default router;
