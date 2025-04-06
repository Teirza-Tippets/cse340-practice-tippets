import express from 'express';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '../models/userModel.js';

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.render('auth/login', { title: 'Login', error: 'Invalid credentials' });
  }
});

export default router;