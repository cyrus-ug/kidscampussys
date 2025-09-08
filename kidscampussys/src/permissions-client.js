// src/permissions-client.js
import PERMISSIONS from '../permissions.js';

let userRole = null;

// Call on app start
export async function initUserPermissions() {
  const { role } = await fetch('/api/auth/me', { credentials:'include' })
                          .then(r => r.json());
  userRole = role;
}

// Returns true if allowed
export function can(resource, action) {
  if (!userRole) return false;
  const perms = PERMISSIONS[userRole]?.[resource] || [];
  return perms.includes(action);
}
