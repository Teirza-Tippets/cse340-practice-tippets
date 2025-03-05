import { Router } from 'express'
import { storeUserMessage } from '../../models/contact/index.js';

const router = Router();

router.get('/', (req, res) => {
    res.render('contact/index', { title: 'Contact Us' });
});

router.post('/', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    
    if (!name || !email || !message) {
        req.flash('error', 'Please complete all fields.');
        return res.redirect('/contact');
    }
    
    await storeUserMessage(name, email, message);
    req.flash('success', 'Thanks for your message! We\'ll be in touch soon.');
    res.redirect('/contact');
});

export default router;