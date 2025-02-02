// Import required modules
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Import middlewares and routes
import baseRoute from './src/routes/index.js';
import layouts from './src/middleware/layouts.js';
import staticPaths from './src/middleware/static-paths.js';
import { notFoundHandler, globalErrorHandler } from './src/middleware/error-handler.js';
import assetInjector from './src/middleware/assetInjector.js';
import devModeMiddleware from './src/middleware/devMode.js';

// Get current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Serve static files before other middleware
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(staticPaths);
app.use(assetInjector);
app.use(devModeMiddleware);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Set layouts
app.set('layout default', 'default');
app.set('layouts', path.join(__dirname, 'src/views/layouts'));
app.use(layouts);

// Routes
app.use('/', baseRoute);

// Error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Use NODE_ENV instead of MODE
const mode = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

// Start Express server
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT} in ${mode} mode`);
});

// Live reload WebSocket (only in development mode)
if (mode.includes('dev')) {
    (async () => {
        try {
            const { WebSocketServer } = await import('ws');
            const wsPort = parseInt(PORT) + 1;
            const wsServer = new WebSocketServer({ port: wsPort });

            wsServer.on('listening', () => {
                console.log(`Live reload WebSocket server running on port ${wsPort}`);
            });

            wsServer.on('connection', (ws) => {
                console.log("WebSocket client connected");
            });

            wsServer.on('error', (error) => {
                console.error('WebSocket server error:', error);
            });

            // Watch for file changes
            import('fs').then(({ watch }) => {
                const watchDirs = ['src/views', 'public/css', 'public/js'];

                watchDirs.forEach((dir) => {
                    watch(dir, { recursive: true }, () => {
                        wsServer.clients.forEach((client) => {
                            if (client.readyState === 1) {
                                client.send('reload');
                            }
                        });
                    });
                });
            });

        } catch (error) {
            console.error('Failed to start WebSocket server:', error);
        }
    })();
}
