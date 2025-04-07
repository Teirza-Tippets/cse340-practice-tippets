export function checkRole(requiredRole) {
    return (req, res, next) => {
      if (!req.session.user || req.session.role !== requiredRole) {
        return res.status(403).send('Access denied');
      }
      next();
    };
  }
  
export default checkRole;