"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface InsuranceCompanyFiltersWrapperProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export function InsuranceCompanyFiltersWrapper({
  filters,
  onFiltersChange,
  onReset,
}: InsuranceCompanyFiltersWrapperProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onReset();
    onFiltersChange({
      name: "",
      insurer_code: "",
      is_active: null,
    });
  };

  return (
    <div className="flex flex-wrap items-end gap-4 bg-card p-4 rounded-lg border shadow-sm">
      <div className="space-y-2 flex-1 min-w-[200px]">
        <Label htmlFor="searchName">Nom</Label>
        <Input
          id="searchName"
          placeholder="Rechercher par nom..."
          value={filters.name || ""}
          onChange={(e) => handleFilterChange("name", e.target.value)}
        />
      </div>
      <div className="space-y-2 flex-1 min-w-[150px]">
        <Label htmlFor="searchInsurerCode">Code assureur</Label>
        <Input
          id="searchInsurerCode"
          placeholder="Rechercher par code..."
          value={filters.insurer_code || ""}
          onChange={(e) => handleFilterChange("insurer_code", e.target.value)}
        />
      </div>
      <div className="space-y-2 w-[150px]">
        <Label htmlFor="filterActive">Statut</Label>
        <select
          id="filterActive"
          value={filters.is_active === null || filters.is_active === undefined ? "" : filters.is_active.toString()}
          onChange={(e) => {
            const val = e.target.value;
            handleFilterChange("is_active", val === "" ? null : val === "true");
          }}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Tous</option>
          <option value="true">Actifs</option>
          <option value="false">Inactifs</option>
        </select>
      </div>
      <Button
        variant="outline"
        onClick={handleReset}
        className="flex items-center gap-2 h-10 border-dashed hover:border-solid transition-all"
        type="button"
      >
        <RotateCcw className="h-4 w-4" />
        Réinitialiser
      </Button>
    </div>
  );
}
