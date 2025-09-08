import express from 'express';
import {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  checkoutBook,
  getHistory
} from '../models/library.js';
const router = express.Router();

router.get('/books', async (req, res) => {
  const { q, status } = req.query;
  res.json(await listBooks({ q, status }));
});
router.get('/books/:id', async (req, res) => {
  res.json(await getBook(req.params.id));
});
router.post('/books', async (req, res) => {
  await createBook(req.body);
  res.json({ message:'Added' });
});
router.put('/books/:id', async (req, res) => {
  await updateBook(req.params.id, req.body);
  res.json({ message:'Updated' });
});
router.delete('/books/:id', async (req, res) => {
  await deleteBook(req.params.id);
  res.json({ message:'Deleted' });
});
router.post('/checkout', async (req, res) => {
  await checkoutBook(req.body);
  res.json({ message:'Checked out' });
});
router.get('/history', async (req, res) => {
  res.json(await getHistory(req.query.bookId));
});

import { returnBook } from '../models/library.js';

// Mark a single checkout as returned
router.post('/return', async (req, res) => {
  try {
    const { checkoutId } = req.body;
    await returnBook({ checkoutId });
    res.json({ message: 'Book returned successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
