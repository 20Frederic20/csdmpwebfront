import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentFilterParams, AppointmentStatus } from '../types/appointments.types';
import { usePermissionsContext } from '@/contexts/permissions-context';
import { toast } from 'sonner';

export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params: AppointmentFilterParams) => [...appointmentKeys.lists(), params] as const,
  details: () => [...appointmentKeys.all, 'details'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
};

export function useAppointments(params: AppointmentFilterParams) {
  const { user, loading: permissionsLoading } = usePermissionsContext();

  const queryKey = [...appointmentKeys.list(params), user?.health_facility_id];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const finalParams = {
        ...params,
        health_facility_id: user?.health_facility_id || params.health_facility_id || undefined
      };
      return AppointmentService.getAppointments(finalParams);
    },
    enabled: !permissionsLoading,
    placeholderData: (previousData) => previousData,
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      AppointmentService.updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('Statut du rendez-vous mis à jour');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du statut');
    },
  });
}

export function useConfirmAppointmentByPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AppointmentService.confirmAppointmentByPatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('Rendez-vous confirmé par le patient');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la confirmation');
    },
  });
}

// ─── Mutations d'action dédiées ──────────────────────────────────────────────

export function useConfirmAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AppointmentService.confirmAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('Rendez-vous confirmé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la confirmation du rendez-vous');
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AppointmentService.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('Rendez-vous annulé');
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de l'annulation du rendez-vous");
    },
  });
}

export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AppointmentService.completeAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('Rendez-vous terminé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la clôture du rendez-vous');
    },
  });
}
