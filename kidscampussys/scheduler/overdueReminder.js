// scheduler/overdueReminder.js
import cron from 'node-cron';
import db from '../db';
import emailService from '../services/emailService';
import smsService   from '../services/smsService';

// Every day at 7:00 AM
cron.schedule('0 7 * * *', async () => {
  // Fetch overdue checkouts
  const overdueList = await db.any(`
    SELECT b.title, p.full_name AS pupil, c.due_date
    FROM checkouts c
    JOIN books b ON b.id=c.book_id
    JOIN pupils p ON p.id=c.pupil_id
    WHERE c.returned_at IS NULL AND c.due_date < CURRENT_DATE
  `);

  if (!overdueList.length) return;

  // Format message
  const lines = overdueList.map(o =>
    `${o.pupil} – "${o.title}" due ${o.due_date.toISOString().slice(0,10)}`
  ).join('\n');

  const subject = 'Library Overdue Reminder';
  const text    = `The following checkouts are overdue:\n\n${lines}`;

  // Fetch staff contacts (implement getLibraryStaff in your model)
  const staff = await db.any(`SELECT email, phone FROM users WHERE role='librarian'`);
  for (const s of staff) {
    if (s.email) await emailService.send({ to: s.email, subject, text });
    if (s.phone) await smsService.send({ to: s.phone, message: text });
  }
});
