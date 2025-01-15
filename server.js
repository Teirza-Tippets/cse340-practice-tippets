import express from 'express';

const app = express();

const name = process.env.NAME; // <-- NEW

app.get('/', (req, res) => {
    res.send(`Hello, ${name}!`); // <-- UPDATED
});

app.get('/home', (req, res) => {
    res.send('Welcome, this is the home page!')
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});