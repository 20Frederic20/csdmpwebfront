import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExamDefinitionService } from '../services/lab-exam-definitions.service';
import {
  ListExamDefinitionsQueryParams,
  CreateExamDefinitionRequest,
  UpdateExamDefinitionRequest,
  ExamDefinition,
  ExamParametersResponse,
} from '../types/lab-exam-definitions.types';
import { toast } from 'sonner';

export const EXAM_DEFINITIONS_QUERY_KEY = ['exam-definitions'] as const;

export function useExamDefinitions(params?: ListExamDefinitionsQueryParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...EXAM_DEFINITIONS_QUERY_KEY, params],
    queryFn: () => ExamDefinitionService.getAll(params),
    placeholderData: (previousData) => previousData,
    enabled: options?.enabled ?? true,
  });
}

export function useExamDefinition(id: string | undefined) {
  return useQuery({
    queryKey: [...EXAM_DEFINITIONS_QUERY_KEY, id],
    queryFn: () => ExamDefinitionService.getById(id!),
    enabled: !!id,
  });
}

/**
 * Helper hook to get the most recent exam definition for a given test_type and health_facility_id.
 * Returns the last element of the list sorted by created_at descending.
 */
export function useActiveExamDefinition(
  testType: string | undefined,
  healthFacilityId: string | undefined
): { definition: ExamDefinition | undefined; isLoading: boolean; isError: boolean } {
  const { data, isLoading, isError } = useExamDefinitions(
    {
      test_type: testType as any,
      health_facility_id: healthFacilityId,
      is_active: true,
    },
    { enabled: !!testType }
  );

  const definition = data?.data
    ? [...data.data]
        .sort((a, b) => {
          if (!a.created_at || !b.created_at) return 0;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        })
        .at(0)
    : undefined;

  return { definition, isLoading, isError };
}

export function useCreateExamDefinition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExamDefinitionRequest) => ExamDefinitionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_DEFINITIONS_QUERY_KEY });
      toast.success("Définition d'examen créée avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la création de la définition");
    },
  });
}

export function useUpdateExamDefinition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExamDefinitionRequest }) =>
      ExamDefinitionService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EXAM_DEFINITIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...EXAM_DEFINITIONS_QUERY_KEY, data.id_] });
      toast.success("Définition d'examen mise à jour avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la mise à jour");
    },
  });
}

export function useDeleteExamDefinition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ExamDefinitionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_DEFINITIONS_QUERY_KEY });
      toast.success("Définition d'examen supprimée avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });
}

export function useExamParameters(
  testType: string | undefined,
  healthFacilityId?: string,
  patientId?: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [...EXAM_DEFINITIONS_QUERY_KEY, 'parameters', testType, healthFacilityId, patientId],
    queryFn: () => ExamDefinitionService.getParameters(testType!, healthFacilityId, patientId),
    enabled: (options?.enabled ?? true) && !!testType,
  });
}
