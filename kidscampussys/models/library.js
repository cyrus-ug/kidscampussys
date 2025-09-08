// models/library.js
import db from '../db';       // e.g., pg-promise or node-postgres wrapper
import emailService from '../services/emailService';
import smsService   from '../services/smsService';

// List books with availability and overdue count
export async function listBooks({ q, status }) {
  const where = [];
  const params = [];
  if (q) {
    params.push(`%${q}%`);
    where.push(`(b.title ILIKE $${params.length} OR b.author ILIKE $${params.length} OR b.isbn ILIKE $${params.length})`);
  }
  const statusClause = status === 'available'
    ? 'HAVING (b.total_copies - COUNT(c.id) FILTER (WHERE c.returned_at IS NULL)) > 0'
    : status === 'checked-out'
    ? 'HAVING (b.total_copies - COUNT(c.id) FILTER (WHERE c.returned_at IS NULL)) = 0'
    : '';
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const sql = `
    SELECT b.id,
           b.title,
           b.author,
           b.isbn,
           b.total_copies AS "totalCopies",
           (b.total_copies - COUNT(c.id) FILTER (WHERE c.returned_at IS NULL)) AS "availableCopies",
           COUNT(c.id) FILTER (
             WHERE c.returned_at IS NULL AND c.due_date < CURRENT_DATE
           ) AS "overdueCount"
    FROM books b
    LEFT JOIN checkouts c ON c.book_id = b.id
    ${whereSql}
    GROUP BY b.id
    ${statusClause}
    ORDER BY b.title
  `;
  return db.any(sql, params);
}

// Get single book
export async function getBook(id) {
  return db.one(`
    SELECT id, title, author, isbn, total_copies AS "totalCopies"
    FROM books WHERE id=$1
  `, [id]);
}

// Create a new book
export async function createBook({ title, author, isbn, copies }) {
  return db.none(`
    INSERT INTO books (title, author, isbn, total_copies)
    VALUES ($1, $2, $3, $4)
  `, [title, author, isbn, copies]);
}

// Update existing book
export async function updateBook(id, { title, author, isbn, copies }) {
  return db.none(`
    UPDATE books
       SET title=$1, author=$2, isbn=$3, total_copies=$4
     WHERE id=$5
  `, [title, author, isbn, copies, id]);
}

// Delete book
export async function deleteBook(id) {
  // Cascade deletes or enforce FK constraints as needed
  return db.none(`DELETE FROM books WHERE id=$1`, [id]);
}

// Checkout a book
export async function checkoutBook({ bookId, pupilId, dueDate }) {
  await db.tx(async t => {
    // Check availability
    const { available } = await t.one(`
      SELECT (total_copies - COUNT(c.id) FILTER (WHERE c.returned_at IS NULL)) AS available
      FROM books b
      LEFT JOIN checkouts c ON c.book_id=b.id
      WHERE b.id=$1
      GROUP BY b.total_copies
    `, [bookId]);
    if (available < 1) throw new Error('No copies available');

    // Record checkout
    await t.none(`
      INSERT INTO checkouts (book_id, pupil_id, checked_out_at, due_date)
      VALUES ($1, $2, CURRENT_DATE, $3)
    `, [bookId, pupilId, dueDate]);
  });
}

// Return a checked-out copy
export async function returnBook({ checkoutId }) {
  return db.none(`
    UPDATE checkouts
       SET returned_at = CURRENT_DATE
     WHERE id = $1
       AND returned_at IS NULL
  `, [checkoutId]);
}

// Get borrowing history for a book
export async function getHistory(bookId) {
  return db.any(`
    SELECT c.id AS "checkoutId",
           p.full_name AS "pupilName",
           c.checked_out_at AS "checkedOut",
           c.returned_at AS "returned",
           (c.returned_at IS NULL AND c.due_date < CURRENT_DATE) AS "overdue"
    FROM checkouts c
    JOIN pupils p ON p.id = c.pupil_id
    WHERE c.book_id = $1
    ORDER BY c.checked_out_at DESC
  `, [bookId]);
}
