import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const mode = process.env.MODE || 'production';
const port = process.env.PORT || 3000;
const app = express();


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

//global midellware for mode for dev vs production
app.use((req, res, next) => {
    res.locals.devModeEnables = true;
    res.locals.port = port;
    next();
});

//global middleware
app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'Express Middleware Tutorial');
    next();
});

// ID validation middleware
const validateId = (req, res, next) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).send('Invalid ID: must be a number.');
    }
    next(); // Pass control to the next middleware or route
};

// Middleware to validate name
const validateName = (req, res, next) => {
    const { name } = req.params;
    if (!/^[a-zA-Z]+$/.test(name)) {
        return res.status(400).send('Invalid name: must only contain letters.');
    }
    next();
};

app.use((req, res, next) => {
    console.log(`Method: ${req.method}, URL: ${req.url}`);
    next(); // Pass control to the next middleware or route
});

// Home page
app.get('/', (req, res) => {
    const title = 'Home Page';
    const content = `<h1>Welcome to the Home Page</h1>`;
    res.render('index', { title, content});
});

// About page
app.get('/about', (req, res) => {
    const title = 'About Page';
    const content = '<h1>Welcome to the About Page</h1>';
    res.render('index', { title, content});
});

// Contact page
app.get('/contact', (req, res) => {
    const title = 'Contact Page';
    const content = '<h1>Welcome to the Contact Page</h1>';
    res.render('index', { title, content});
});

// Account page route with ID and name validation
app.get('/account/:name/:id', validateName, validateId, (req, res) => {
    const title = "Account Page";
    const { name, id } = req.params;
    const isEven = id % 2 === 0 ? "even" : "odd";
    const content = `
        <h1>Welcome, ${name}!</h1>
        <p>Your account ID is ${id}, which is an ${isEven} number.</p>`;
    res.render('index', { title, content});
});

// Handle 404 errors by passing an error
app.use((req, res, next) => {
    const error = new Error('Page Not Found');
    error.status = 404;
    next(error);
});
 
// Centralized error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const context = { mode, port };
    res.status(status);
    if (status === 404) {
        context.title = 'Page Not Found';
        res.render('404', context);
    } else {
        context.title = 'Internal Server Error';
        context.error = err.message;
        res.render('500', context);
    }
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