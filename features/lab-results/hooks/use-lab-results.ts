import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LabResultsService } from '../services/lab-results.service';
import { ListLabResultQueryParams, CreateLabResultRequest, LabResult } from '../types/lab-results.types';
import { toast } from 'sonner';

export const LAB_RESULTS_QUERY_KEY = ['lab-results'] as const;

export function useLabResults(params: ListLabResultQueryParams = {}, options?: any) {
    return useQuery({
        queryKey: [...LAB_RESULTS_QUERY_KEY, params],
        queryFn: () => LabResultsService.getLabResults(params),
        ...options
    });
}

export function useLabResult(id: string | undefined) {
    return useQuery({
        queryKey: [...LAB_RESULTS_QUERY_KEY, id],
        queryFn: () => LabResultsService.getLabResultById(id!),
        enabled: !!id,
    });
}

export function useCreateLabResult() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateLabResultRequest) => LabResultsService.createLabResult(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LAB_RESULTS_QUERY_KEY });
            toast.success('Résultat de laboratoire créé avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la création du résultat');
        },
    });
}

export function useUpdateLabResult() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateLabResultRequest> }) =>
            LabResultsService.updateLabResult(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: LAB_RESULTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...LAB_RESULTS_QUERY_KEY, data.id_] });
            toast.success('Résultat de laboratoire mis à jour avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la mise à jour');
        },
    });
}

export function useDeleteLabResult() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => LabResultsService.deleteLabResult(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LAB_RESULTS_QUERY_KEY });
            toast.success('Résultat de laboratoire supprimé avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la suppression');
        },
    });
}

export function useRestoreLabResult() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => LabResultsService.restoreLabResult(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: LAB_RESULTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...LAB_RESULTS_QUERY_KEY, data.id_] });
            toast.success('Résultat de laboratoire restauré avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la restauration');
        },
    });
}

export function usePermanentlyDeleteLabResult() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => LabResultsService.permanentlyDeleteLabResult(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LAB_RESULTS_QUERY_KEY });
            toast.success('Résultat de laboratoire supprimé définitivement');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la suppression définitive');
        },
    });
}

export function useToggleLabResultStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            LabResultsService.toggleLabResultStatus(id, isActive),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: LAB_RESULTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...LAB_RESULTS_QUERY_KEY, data.id_] });
            toast.success(`Résultat de laboratoire ${data.is_active ? 'activé' : 'désactivé'} avec succès`);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors du changement de statut');
        },
    });
}
