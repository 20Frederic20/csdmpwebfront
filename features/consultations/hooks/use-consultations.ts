import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ConsultationService } from '../services/consultation.service';
import {
    ConsultationQueryParams,
    CreateConsultationRequest,
    UpdateConsultationRequest,
    CompleteConsultationRequest,
} from '../types/consultations.types';
import { toast } from 'sonner';

export const consultationKeys = {
    all: ['consultations'] as const,
    lists: () => [...consultationKeys.all, 'list'] as const,
    list: (params: ConsultationQueryParams) => [...consultationKeys.lists(), params] as const,
    details: () => [...consultationKeys.all, 'detail'] as const,
    detail: (id: string) => [...consultationKeys.details(), id] as const,
};

// Hook pour récupérer la liste des consultations
export function useConsultations(params: ConsultationQueryParams) {
    return useQuery({
        queryKey: consultationKeys.list(params),
        queryFn: () => ConsultationService.getConsultations(params),
        placeholderData: (previousData) => previousData,
    });
}

// Hook pour récupérer une consultation par ID
export function useConsultation(id: string) {
    return useQuery({
        queryKey: consultationKeys.detail(id),
        queryFn: () => ConsultationService.getConsultationById(id),
        enabled: !!id,
    });
}

// Hook pour créer une consultation
export function useCreateConsultation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateConsultationRequest) =>
            ConsultationService.createConsultation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: consultationKeys.lists() });
            toast.success('Consultation créée avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la création de la consultation');
        },
    });
}

// Hook pour mettre à jour une consultation
export function useUpdateConsultation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateConsultationRequest }) =>
            ConsultationService.updateConsultation(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: consultationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: consultationKeys.detail(data.id_) });
            toast.success('Consultation mise à jour avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la mise à jour de la consultation');
        },
    });
}

// Hook pour compléter une consultation
export function useCompleteConsultation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CompleteConsultationRequest }) =>
            ConsultationService.completeConsultation(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: consultationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: consultationKeys.detail(data.id_) });
            toast.success('Consultation complétée avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la complétion de la consultation');
        },
    });
}

// Hook pour supprimer (soft delete) une consultation
export function useDeleteConsultation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ConsultationService.deleteConsultation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: consultationKeys.lists() });
            toast.success('Consultation supprimée avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la suppression de la consultation');
        },
    });
}

// Hook pour restaurer une consultation
export function useRestoreConsultation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ConsultationService.restoreConsultation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: consultationKeys.lists() });
            toast.success('Consultation restaurée avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la restauration de la consultation');
        },
    });
}

// Hook pour supprimer définitivement une consultation
export function usePermanentlyDeleteConsultation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ConsultationService.permanentlyDeleteConsultation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: consultationKeys.lists() });
            toast.success('Consultation supprimée définitivement');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la suppression définitive');
        },
    });
}

// Hook pour basculer le statut d'une consultation
export function useToggleConsultationStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ConsultationService.toggleConsultationStatus(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: consultationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: consultationKeys.detail(data.id_) });
            toast.success(`Consultation ${data.is_active ? 'activée' : 'désactivée'} avec succès`);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors du changement de statut');
        },
    });
}
