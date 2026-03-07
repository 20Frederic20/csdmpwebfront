'use client';

import { useQuery } from '@tanstack/react-query';
import { HospitalStaffService } from '../services/hospital-staff.service';
import { HospitalStaffQueryParams } from '../types/hospital-staff.types';
import { usePermissionsContext } from '@/contexts/permissions-context';

/**
 * Hook personnalisé pour récupérer la liste du personnel hospitalier avec TanStack Query.
 * Gère automatiquement :
 * - Le cache (staleTime)
 * - Le filtrage par health_facility_id de l'utilisateur connecté
 * - L'attente du chargement des permissions
 *
 * @param params Paramètres de filtrage et pagination
 * @returns Résultat de useQuery
 */
export function useHospitalStaffs(params: HospitalStaffQueryParams) {
    const { user, loading: permissionsLoading } = usePermissionsContext();

    // Créer une clé de cache unique basée sur les paramètres et l'établissement de l'utilisateur
    const queryKey = ['hospital-staffs', params, user?.health_facility_id];

    return useQuery({
        queryKey,
        queryFn: async () => {
            // Injecter le health_facility_id du user s'il existe, sinon garder celui des params
            const finalParams = {
                ...params,
                health_facility_id: user?.health_facility_id || params.health_facility_id || undefined
            };

            return HospitalStaffService.getHospitalStaff(finalParams);
        },
        // Le hook ne s'exécute que si les permissions ne sont plus en cours de chargement
        enabled: !permissionsLoading,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
