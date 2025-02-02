const assetInjector = (req, res, next) => {
    res.locals.scripts = [];
    res.locals.styles = [];

    res.addScript = (src) => {
        if (!res.locals.scripts.includes(src)) {
            res.locals.scripts.push(src);
        }
    };

    res.addStyle = (href) => {
        if (!res.locals.styles.includes(href)) {
            res.locals.styles.push(href);
        }
    };

    next();
};

export default assetInjector;
