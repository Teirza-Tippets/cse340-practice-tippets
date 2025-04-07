import express from 'express';
import { getUserReviews, getUserRepairs } from '../models/userModel.js';
import { ensureLoggedIn } from '../middleware/auth.js';

const router = express.Router();

router.get('/', ensureLoggedIn, async (req, res) => {
  const user = req.session.user;
  const reviews = await getUserReviews(user.id);
  const repairs = await getUserRepairs(user.id);

  res.render('dashboard/user', {
    title: 'Dashboard',
    user,
    reviews,
    repairs
  });
});

export default router;