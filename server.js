// Import required modules using ESM import syntax
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Import all other required modules: Route handlers, Middleware, etc.
import SQLiteStore from "connect-sqlite3";
import accountRoute from './src/routes/account/index.js';
import baseRoute from './src/routes/index.js';
import categoryRoute from './src/routes/category/index.js';
import configNodeEnv from './src/middleware/node-env.js';
import configureStaticPaths from './src/middleware/static-paths.js';
import fileUploads from './src/middleware/file-uploads.js';
import flashMessages from './src/middleware/flash-messages.js';
import gameRoute from './src/routes/game/index.js';
import layouts from './src/middleware/layouts.js';
import session from 'express-session';
import { notFoundHandler, globalErrorHandler } from './src/middleware/error-handler.js';
import { setupDatabase } from './src/database/index.js';
import contactRouter from './src/routes/contact/index.js';

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start the server on the specified port
const port = process.env.PORT || 3000;
const mode = process.env.MODE || 'production';
const SQLiteSessionStore = SQLiteStore(session);

// Create an instance of an Express application
const app = express();

// Configure session middleware
app.use(session({
    store: new SQLiteSessionStore({
        db: "db.sqlite", // SQLite database file
        dir: "./src/database/", // Directory where the file is stored
        concurrentDB: true // Allows multiple processes to use the database
    }),
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false, // Prevents re-saving sessions that have not changed
    saveUninitialized: true, // Saves new sessions even if unmodified
    name: "sessionId",
    cookie: {
        secure: false, // Set to `true` in production with HTTPS
        httpOnly: true, // Prevents client-side access to the cookie
    }
}));

// Configure the application based on environment settings
app.use(configNodeEnv);

// Configure static paths for the Express application
configureStaticPaths(app);

// Set EJS as the view engine and record the location of the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Set Layouts middleware to automatically wrap views in a layout and configure default layout
app.set('layout default', 'default');
app.set('layouts', path.join(__dirname, 'src/views/layouts'));
app.use(layouts);

// Middleware to process multipart form data with file uploads
app.use(fileUploads);

// Middleware to parse JSON data in request body
app.use(express.json());

// Middleware to parse URL-encoded form data (like from a standard HTML form)
app.use(express.urlencoded({ extended: true }));

// Middleware to handle flash messages
app.use(flashMessages);

// Use the home route for the root URL
app.use('/', baseRoute);

// Handle routes specific to the games
app.use('/game', gameRoute);

// Handle routes specific to the categories
app.use('/category', categoryRoute);

// Handle routes specific to the account
app.use('/account', accountRoute);

app.use('/contact', contactRouter);

// Apply error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// When in development mode, start a WebSocket server for live reloading
if (mode.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(port) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

// Start the Express server
app.listen(port, async () => {
    // Ensure the database is setup
    await setupDatabase();

    console.log(`Server running on http://127.0.0.1:${port}`);
});