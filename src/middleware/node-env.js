import { getNav } from '../utils/index.js';

const port = process.env.PORT || 3000;
const mode = process.env.MODE || 'production';

const configureNodeEnvironment = async (req, res, next) => {
    res.locals.isLoggedIn = req.session.user ? true : false;
    res.locals.devModeWarning = '';
    res.locals.isDevMode = mode.includes('dev');
    res.locals.navHTML = await getNav(req.session.user);
    res.locals.port = port;
    res.locals.scripts = [];
    res.locals.styles = [];

    if (res.locals.isDevMode) {
        // Add development mode warning
        res.locals.devModeWarning = '<p class="dev-mode-msg">Site is in development mode<p>';

        // Add livereload script
        res.locals.scripts.push(`
            <script>
                const ws = new WebSocket('ws://127.0.0.1:${parseInt(port) + 1}');
                ws.onclose = () => {
                    setTimeout(() => location.reload(), 2000);
                };
            </script>    
        `);
    }

    next();
};

export default configureNodeEnvironment;