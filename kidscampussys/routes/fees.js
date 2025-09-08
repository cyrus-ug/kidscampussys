import express from 'express';
import {
  listFees,
  recordPayment,
  getPaymentHistory,
  generateInvoice
} from '../models/fee.js';
const router = express.Router();

// List fees with balances
router.get('/', async (req, res) => {
  const { term, class: classId, section, export: exp } = req.query;
  const result = await listFees({ term, classId, section });
  if (exp === 'csv') {
    res.setHeader('Content-Disposition', 'attachment; filename="fees.csv"');
    res.csv(result);
  } else if (exp === 'pdf') {
    const pdfBuffer = await generateInvoice({ fees: result });
    res.type('application/pdf').send(pdfBuffer);
  } else {
    res.json(result);
  }
});

// Record a payment
router.post('/pay', async (req, res) => {
  await recordPayment(req.body);
  res.json({ message: 'Payment recorded.' });
});

// Get payment history
router.get('/history', async (req, res) => {
  const { pupilId } = req.query;
  const history = await getPaymentHistory(pupilId);
  res.json(history);
});

// Generate single invoice PDF
router.get('/invoice', async (req, res) => {
  const buffer = await generateInvoice({ pupilId: req.query.pupilId });
  res.type('application/pdf')
     .setHeader('Content-Disposition', 'inline; filename="invoice.pdf"')
     .send(buffer);
});

export default router;
