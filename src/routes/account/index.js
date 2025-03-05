import express from 'express';
import { registerUser, verifyUser } from '../../models/account/index.js';
import { body, validationResult } from "express-validator";
import { requireAuth } from '../../utils/index.js';

const router = express.Router();

// GET /account/register
router.get('/register', (req, res) => {
    res.locals.scripts.push('<script src="/js/registration.js"></script>');
    res.render('account/register', { title: 'Register' });
});

const registrationValidation = [
    body("email")
        .isEmail()
        .withMessage("Invalid email format."),
    body("password")
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
        .withMessage("Password must be at least 8 characters long, include one uppercase letter, one number, and one symbol.")
];

// POST /account/register
router.post('/register', registrationValidation, async (req, res) => {
    const results = validationResult(req);
    if (results.errors.length > 0) {
        results.errors.forEach((error) => {
            req.flash('error', error.msg);
        });
        res.redirect('/account/register');
    }

    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirm_password;
    
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords did not match.');
        res.redirect('/account/register');
        return;
    }

    await registerUser(email, password);
    res.redirect('/account/login');
});

// GET /account/login
router.get('/login', (req, res) => {
    res.render('account/login', { title: 'Login' });
});

// POST /account/login
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await verifyUser(email, password);

    if (!user) {
        req.flash('error', 'The information provided does not match our records. Please verify and try again.');
        res.redirect('/account/login');
        return;
    }

    delete user.password;
    req.session.user = useTruer;
    
    res.redirect('/account');
});

// GET /account
router.get('/', requireAuth, (req, res) => {
    res.render('account/index', { title: 'Account' });
});

// GET /account/logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

export default router;