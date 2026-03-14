"use client";

import { Input } from "@/components/ui/input";
import CustomSelect from "@/components/ui/custom-select";
import { ServiceCategory } from "../types/medical-service.types";

interface MedicalServiceFiltersProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
}

export function MedicalServiceFilters({
  filters,
  onFiltersChange,
}: MedicalServiceFiltersProps) {
  const categoryOptions = [
    { value: "ALL", label: "Toutes les catégories" },
    ...Object.values(ServiceCategory).map((cat) => ({
      value: cat,
      label: cat,
    })),
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <Input
          placeholder="Rechercher par code ou désignation..."
          value={filters.search || ""}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="max-w-xs h-10"
        />
      </div>
      <div className="w-[250px]">
        <CustomSelect
          options={categoryOptions}
          value={filters.category || "ALL"}
          onChange={(value) =>
            onFiltersChange({
              ...filters,
              category: value === "ALL" ? undefined : value,
            })
          }
          placeholder="Filtrer par catégorie"
          height="h-10"
        />
      </div>
    </div>
  );
}
