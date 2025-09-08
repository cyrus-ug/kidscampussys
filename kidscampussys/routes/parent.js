import express from 'express';
import {
  getParentDashboard,
  getParentNotifications,
  getParentSettings,
  saveParentSettings
} from '../models/parent.js';

const router = express.Router();

// Returns parent name and children list
router.get('/dashboard', async (req, res) => {
  const data = await getParentDashboard(req.user.id);
  res.json(data);
});

// Returns recent notifications
router.get('/notifications', async (req, res) => {
  const notes = await getParentNotifications(req.user.id);
  res.json(notes);
});

// Get & save alert settings
router.get('/settings', async (req, res) => {
  const settings = await getParentSettings(req.user.id);
  res.json(settings);
});
router.post('/settings', async (req, res) => {
  await saveParentSettings(req.user.id, req.body);
  res.json({ message: 'Settings updated.' });
});

export default router;
