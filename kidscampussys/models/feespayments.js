// In recordPayment model
export async function recordPayment({ pupilId, scheduleId, amount, date, recordedBy }) {
  // 1. Fetch current balance
  const { amount_due } = await db.one(
    'SELECT amount_due FROM fee_schedules WHERE id=$1', [scheduleId]
  );
  const paidSum = await db.one(
    `SELECT COALESCE(SUM(amount),0) AS total
     FROM fee_payments
     WHERE pupil_id=$1 AND schedule_id=$2`,
    [pupilId, scheduleId]
  );
  const balance = amount_due - paidSum.total;
  
  // 2. Validate amount
  if (amount > balance) {
    throw new Error(`Overpayment: maximum allowed is ${balance.toFixed(2)}`);
  }
  if (amount <= 0) {
    throw new Error('Payment must be greater than zero');
  }

  // 3. Insert payment
  await db.none(
    `INSERT INTO fee_payments (pupil_id, schedule_id, amount, paid_at, recorded_by)
     VALUES ($1,$2,$3,$4,$5)`,
    [pupilId, scheduleId, amount, date, recordedBy]
  );
}
