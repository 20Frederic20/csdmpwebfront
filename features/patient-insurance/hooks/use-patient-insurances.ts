import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PatientInsuranceService } from '../services/patient-insurance.service';
import {
    ListPatientInsuranceQueryParams,
    CreatePatientInsuranceRequest
} from '../types/patient-insurance.types';
import { toast } from 'sonner';

export const PATIENT_INSURANCES_KEY = 'patient-insurances';

export function usePatientInsurances(params?: ListPatientInsuranceQueryParams, token?: string) {
    return useQuery({
        queryKey: [PATIENT_INSURANCES_KEY, params],
        queryFn: () => PatientInsuranceService.getPatientInsurances(params),
        placeholderData: (previousData) => previousData,
    });
}

export function usePatientInsurance(id: string, token?: string) {
    return useQuery({
        queryKey: [PATIENT_INSURANCES_KEY, id],
        queryFn: () => PatientInsuranceService.getPatientInsuranceById(id),
        enabled: !!id,
    });
}

export function useCreatePatientInsurance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePatientInsuranceRequest) =>
            PatientInsuranceService.createPatientInsurance(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PATIENT_INSURANCES_KEY] });
            toast.success('Assurance patient créée avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la création de l\'assurance patient');
        }
    });
}

export function useUpdatePatientInsurance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreatePatientInsuranceRequest> }) =>
            PatientInsuranceService.updatePatientInsurance(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [PATIENT_INSURANCES_KEY] });
            // Also invalidate the specific item query
            queryClient.invalidateQueries({ queryKey: [PATIENT_INSURANCES_KEY, data.id_] });
            toast.success('Assurance patient mise à jour avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la mise à jour de l\'assurance patient');
        }
    });
}

export function useDeletePatientInsurance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => PatientInsuranceService.deletePatientInsurance(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PATIENT_INSURANCES_KEY] });
            toast.success('Assurance patient supprimée avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la suppression de l\'assurance patient');
        }
    });
}

export function useRestorePatientInsurance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => PatientInsuranceService.restorePatientInsurance(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PATIENT_INSURANCES_KEY] });
            toast.success('Assurance patient restaurée avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la restauration de l\'assurance patient');
        }
    });
}

export function useTogglePatientInsuranceStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            PatientInsuranceService.togglePatientInsuranceStatus(id, isActive),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [PATIENT_INSURANCES_KEY] });
            queryClient.invalidateQueries({ queryKey: [PATIENT_INSURANCES_KEY, data.id_] });
            toast.success(`Assurance patient ${data.is_active ? 'activée' : 'désactivée'} avec succès`);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors du changement de statut');
        }
    });
}

export function usePermanentlyDeletePatientInsurance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => PatientInsuranceService.permanentlyDeletePatientInsurance(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PATIENT_INSURANCES_KEY] });
            toast.success('Assurance patient supprimée définitivement');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la suppression définitive');
        }
    });
}
