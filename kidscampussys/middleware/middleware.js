// middleware/authorize.js
import PERMISSIONS from '../permissions.js';

function hasPermission(role, resource, action) {
  const perms = PERMISSIONS[role]?.[resource];
  return Array.isArray(perms) && perms.includes(action);
}

export function authorize(resource, action) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!hasPermission(role, resource, action)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}
