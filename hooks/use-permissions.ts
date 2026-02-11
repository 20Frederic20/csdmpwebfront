'use client';

import { useState, useEffect, useRef } from 'react';
import { PermissionsService } from '@/features/auth/services/permissions.service';
import { UserWithRoles, UserRole, Permission } from '@/features/auth/types/roles.types';

// Cache global pour éviter les appels multiples
let cachedPermissions: UserWithRoles | null = null;
let cachePromise: Promise<UserWithRoles> | null = null;
let isFetching = false;

export function usePermissions() {
  const [user, setUser] = useState<UserWithRoles | null>(cachedPermissions);
  const [loading, setLoading] = useState(!cachedPermissions);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Éviter les appels multiples
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const fetchPermissions = async () => {
      try {
        setLoading(true);
        console.log('usePermissions: Starting fetch...');
        
        // Si déjà en cache, utiliser le cache
        if (cachedPermissions) {
          console.log('usePermissions: Using cached permissions');
          setUser(cachedPermissions);
          setLoading(false);
          return;
        }

        // Si une requête est déjà en cours, attendre le résultat
        if (cachePromise) {
          console.log('usePermissions: Waiting for existing fetch...');
          const userData = await cachePromise;
          setUser(userData);
          setLoading(false);
          return;
        }

        // Démarrer une nouvelle requête
        isFetching = true;
        cachePromise = PermissionsService.getUserPermissions();
        const userData = await cachePromise;
        
        // Mettre en cache
        cachedPermissions = userData;
        console.log('usePermissions: Got user data:', userData);
        setUser(userData);
      } catch (error) {
        console.error('usePermissions: Failed to fetch permissions:', error);
        setUser(null);
      } finally {
        setLoading(false);
        isFetching = false;
        cachePromise = null;
      }
    };

    fetchPermissions();
  }, []);

  const hasRole = (role: UserRole) => {
    console.log('hasRole called with:', role, 'user:', user);
    return user ? PermissionsService.hasRole(user, role) : false;
  };

  const hasPermission = (resource: string, action: string) => {
    console.log('hasPermission called with:', resource, action, 'user:', user);
    return user ? PermissionsService.hasPermission(user, resource, action) : false;
  };

  const canAccess = (resource: string, action: string = 'read') => {
    console.log('canAccess called with:', resource, action, 'user:', user);
    return user ? PermissionsService.canAccess(user, resource, action) : false;
  };

  const refreshPermissions = async () => {
    try {
      setLoading(true);
      // Forcer le rafraîchissement en vidant le cache
      cachedPermissions = null;
      const userData = await PermissionsService.getUserPermissions();
      cachedPermissions = userData;
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    hasRole,
    hasPermission,
    canAccess,
    refreshPermissions
  };
}
