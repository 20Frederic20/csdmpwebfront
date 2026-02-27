"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedDataTable } from "@/components/ui/enhanced-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { SortingState } from "@tanstack/react-table";
import { RowSelectionState } from "@tanstack/react-table";

interface DataTableWithFiltersProps<TData, TValue> {
  // Props pour la DataTable
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  error?: string | null;
  total?: number;
  currentPage?: number;
  itemsPerPage?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  meta?: Record<string, any>;
  enableRowSelection?: boolean;
  
  // Props pour les filtres
  title?: string;
  filterComponent: React.ComponentType<FilterComponentProps>;
  initialFilters?: Record<string, any>;
  
  // Callbacks
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onRowSelectionChange?: (selectedRows: RowSelectionState) => void;
  onFiltersChange?: (filters: Record<string, any>) => void;
}

interface FilterComponentProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export function DataTableWithFilters<TData, TValue>({
  columns,
  data,
  loading = false,
  error,
  total,
  currentPage = 1,
  itemsPerPage = 20,
  manualPagination = true,
  manualSorting = true,
  meta,
  enableRowSelection = false,
  title = "Liste",
  filterComponent: FilterComponent,
  initialFilters = {},
  onPageChange,
  onItemsPerPageChange,
  onSortingChange,
  onRowSelectionChange,
  onFiltersChange,
}: DataTableWithFiltersProps<TData, TValue>) {
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
    // Reset to page 1 when filters change
    onPageChange?.(1);
  };

  const handleFiltersReset = () => {
    const resetFilters = Object.keys(initialFilters).reduce((acc, key) => {
      acc[key] = initialFilters[key];
      return acc;
    }, {} as Record<string, any>);
    
    setFilters(resetFilters);
    onFiltersChange?.(resetFilters);
    onPageChange?.(1);
  };

  const handleToggleAdvanced = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleFiltersReset}
          />
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <EnhancedDataTable
            columns={columns}
            data={data}
            loading={loading}
            error={error ?? undefined}
            total={total ?? undefined}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
            onSortingChange={onSortingChange}
            onRowSelectionChange={onRowSelectionChange}
            enableRowSelection={enableRowSelection}
            manualPagination={manualPagination}
            manualSorting={manualSorting}
            meta={meta}
          />
        </CardContent>
      </Card>
    </div>
  );
}
