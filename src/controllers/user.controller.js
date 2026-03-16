import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerUser, findUserByEmail } from '../services/user.service.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'username, email and password are required.' });
    }

    const user = await registerUser(username, email, password);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.status(201).json({
      status: 'ok',
      token,
      user,
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ status: 'error', message: 'Email already registered.' });
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'email and password are required.' });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials.' });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    const { password: _, ...safeUser } = user;

    res.status(200).json({
      status: 'ok',
      token,
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
