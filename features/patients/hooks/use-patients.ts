import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PatientService } from '../services/patients.service';
import { PatientsQueryParams, CreatePatientRequest, UpdatePatientRequest, Patient } from '../types/patients.types';
import { toast } from 'sonner';

export const PATIENTS_QUERY_KEY = ['patients'] as const;

export function usePatients(params: PatientsQueryParams = {}) {
    return useQuery({
        queryKey: [...PATIENTS_QUERY_KEY, params],
        queryFn: () => PatientService.getPatients(params),
    });
}

export function usePatient(id: string | undefined) {
    return useQuery({
        queryKey: [...PATIENTS_QUERY_KEY, id],
        queryFn: () => PatientService.getPatientById(id!),
        enabled: !!id,
    });
}

export function useCreatePatient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePatientRequest) => PatientService.createPatient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
            toast.success('Patient créé avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la création du patient');
        },
    });
}

export function useUpdatePatient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePatientRequest }) =>
            PatientService.updatePatient(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
            // Aussi invalider la query spécifique du patient
            queryClient.invalidateQueries({ queryKey: [...PATIENTS_QUERY_KEY, data.id_] });
            toast.success('Patient modifié avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la modification du patient');
        },
    });
}

export function useDeletePatient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => PatientService.softDeletePatient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
            toast.success('Patient supprimé avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la suppression du patient');
        },
    });
}

export function usePermanentlyDeletePatient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => PatientService.permanentlyDeletePatient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
            toast.success('Patient supprimé définitivement');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la suppression définitive');
        },
    });
}

export function useRestorePatient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => PatientService.restorePatient(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...PATIENTS_QUERY_KEY, data.id_] });
            toast.success('Patient restauré avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la restauration du patient');
        },
    });
}

export function useTogglePatientActivation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => PatientService.togglePatientActivation(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...PATIENTS_QUERY_KEY, data.id_] });
            toast.success('Statut du patient mis à jour');
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la mise à jour du statut");
        },
    });
}
