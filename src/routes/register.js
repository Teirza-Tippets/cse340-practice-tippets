import express from 'express';
import { findUserByEmail, createUser } from '../models/userModel.js';


const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).send('User already exists');
    const newUser = await createUser(name, email, password);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;
