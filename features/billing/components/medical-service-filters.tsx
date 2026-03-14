"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceCategory } from "../types/medical-service.types";

interface MedicalServiceFiltersProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
}

export function MedicalServiceFilters({
  filters,
  onFiltersChange,
}: MedicalServiceFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <Input
          placeholder="Rechercher par code ou désignation..."
          value={filters.search || ""}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="max-w-xs"
        />
      </div>
      <div className="w-[200px]">
        <Select
          value={filters.category || "ALL"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              category: value === "ALL" ? undefined : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes les catégories</SelectItem>
            {Object.values(ServiceCategory).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
