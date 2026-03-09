'use client';

import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PermissionsService } from '@/features/auth/services/permissions.service';
import { UserWithRoles, UserRole } from '@/features/auth/types/roles.types';
import { usePermissionsQuery, PERMISSIONS_QUERY_KEY } from '@/features/auth/hooks/use-permissions.hook';

interface PermissionsContextType {
  user: UserWithRoles | null;
  loading: boolean;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (resource: string, action: string) => boolean;
  canAccess: (resource: string, action?: string) => boolean;
  refreshPermissions: () => Promise<void>;
  clearPermissionsCache: () => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading: loading } = usePermissionsQuery();

  const hasRole = useCallback((role: UserRole) => {
    return user ? PermissionsService.hasRole(user, role) : false;
  }, [user]);

  const hasPermission = useCallback((resource: string, action: string) => {
    return user ? PermissionsService.hasPermission(user, resource, action) : false;
  }, [user]);

  const canAccess = useCallback((resource: string, action: string = 'read') => {
    return user ? PermissionsService.canAccess(user, resource, action) : false;
  }, [user]);

  const refreshPermissions = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY });
  }, [queryClient]);

  const clearPermissionsCache = useCallback(() => {
    queryClient.setQueryData(PERMISSIONS_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: PERMISSIONS_QUERY_KEY });
  }, [queryClient]);

  return (
    <PermissionsContext.Provider value={{
      user: user || null,
      loading,
      hasRole,
      hasPermission,
      canAccess,
      refreshPermissions,
      clearPermissionsCache
    }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissionsContext() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissionsContext must be used within a PermissionsProvider');
  }
  return context;
}
