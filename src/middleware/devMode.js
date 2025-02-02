const devModeMiddleware = (req, res, next) => {
    const isDevMode = process.env.NODE_ENV !== 'production';
    res.locals.isDevMode = isDevMode;
    res.locals.devModeWarning = isDevMode ? "⚠️ You are in development mode. Changes may not be final." : "";

    next();
};

export default devModeMiddleware;
