import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MedicalServiceService } from '../services/medical-service.service';
import {
  CreateMedicalServiceDTO,
  ListMedicalServicesQueryParams,
  UpdateMedicalServiceDTO,
} from '../types/medical-service.types';

export const MEDICAL_SERVICES_KEY = 'medical-services';

export function useMedicalServices(params?: ListMedicalServicesQueryParams) {
  return useQuery({
    queryKey: [MEDICAL_SERVICES_KEY, params],
    queryFn: () => MedicalServiceService.getMedicalServices(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useMedicalService(id: string) {
  return useQuery({
    queryKey: [MEDICAL_SERVICES_KEY, id],
    queryFn: () => MedicalServiceService.getMedicalServiceById(id),
    enabled: !!id,
  });
}

export function useCreateMedicalService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMedicalServiceDTO) => MedicalServiceService.createMedicalService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDICAL_SERVICES_KEY] });
      toast.success('Service médical créé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la création du service médical');
    },
  });
}

export function useUpdateMedicalService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMedicalServiceDTO }) =>
      MedicalServiceService.updateMedicalService(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [MEDICAL_SERVICES_KEY] });
      queryClient.invalidateQueries({ queryKey: [MEDICAL_SERVICES_KEY, data.id] });
      toast.success('Service médical mis à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du service médical');
    },
  });
}

export function useDeleteMedicalService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MedicalServiceService.deleteMedicalService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDICAL_SERVICES_KEY] });
      toast.success('Service médical supprimé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la suppression du service médical');
    },
  });
}
