// routes/pupils.js
import express from 'express';
import { createPupil } from '../models/pupil.js';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const pupil = await createPupil(req.body);
    res.status(201).json(pupil);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
