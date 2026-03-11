"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PatientInsuranceFiltersWrapperProps {
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onSearch: () => void;
  onClearFilters: () => void;
}

export function PatientInsuranceFiltersWrapper({
  filters,
  onFilterChange,
}: PatientInsuranceFiltersWrapperProps) {
  return (
    <>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="search">Rechercher</Label>
        <Input
          id="search"
          placeholder="Rechercher (min. 3 caractères)"
          value={filters.search || ""}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
        {filters.search && filters.search.length < 3 && (
          <p className="text-xs text-gray-500">Minimum 3 caractères requis</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="searchPolicyNumber">Numéro de police</Label>
        <Input
          id="searchPolicyNumber"
          placeholder="Numéro de police (min. 7 caractères)"
          value={filters.policy_number || ""}
          onChange={(e) => onFilterChange("policy_number", e.target.value)}
        />
        {filters.policy_number && filters.policy_number.length < 7 && (
          <p className="text-xs text-gray-500">Minimum 7 caractères requis</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="searchPriority">Priorité</Label>
        <Input
          id="searchPriority"
          placeholder="Priorité (1-10)"
          value={filters.priority || ""}
          onChange={(e) => onFilterChange("priority", e.target.value)}
          type="number"
          min="1"
          max="10"
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
    </>
  );
}
