import express from 'express';
import { registerUser, verifyUser } from '../../models/account/index.js';

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('account/register');
});

router.post('/register', async (req, res) => {
    const { email, password, confirm_password } = req.body;
    if (!email || !password || password !== confirm_password) {
        req.flash('error', 'Required fields must not be empty or passwords do not match.');
        return res.redirect('/account/register');
    }
    try {
        await registerUser(email, password);
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/account/login');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Registration failed. Email might already be in use.');
        res.redirect('/account/register');
    }
});


router.get('/login', (req, res) => {
    res.render('account/login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.redirect('/account/login');
    }
    try {
        const user = await verifyUser(email, password);
        if (user) {
            res.redirect('/account');
        } else {
            res.redirect('/account/login');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/account/login');
    }
});

router.get('/', (req, res) => {
    res.render('account/index');
});

export default router;
