"use client";

import { AppointmentDataTableFilters } from "./appointment-data-table-filters";

interface AppointmentFiltersWrapperProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export function AppointmentFiltersWrapper({ filters, onFiltersChange, onReset }: AppointmentFiltersWrapperProps) {
  return (
    <AppointmentDataTableFilters
      filters={filters}
      onFiltersChange={onFiltersChange}
      onReset={onReset}
    />
  );
}
