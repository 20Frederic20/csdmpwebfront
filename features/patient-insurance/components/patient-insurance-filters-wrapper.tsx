"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface PatientInsuranceFiltersWrapperProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export function PatientInsuranceFiltersWrapper({
  filters,
  onFiltersChange,
  onReset,
}: PatientInsuranceFiltersWrapperProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onReset();
    onFiltersChange({
      search: "",
      policy_number: "",
      priority: "",
      is_active: null,
    });
  };

  return (
    <div className="flex flex-wrap items-start gap-4 bg-card p-4 rounded-lg border shadow-sm transition-all duration-300">
      <div className="space-y-2 flex-1 min-w-[200px] relative pb-5">
        <Label htmlFor="search" className="text-sm font-medium text-muted-foreground">Rechercher</Label>
        <Input
          id="search"
          placeholder="Rechercher (min. 3 caractères)"
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="h-10"
        />
        {filters.search && filters.search.length < 3 && (
          <p className="text-[11px] text-orange-500 absolute bottom-0 left-0 transition-all animate-in fade-in slide-in-from-top-1">
            Minimum 3 caractères requis
          </p>
        )}
      </div>
      <div className="space-y-2 flex-1 min-w-[200px] relative pb-5">
        <Label htmlFor="searchPolicyNumber" className="text-sm font-medium text-muted-foreground">Numéro de police</Label>
        <Input
          id="searchPolicyNumber"
          placeholder="Numéro de police (min. 7 caractères)"
          value={filters.policy_number || ""}
          onChange={(e) => handleFilterChange("policy_number", e.target.value)}
          className="h-10"
        />
        {filters.policy_number && filters.policy_number.length < 7 && (
          <p className="text-[11px] text-orange-500 absolute bottom-0 left-0 transition-all animate-in fade-in slide-in-from-top-1">
            Minimum 7 caractères requis
          </p>
        )}
      </div>
      <div className="space-y-2 w-[120px] pb-5">
        <Label htmlFor="searchPriority" className="text-sm font-medium text-muted-foreground">Priorité</Label>
        <Input
          id="searchPriority"
          placeholder="Priorité"
          value={filters.priority || ""}
          onChange={(e) => handleFilterChange("priority", e.target.value)}
          type="number"
          min="1"
          max="10"
          className="h-10"
        />
      </div>
      <div className="space-y-2 w-[150px] pb-5">
        <Label htmlFor="filterActive" className="text-sm font-medium text-muted-foreground">Statut</Label>
        <select
          id="filterActive"
          value={filters.is_active === null || filters.is_active === undefined ? "" : filters.is_active.toString()}
          onChange={(e) => {
            const val = e.target.value;
            handleFilterChange("is_active", val === "" ? null : val === "true");
          }}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        >
          <option value="">Tous</option>
          <option value="true">Actifs</option>
          <option value="false">Inactifs</option>
        </select>
      </div>
      <div className="pt-8">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center justify-center h-10 w-10 p-0 border-dashed hover:border-solid transition-all hover:bg-muted"
          title="Réinitialiser"
          type="button"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
