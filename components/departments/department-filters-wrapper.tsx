"use client";

import { DepartmentDataTableFilters } from "./department-data-table-filters";

interface DepartmentFiltersWrapperProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export function DepartmentFiltersWrapper({ filters, onFiltersChange, onReset }: DepartmentFiltersWrapperProps) {
  return (
    <DepartmentDataTableFilters
      filters={filters}
      onFiltersChange={onFiltersChange}
      onReset={onReset}
    />
  );
}
