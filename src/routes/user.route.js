import { Router } from 'express';
import { register, login } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/users/register
router.post('/register', register);

// POST /api/users/login
router.post('/login', login);

// GET /api/users/me  — protected route
router.get('/me', authenticate, (req, res) => {
  res.json({ status: 'ok', data: req.user });
});

export default router;
