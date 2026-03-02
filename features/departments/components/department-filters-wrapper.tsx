"use client";

import { DepartmentFilterParams } from "@/features/departments/types/departments.types";
import { DepartmentDataTableFilters } from "./department-data-table-filters";

interface DepartmentFiltersWrapperProps {
  filters: DepartmentFilterParams;
  onFiltersChange: (filters: DepartmentFilterParams) => void;
  onReset: () => void;
}

export function DepartmentFiltersWrapper({
  filters,
  onFiltersChange,
  onReset,
}: DepartmentFiltersWrapperProps) {
  return (
    <DepartmentDataTableFilters
      filters={filters}
      onFiltersChange={onFiltersChange}
      onReset={onReset}
    />
  );
}
