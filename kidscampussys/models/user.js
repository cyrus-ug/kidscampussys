import db from '../db.js'; // Assuming db.js exists or adjust path

export async function getUserByUsername(username) {
  return db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
}

export async function createUser({ fullName, username, passwordHash, roleId, phone }) {
  return db.one(
    'INSERT INTO users (full_name, username, password_hash, role_id, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [fullName, username, passwordHash, roleId, phone]
  );
}
