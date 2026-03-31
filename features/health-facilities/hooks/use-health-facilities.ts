import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HealthFacilityService } from '../services/health-facility.service';
import {
    HealthFacility,
    HealthFacilityQueryParams,
    CreateHealthFacilityRequest,
    UpdateHealthFacilityRequest
} from '../types/health-facility.types';
import { toast } from 'sonner';

export const healthFacilitiesKeys = {
    all: ['health-facilities'] as const,
    lists: () => [...healthFacilitiesKeys.all, 'list'] as const,
    list: (params: HealthFacilityQueryParams) => [...healthFacilitiesKeys.lists(), params] as const,
    details: () => [...healthFacilitiesKeys.all, 'detail'] as const,
    detail: (id: string) => [...healthFacilitiesKeys.details(), id] as const,
};

export function useHealthFacilities(params: HealthFacilityQueryParams) {
    return useQuery({
        queryKey: healthFacilitiesKeys.list(params),
        queryFn: () => HealthFacilityService.getHealthFacilities(params),
    });
}

export function useHealthFacility(id: string) {
    return useQuery({
        queryKey: healthFacilitiesKeys.detail(id),
        queryFn: () => HealthFacilityService.getHealthFacilityById(id),
        enabled: !!id,
    });
}

export function useCreateHealthFacility() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateHealthFacilityRequest) =>
            HealthFacilityService.createHealthFacility(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthFacilitiesKeys.lists() });
            toast.success('Établissement créé avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la création de l'établissement");
        }
    });
}

export function useUpdateHealthFacility() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateHealthFacilityRequest }) =>
            HealthFacilityService.updateHealthFacility(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: healthFacilitiesKeys.lists() });
            queryClient.invalidateQueries({ queryKey: healthFacilitiesKeys.detail(data.id_) });
            toast.success('Établissement mis à jour avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la mise à jour");
        }
    });
}

export function useDeleteHealthFacility() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            HealthFacilityService.deleteHealthFacility(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthFacilitiesKeys.lists() });
            toast.success('Établissement supprimé avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la suppression");
        }
    });
}

export function useRestoreHealthFacility() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            HealthFacilityService.restoreHealthFacility(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: healthFacilitiesKeys.lists() });
            queryClient.invalidateQueries({ queryKey: healthFacilitiesKeys.detail(data.id_) });
            toast.success('Établissement restauré avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la restauration");
        }
    });
}

export function useToggleHealthFacilityStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            HealthFacilityService.toggleHealthFacilityStatus(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: healthFacilitiesKeys.lists() });
            queryClient.invalidateQueries({ queryKey: healthFacilitiesKeys.detail(data.id_) });
            toast.success(`Établissement ${data.is_active ? 'activé' : 'désactivé'} avec succès`);
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors du changement de statut");
        }
    });
}
