import express from 'express';
import {
  listTerms,
  createTerm,
  openTerm,
  closeTerm,
  archiveTerm
} from '../models/term.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const terms = await listTerms(req.query.archived === 'true');
  res.json(terms);
});

router.post('/', async (req, res) => {
  const term = await createTerm(req.body);
  res.status(201).json(term);
});

router.put('/:id/open', async (req, res) => {
  await openTerm(req.params.id);
  res.json({ message: 'Term opened.' });
});

router.put('/:id/close', async (req, res) => {
  await closeTerm(req.params.id);
  res.json({ message: 'Term closed.' });
});

router.put('/:id/archive', async (req, res) => {
  await archiveTerm(req.params.id);
  res.json({ message: 'Term archived.' });
});

export default router;
