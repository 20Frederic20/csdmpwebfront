"use client";

import { PatientDataTableFilters } from "./patient-data-table-filters";

interface PatientFiltersWrapperProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export function PatientFiltersWrapper({ filters, onFiltersChange, onReset }: PatientFiltersWrapperProps) {
  return (
    <PatientDataTableFilters
      filters={filters}
      onFiltersChange={onFiltersChange}
      onReset={onReset}
    />
  );
}
