// routes/marks.js
import express from 'express';
import { getMarksByFilter, saveMarksBulk } from '../models/marks.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const { term, class: classId, subject } = req.query;
  const pupils = await getMarksByFilter({ term, classId, subject });
  res.json(pupils);
});

router.post('/', async (req, res) => {
  try {
    await saveMarksBulk(req.body);
    res.json({ message: 'Marks saved.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// routes/marks.js
import express from 'express';
import { authorize } from '../middleware/authorize.js';

// Create or update marks
router.post(
  '/entry',
  authorize('Marks', 'C'),
  async (req, res) => { /* ... */ }
);

// Read marks
router.get(
  '/:classId/:subjectId',
  authorize('Marks', 'R'),
  async (req, res) => { /* ... */ }
);

export default router;
