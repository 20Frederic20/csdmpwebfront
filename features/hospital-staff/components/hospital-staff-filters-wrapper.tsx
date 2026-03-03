"use client";

import { HospitalStaffFilters } from "./hospital-staff-filters";

interface HospitalStaffFiltersWrapperProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export function HospitalStaffFiltersWrapper({ filters, onFiltersChange, onReset }: HospitalStaffFiltersWrapperProps) {
  return (
    <HospitalStaffFilters
      filters={filters as any}
      onFiltersChange={onFiltersChange}
      onReset={onReset}
      isOpen={true}
      onToggle={() => {}}
    />
  );
}
