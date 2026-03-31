import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InsuranceCompaniesService } from '../services/insurance-companies.service';
import {
    ListInsuranceCompanyQueryParams,
    CreateInsuranceCompanyRequest
} from '../types/insurance-companies.types';
import { toast } from 'sonner';

export const INSURANCE_COMPANIES_KEY = 'insurance-companies';

export function useInsuranceCompanies(params?: ListInsuranceCompanyQueryParams) {
    return useQuery({
        queryKey: [INSURANCE_COMPANIES_KEY, params],
        queryFn: () => InsuranceCompaniesService.getInsuranceCompanies(params),
        placeholderData: (previousData) => previousData,
    });
}

export function useInsuranceCompany(id: string) {
    return useQuery({
        queryKey: [INSURANCE_COMPANIES_KEY, id],
        queryFn: () => InsuranceCompaniesService.getInsuranceCompanyById(id),
        enabled: !!id,
    });
}

export function useCreateInsuranceCompany() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateInsuranceCompanyRequest) =>
            InsuranceCompaniesService.createInsuranceCompany(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [INSURANCE_COMPANIES_KEY] });
            toast.success('Compagnie d\'assurance créée avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la création de la compagnie d\'assurance');
        }
    });
}

export function useUpdateInsuranceCompany() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateInsuranceCompanyRequest> }) =>
            InsuranceCompaniesService.updateInsuranceCompany(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [INSURANCE_COMPANIES_KEY] });
            queryClient.invalidateQueries({ queryKey: [INSURANCE_COMPANIES_KEY, data.id_] });
            toast.success('Compagnie d\'assurance mise à jour avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la mise à jour de la compagnie d\'assurance');
        }
    });
}

export function useDeleteInsuranceCompany() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => InsuranceCompaniesService.deleteInsuranceCompany(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [INSURANCE_COMPANIES_KEY] });
            toast.success('Compagnie d\'assurance supprimée avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la suppression');
        }
    });
}

export function useToggleInsuranceCompanyStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            InsuranceCompaniesService.toggleInsuranceCompanyStatus(id, isActive),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [INSURANCE_COMPANIES_KEY] });
            queryClient.invalidateQueries({ queryKey: [INSURANCE_COMPANIES_KEY, data.id_] });
            toast.success(`Compagnie d'assurance ${data.is_active ? 'activée' : 'désactivée'} avec succès`);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors du changement de statut');
        }
    });
}

export function useRestoreInsuranceCompany() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => InsuranceCompaniesService.restoreInsuranceCompany(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [INSURANCE_COMPANIES_KEY] });
            toast.success('Compagnie d\'assurance restaurée avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la restauration');
        }
    });
}

export function usePermanentlyDeleteInsuranceCompany() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => InsuranceCompaniesService.permanentlyDeleteInsuranceCompany(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [INSURANCE_COMPANIES_KEY] });
            toast.success('Compagnie d\'assurance supprimée définitivement');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la suppression définitive');
        }
    });
}
