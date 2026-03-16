import bcrypt from 'bcryptjs';
import { query } from '../../config/db.js';

export const registerUser = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
    [username, email, hashedPassword]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await query(
    'SELECT id, username, email, password FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};
