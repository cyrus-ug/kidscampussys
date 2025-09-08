import express from 'express';
import multer from 'multer';
import {
  listAssignments,
  createAssignment,
  listSubmissions,
  submitAssignment,
  gradeSubmissions
} from '../models/assignment.js';

const upload = multer({ dest:'uploads/' });
const router = express.Router();

// List assignments
router.get('/', async (req, res) => {
  const assignments = await listAssignments(req.user.role);
  res.json(assignments);
});

// Create or update assignment (teacher)
router.post('/', upload.array('files'), async (req, res) => {
  await createAssignment(req.body, req.files, req.user.id);
  res.json({ message:'Assignment saved.' });
});

// Student submits work
router.post('/:id/submissions', upload.single('file'), async (req, res) => {
  await submitAssignment(req.params.id, req.file, req.body.comment, req.user.id);
  res.json({ message:'Submitted.' });
});

// Teacher views submissions
router.get('/:id/submissions', async (req, res) => {
  const subs = await listSubmissions(req.params.id);
  res.json(subs);
});

// Teacher grades submissions
router.post('/:id/submissions/grade', async (req, res) => {
  await gradeSubmissions(req.body.updates, req.user.id);
  res.json({ message:'Grades saved.' });
});

export default router;
