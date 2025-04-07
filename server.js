/**
 * Imports
 */
import configNodeEnv from './src/middleware/node-env.js';
import express from "express";
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import fileUploads from './src/middleware/file-uploads.js';
import homeRoute from './src/routes/index.js';
import layouts from './src/middleware/layouts.js';
import path from "path";
import { configureStaticPaths } from './src/utils/index.js';
import { fileURLToPath } from 'url';
import { testDatabase } from './src/models/index.js';
import vehicleRoutes from './src/routes/vehicles.js';
import userRoutes from './src/routes/register.js';
import contactRoutes from './src/routes/contact.js';
import loginRoutes from './src/routes/login.js';
import dashboardRoutes from './src/routes/dashboard.js';
import categoriesRoutes from './src/routes/catgegories.js';

/**
 * Global Variables
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mode = process.env.NODE_ENV;
const port = process.env.PORT;

/**
 * Create and configure the Express server
 */
const app = express();

// Configure the application based on environment settings
app.use(configNodeEnv);

// Configure static paths (public dirs) for the Express application
configureStaticPaths(app);

// Set EJS as the view engine and record the location of the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Set Layouts middleware to automatically wrap views in a layout and configure default layout
app.set('layout', 'default');
app.set('layouts', path.join(__dirname, 'src/views/layouts'));
app.use(layouts);

// Middleware to process multipart form data with file uploads
app.use(fileUploads);

// Middleware to parse JSON data in request body
app.use(express.json());

// Middleware to parse URL-encoded form data (like from a standard HTML form)
app.use(express.urlencoded({ extended: true }));

// Session middleware setup
const PgSession = pgSession(session);
app.use(session({
  store: new PgSession({ pool: testDatabase }),
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: mode === 'production' }
}));

/**
 * Routes
 */
app.use('/', homeRoute);
app.use('/vehicles', vehicleRoutes);
app.use('/users', userRoutes);
app.use('/contact', contactRoutes);
app.use('/auth', loginRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/categories' , categoriesRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: 'Server Error' });
});

/**
 * Start the server
 */

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
  await testDatabase();
  console.log(`Server running on http://127.0.0.1:${port}`);
});
