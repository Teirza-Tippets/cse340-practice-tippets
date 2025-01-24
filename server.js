// Import express using ESM syntax
import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mode = process.env.MODE || 'production';
const port = process.env.PORT || 3000;

// Create an instance of an Express application
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Register the 'public' directory to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Home page
app.get('/', (req, res) => {
    const title = 'Home Page';
    const content = '<h1>Welcome to the Home Page</h1>';
    res.render('index', { title, content, mode, port });
});

// About page
app.get('/about', (req, res) => {
    const title = 'About Page';
    const content = '<h1>Welcome to the About Page</h1>';
    res.render('index', { title, content, mode, port });
});

// Contact page
app.get('/contact', (req, res) => {
    const title = 'Contact Page';
    const content = '<h1>Welcome to the Contact Page</h1>';
    res.render('index', { title, content, mode, port });
});

// Account page
app.get('/account/:name/:id', (req, res) => {
    const title = "Account Page";
    const { name, id } = req.params;
    const isEven = id % 2 === 0 ? "even" : "odd";
    const content = `
        <h1>Welcome, ${name}!</h1>
        <p>Your account ID is ${id}, which is an ${isEven} number.</p>
    `;
    res.render('index', { title, content, mode, port });
});

//404 error
app.use((req, res, next) =>{
    const title = 'Page Not Found'
    res.status(404);
    res.render('404', title, mode, port);
});

// When in development mode, start a WebSocket server for live reloading
if (mode.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(port) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket is running on http://localhost:${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}




// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});