import { findUserByEmail, createUser } from '../models/userModel.js';
import bcrypt from 'bcrypt';

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    req.session.role = user.role;  // Store role in the session
    res.redirect('/dashboard');
  } else {
    res.render('auth/login', { title: 'Login', error: 'Invalid credentials' });
  }
}

export async function register(req, res) {
  const { name, email, password, role = 'user' } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).send('User already exists');
    const newUser = await createUser(name, email, password, role); // Pass role to createUser
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

export function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    res.redirect('/login');
  });
}

