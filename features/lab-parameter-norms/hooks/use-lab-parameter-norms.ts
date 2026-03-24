import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LabParameterNormService } from '../services/lab-parameter-norms.service';
import { 
  CreateLabParameterNormRequest, 
  UpdateLabParameterNormRequest, 
  ListLabParameterNormsQueryParams 
} from '../types/lab-parameter-norms.types';
import { toast } from 'sonner';

export const LAB_PARAMETER_NORMS_KEY = 'lab-parameter-norms';

export function useLabParameterNorms(params?: ListLabParameterNormsQueryParams) {
  return useQuery({
    queryKey: [LAB_PARAMETER_NORMS_KEY, params],
    queryFn: () => LabParameterNormService.getAll(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useLabParameterNorm(id: string) {
  return useQuery({
    queryKey: [LAB_PARAMETER_NORMS_KEY, id],
    queryFn: () => LabParameterNormService.getById(id),
    enabled: !!id,
  });
}

export function useCreateLabParameterNorm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLabParameterNormRequest) => LabParameterNormService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LAB_PARAMETER_NORMS_KEY] });
      toast.success('Norme de paramètre créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la création de la norme');
    }
  });
}

export function useUpdateLabParameterNorm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLabParameterNormRequest }) => 
      LabParameterNormService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [LAB_PARAMETER_NORMS_KEY] });
      queryClient.invalidateQueries({ queryKey: [LAB_PARAMETER_NORMS_KEY, data.id] });
      toast.success('Norme de paramètre mise à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour de la norme');
    }
  });
}

export function useDeleteLabParameterNorm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => LabParameterNormService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LAB_PARAMETER_NORMS_KEY] });
      toast.success('Norme de paramètre supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la suppression de la norme');
    }
  });
}
