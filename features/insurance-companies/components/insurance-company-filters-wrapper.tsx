"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InsuranceCompanyFiltersWrapperProps {
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onSearch: () => void;
  onClearFilters: () => void;
}

export function InsuranceCompanyFiltersWrapper({
  filters,
  onFilterChange,
}: InsuranceCompanyFiltersWrapperProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="searchName">Nom</Label>
        <Input
          id="searchName"
          placeholder="Rechercher par nom..."
          value={filters.name || ""}
          onChange={(e) => onFilterChange("name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="searchInsurerCode">Code assureur</Label>
        <Input
          id="searchInsurerCode"
          placeholder="Rechercher par code..."
          value={filters.insurer_code || ""}
          onChange={(e) => onFilterChange("insurer_code", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="filterActive">Statut</Label>
        <select
          id="filterActive"
          value={filters.is_active === null || filters.is_active === undefined ? "" : filters.is_active.toString()}
          onChange={(e) => {
            const val = e.target.value;
            onFilterChange("is_active", val === "" ? null : val === "true");
          }}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Tous</option>
          <option value="true">Actifs</option>
          <option value="false">Inactifs</option>
        </select>
      </div>
      {/* Empty div for alignment with grid */}
      <div></div>
    </>
  );
}
