'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { PermissionsService } from '@/features/auth/services/permissions.service';
import { UserWithRoles, UserRole } from '@/features/auth/types/roles.types';

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

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = 'user_permissions';

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePermissions = async () => {
      try {
        // Vérifier le cache sessionStorage
        if (typeof window !== 'undefined') {
          const cached = sessionStorage.getItem(CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            const now = Date.now();

            if (parsed.timestamp && (now - parsed.timestamp) < CACHE_DURATION) {
              console.log('PermissionsContext: Using valid cache');
              setUser(parsed.data);
              setLoading(false);
              return;
            } else {
              sessionStorage.removeItem(CACHE_KEY);
            }
          }
        }

        console.log('PermissionsContext: Fetching fresh permissions...');
        const userData = await PermissionsService.getUserPermissions();

        // Mettre en cache
        const cacheData = {
          data: userData,
          timestamp: Date.now()
        };

        if (typeof window !== 'undefined') {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        }

        setUser(userData);
      } catch (error) {
        console.error('PermissionsContext: Failed to fetch permissions:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializePermissions();
  }, []);

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
    try {
      setLoading(true);

      // Vider le cache
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(CACHE_KEY);
      }

      const userData = await PermissionsService.getUserPermissions();

      // Remettre en cache
      const cacheData = {
        data: userData,
        timestamp: Date.now()
      };

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      }

      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh permissions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPermissionsCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(CACHE_KEY);
    }
    setUser(null);
    setLoading(false);
  }, []);

  return (
    <PermissionsContext.Provider value={{
      user,
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
