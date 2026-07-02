'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/store';
import { LuBuilding2 as Building2 } from 'react-icons/lu';

export interface WithAuthProps {
  // Common props if any
}

export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  allowedRoles?: string[],
  employerRoleRedirect?: { role: string; redirectTo: string }
) {
  const ComponentWithAuth: React.FC<T & WithAuthProps> = (props) => {
    const router = useRouter();
    const { user } = useAppStore();
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (mounted) {
        if (!user) {
          router.replace('/');
        } else if (allowedRoles && !allowedRoles.includes(user.role)) {
          router.replace('/');
        } else if (employerRoleRedirect && user.employerRole === employerRoleRedirect.role) {
          router.replace(employerRoleRedirect.redirectTo);
        }
      }
    }, [mounted, user, router]);

    const pageContent = (!mounted || !user) ? (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Building2 className="h-10 w-10 text-primary animate-bounce mx-auto" />
          <p className="text-slate-600 font-bold text-sm">Loading BlueJob Recruiter Dashboard...</p>
        </div>
      </main>
    ) : (
      <WrappedComponent {...props} />
    );

    return pageContent;
  };

  ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuth;
}

export default withAuth;
