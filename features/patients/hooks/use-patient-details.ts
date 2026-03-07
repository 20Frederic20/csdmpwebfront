import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AllergiesService } from '../services/allergies.service';
import { LifestyleService, LifestyleQueryParams } from '../services/lifestyle.service';
import { MedicalHistoryService, MedicalHistoryQueryParams } from '../services/medical-history.service';
import { AllergiesQueryParams, CreateAllergyRequest, UpdateAllergyRequest } from '../types/allergies.types';
import { CreateLifestyleRequest, UpdateLifestyleRequest } from '../types/lifestyle.types';
import { CreateMedicalHistoryRequest, UpdateMedicalHistoryRequest } from '../types/medical-history.types';
import { toast } from 'sonner';
import { PATIENTS_QUERY_KEY } from './use-patients';

// --- Allergies ---

export const ALLERGIES_QUERY_KEY = ['allergies'] as const;

export function usePatientAllergies(params: AllergiesQueryParams) {
    return useQuery({
        queryKey: [...ALLERGIES_QUERY_KEY, params.patient_id, params],
        queryFn: () => AllergiesService.getPatientAllergies(params),
        enabled: !!params.patient_id,
    });
}

export function useCreateAllergy() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data, patientId }: { data: CreateAllergyRequest; patientId: string }) =>
            AllergiesService.createAllergy(data, patientId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [...ALLERGIES_QUERY_KEY, variables.patientId] });
            // Invalider aussi le patient car il peut avoir une liste d'allergies intégrée
            queryClient.invalidateQueries({ queryKey: [...PATIENTS_QUERY_KEY, variables.patientId] });
            toast.success('Allergie ajoutée avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de l'ajout de l'allergie");
        },
    });
}

export function useUpdateAllergy() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAllergyRequest }) =>
            AllergiesService.updateAllergy(id, data),
        onSuccess: (data) => {
            // On n'a pas forcément le patientId dans le retour de l'update,
            // mais on peut invalider toutes les allergies pour être sûr ou utiliser une astuce
            queryClient.invalidateQueries({ queryKey: ALLERGIES_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
            toast.success('Allergie mise à jour');
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la mise à jour de l'allergie");
        },
    });
}

export function useDeleteAllergy() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => AllergiesService.deleteAllergy(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ALLERGIES_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
            toast.success('Allergie supprimée');
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la suppression de l'allergie");
        },
    });
}

// --- Medical History ---

export const MEDICAL_HISTORY_QUERY_KEY = ['medical-history'] as const;

export function usePatientMedicalHistory(params: MedicalHistoryQueryParams) {
    return useQuery({
        queryKey: [...MEDICAL_HISTORY_QUERY_KEY, params.patient_id, params],
        queryFn: () => MedicalHistoryService.getPatientMedicalHistory(params),
        enabled: !!params.patient_id,
    });
}

export function useCreateMedicalHistory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data, patientId }: { data: CreateMedicalHistoryRequest; patientId: string }) =>
            MedicalHistoryService.createMedicalHistory(data, patientId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [...MEDICAL_HISTORY_QUERY_KEY, variables.patientId] });
            queryClient.invalidateQueries({ queryKey: [...PATIENTS_QUERY_KEY, variables.patientId] });
            toast.success('Antécédent ajouté avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de l'ajout de l'antécédent");
        },
    });
}

export function useUpdateMedicalHistory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateMedicalHistoryRequest }) =>
            MedicalHistoryService.updateMedicalHistory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEDICAL_HISTORY_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
            toast.success('Antécédent mis à jour');
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la mise à jour de l'antécédent");
        },
    });
}

export function useDeleteMedicalHistory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => MedicalHistoryService.deleteMedicalHistory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEDICAL_HISTORY_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
            toast.success('Antécédent supprimé');
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la suppression de l'antécédent");
        },
    });
}

// --- Lifestyle ---

export const LIFESTYLE_QUERY_KEY = ['lifestyle'] as const;

export function usePatientLifestyle(params: LifestyleQueryParams) {
    return useQuery({
        queryKey: [...LIFESTYLE_QUERY_KEY, params.patient_id, params],
        queryFn: () => LifestyleService.getPatientLifestyle(params),
        enabled: !!params.patient_id,
    });
}

export function useCreateLifestyle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data, patientId }: { data: CreateLifestyleRequest; patientId: string }) =>
            LifestyleService.createLifestyle(data, patientId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [...LIFESTYLE_QUERY_KEY, variables.patientId] });
            queryClient.invalidateQueries({ queryKey: [...PATIENTS_QUERY_KEY, variables.patientId] });
            toast.success('Style de vie ajouté avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de l'ajout du style de vie");
        },
    });
}

export function useUpdateLifestyle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateLifestyleRequest }) =>
            LifestyleService.updateLifestyle(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LIFESTYLE_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
            toast.success('Style de vie mis à jour');
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la mise à jour du style de vie");
        },
    });
}

export function useDeleteLifestyle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => LifestyleService.deleteLifestyle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LIFESTYLE_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
            toast.success('Style de vie supprimé');
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la suppression du style de vie");
        },
    });
}
