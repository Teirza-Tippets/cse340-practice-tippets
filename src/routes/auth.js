import express from 'express';
import { login, register, logout } from '../controllers/auth.js';

const router = express.Router();

// Login and Register Routes
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

router.post('/login', login);

router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register' });
});

router.post('/register', register);

// Logout Route
router.get('/logout', logout);

export default router;
