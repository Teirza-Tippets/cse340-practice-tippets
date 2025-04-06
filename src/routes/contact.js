import express from 'express';
const router = express.Router();

// Route to render the contact form
router.get('/', (req, res) => {
  try {
    res.render('contact/index', { title: 'Contact Us' }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Route to handle form submission securely
router.post('/record', async (req, res) => {
  try {
    const { username, password, email, rating } = req.body;

    res.render('record', { 
      title: 'Submission Received',
      username,
      email,
      rating
    }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;