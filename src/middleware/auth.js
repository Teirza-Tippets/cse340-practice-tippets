
export function ensureLoggedIn(req, res, next) {
    if (!req.session.user) return res.redirect('/login');
    next();
  }
  
  export function requireRole(role) {
    return (req, res, next) => {
      if (!req.session.user || req.session.user.role !== role) {
        return res.status(403).send('Forbidden');
      }
      next();
    };
  }
  