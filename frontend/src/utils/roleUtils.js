/**
 * useAdminRole — returns the current admin's role from localStorage.
 * Returns one of: "SUPER_ADMIN" | "TEACHER_ADMIN" | "ADMIN" | null
 */
export const getAdminRole = () => localStorage.getItem('userRole');

export const isSuperAdmin = () => {
  const role = getAdminRole();
  return role === 'SUPER_ADMIN' || role === 'ADMIN'; // ADMIN is legacy → treated as SUPER_ADMIN
};

export const isTeacherAdmin = () => getAdminRole() === 'TEACHER_ADMIN';

/**
 * Returns true if the current role is allowed for the given set of required roles.
 * @param {string[]} requiredRoles - e.g. ['SUPER_ADMIN'] or ['SUPER_ADMIN', 'TEACHER_ADMIN']
 */
export const hasRole = (requiredRoles = []) => {
  const role = getAdminRole();
  // Legacy "ADMIN" maps to SUPER_ADMIN
  const effective = role === 'ADMIN' ? 'SUPER_ADMIN' : role;
  return requiredRoles.includes(effective);
};
