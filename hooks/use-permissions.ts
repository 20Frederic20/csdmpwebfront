'use client';

import { useState, useEffect, useRef } from 'react';
import { PermissionsService } from '@/features/auth/services/permissions.service';
import { UserWithRoles, UserRole, Permission } from '@/features/auth/types/roles.types';

// Clé pour le stockage session
const PERMISSIONS_CACHE_KEY = 'user_permissions';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache en mémoire avec timestamp
let memoryCache: { data: UserWithRoles | null; timestamp: number } | null = null;

export function usePermissions() {
  const [user, setUser] = useState<UserWithRoles | null>(() => {
    // Initialiser depuis le cache session au montage
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem(PERMISSIONS_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          const now = Date.now();
          
          // Vérifier si le cache est encore valide
          if (parsed.timestamp && (now - parsed.timestamp) < CACHE_DURATION) {
            console.log('usePermissions: Using valid session cache');
            memoryCache = parsed;
            return parsed.data;
          } else {
            // Cache expiré, le nettoyer
            sessionStorage.removeItem(PERMISSIONS_CACHE_KEY);
          }
        }
      } catch (error) {
        console.warn('Failed to parse permissions cache:', error);
        sessionStorage.removeItem(PERMISSIONS_CACHE_KEY);
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(!user);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Éviter les appels multiples
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const fetchPermissions = async () => {
      try {
        setLoading(true);
        
        // Vérifier le cache en mémoire d'abord
        if (memoryCache && memoryCache.data) {
          const now = Date.now();
          if ((now - memoryCache.timestamp) < CACHE_DURATION) {
            console.log('usePermissions: Using valid memory cache');
            setUser(memoryCache.data);
            setLoading(false);
            return;
          }
        }

        console.log('usePermissions: Fetching fresh permissions...');
        
        // Récupérer les permissions fraîches
        const userData = await PermissionsService.getUserPermissions();
        
        // Mettre à jour les deux caches
        const cacheData = {
          data: userData,
          timestamp: Date.now()
        };
        
        memoryCache = cacheData;
        
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem(PERMISSIONS_CACHE_KEY, JSON.stringify(cacheData));
          } catch (error) {
            console.warn('Failed to cache permissions in sessionStorage:', error);
          }
        }
        
        setUser(userData);
      } catch (error) {
        console.error('usePermissions: Failed to fetch permissions:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchPermissions();
    }
  }, [user]);

  const hasRole = (role: UserRole) => {
    return user ? PermissionsService.hasRole(user, role) : false;
  };

  const hasPermission = (resource: string, action: string) => {
    return user ? PermissionsService.hasPermission(user, resource, action) : false;
  };

  const canAccess = (resource: string, action: string = 'read') => {
    return user ? PermissionsService.canAccess(user, resource, action) : false;
  };

  const refreshPermissions = async () => {
    try {
      setLoading(true);
      
      // Forcer le rafraîchissement en vidant les caches
      memoryCache = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(PERMISSIONS_CACHE_KEY);
      }
      
      const userData = await PermissionsService.getUserPermissions();
      
      // Remettre en cache
      const cacheData = {
        data: userData,
        timestamp: Date.now()
      };
      
      memoryCache = cacheData;
      
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(PERMISSIONS_CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
          console.warn('Failed to cache permissions in sessionStorage:', error);
        }
      }
      
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearPermissionsCache = () => {
    // Vider tous les caches de permissions
    memoryCache = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(PERMISSIONS_CACHE_KEY);
    }
    setUser(null);
    setLoading(false);
  };

  return {
    user,
    loading,
    hasRole,
    hasPermission,
    canAccess,
    refreshPermissions,
    clearPermissionsCache
  };
}
