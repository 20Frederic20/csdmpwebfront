'use client';

import { useQuery } from '@tanstack/react-query';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentFilterParams } from '../types/appointments.types';
import { usePermissionsContext } from '@/contexts/permissions-context';

export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params: AppointmentFilterParams) => [...appointmentKeys.lists(), params] as const,
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
