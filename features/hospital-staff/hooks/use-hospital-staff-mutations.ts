'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HospitalStaffService } from '../services/hospital-staff.service';
import {
    CreateHospitalStaffRequest,
    UpdateHospitalStaffRequest
} from '../types/hospital-staff.types';
import { toast } from 'sonner';

/**
 * Hook regroupant toutes les mutations pour le personnel hospitalier.
 */
export function useHospitalStaffMutations() {
    const queryClient = useQueryClient();

    // Invalider le cache pour forcer un rafraîchissement
    const invalidateStaff = () => {
        queryClient.invalidateQueries({ queryKey: ['hospital-staffs'] });
    };

    // Mutation pour la création
    const createMutation = useMutation({
        mutationFn: (data: CreateHospitalStaffRequest) => HospitalStaffService.createHospitalStaff(data),
        onSuccess: () => {
            invalidateStaff();
            toast.success('Personnel créé avec succès');
        },
        onError: (error: Error) => {
            toast.error(`Erreur lors de la création : ${error.message}`);
        }
    });

    // Mutation pour la mise à jour
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateHospitalStaffRequest }) =>
            HospitalStaffService.updateHospitalStaff(id, data),
        onSuccess: () => {
            invalidateStaff();
            toast.success('Informations mises à jour avec succès');
        },
        onError: (error: Error) => {
            toast.error(`Erreur lors de la mise à jour : ${error.message}`);
        }
    });

    // Mutation pour la suppression (soft delete)
    const deleteMutation = useMutation({
        mutationFn: (id: string) => HospitalStaffService.deleteHospitalStaff(id),
        onSuccess: () => {
            invalidateStaff();
            toast.success('Personnel supprimé avec succès');
        },
        onError: (error: Error) => {
            toast.error(`Erreur lors de la suppression : ${error.message}`);
        }
    });

    // Mutation pour la suppression définitive
    const permanentDeleteMutation = useMutation({
        mutationFn: (id: string) => HospitalStaffService.permanentlyDeleteHospitalStaff(id),
        onSuccess: () => {
            invalidateStaff();
            toast.success('Personnel supprimé définitivement');
        },
        onError: (error: Error) => {
            toast.error(`Erreur lors de la suppression définitive : ${error.message}`);
        }
    });

    // Mutation pour la restauration
    const restoreMutation = useMutation({
        mutationFn: (id: string) => HospitalStaffService.restoreHospitalStaff(id),
        onSuccess: () => {
            invalidateStaff();
            toast.success('Personnel restauré avec succès');
        },
        onError: (error: Error) => {
            toast.error(`Erreur lors de la restauration : ${error.message}`);
        }
    });

    // Mutation pour changer le statut (activé/désactivé)
    const toggleStatusMutation = useMutation({
        mutationFn: (id: string) => HospitalStaffService.toggleHospitalStaffStatus(id),
        onSuccess: (updatedStaff) => {
            invalidateStaff();
            toast.success(`Personnel ${updatedStaff.is_active ? 'activé' : 'désactivé'} avec succès`);
        },
        onError: (error: Error) => {
            toast.error(`Erreur lors du changement de statut : ${error.message}`);
        }
    });

    return {
        createStaff: createMutation.mutateAsync,
        isCreating: createMutation.isPending,

        updateStaff: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,

        deleteStaff: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,

        permanentDeleteStaff: permanentDeleteMutation.mutateAsync,
        isPermanentlyDeleting: permanentDeleteMutation.isPending,

        restoreStaff: restoreMutation.mutateAsync,
        isRestoring: restoreMutation.isPending,

        toggleStatus: toggleStatusMutation.mutateAsync,
        isToggling: toggleStatusMutation.isPending,
    };
}
