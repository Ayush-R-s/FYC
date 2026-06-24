import { ShieldOff } from 'lucide-react';
import { hasRole } from '../../utils/roleUtils';

/**
 * RoleGuard — wraps a section and shows an "Access Denied" panel
 * if the current admin's role is not in the `allowedRoles` list.
 *
 * Usage:
 *   <RoleGuard allowedRoles={['SUPER_ADMIN']}>
 *     <StudentDetails />
 *   </RoleGuard>
 */
export default function RoleGuard({ allowedRoles = [], children }) {
  if (hasRole(allowedRoles)) {
    return children;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30">
        <ShieldOff size={44} className="text-red-400" />
      </div>

      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Your current admin role does not have permission to view this section.
          Please contact a Super Admin if you need access.
        </p>
      </div>

      <div className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono">
        Required: {allowedRoles.join(' or ')}
      </div>
    </div>
  );
}
