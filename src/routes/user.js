import express from 'express';
import { checkRole } from '../middleware/role.js';

const router = express.Router();

// Protect routes based on roles
router.get('/owner-dashboard', checkRole('owner'), (req, res) => {
  res.render('owner-dashboard');
});

router.get('/employee-dashboard', checkRole('employee'), (req, res) => {
  res.render('employee-dashboard');
});

router.get('/user-dashboard', checkRole('user'), (req, res) => {
  res.render('user-dashboard');
});

export default router;
