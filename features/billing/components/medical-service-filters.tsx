"use client";

import { Input } from "@/components/ui/input";
import CustomSelect from "@/components/ui/custom-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";
import { ServiceMainCategory, MAIN_CATEGORY_LABELS } from "../types/medical-service.types";

import { Switch } from "@/components/ui/switch";

interface MedicalServiceFiltersProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export function MedicalServiceFilters({
  filters,
  onFiltersChange,
  onReset,
}: MedicalServiceFiltersProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onReset();
    onFiltersChange({
      search: "",
      category: undefined,
      include_deleted: false,
    });
  };

  const categoryOptions = [
    { value: "ALL", label: "Toutes les catégories" },
    ...Object.entries(MAIN_CATEGORY_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  return (
    <div className="flex flex-wrap items-start gap-4 bg-card p-4 rounded-lg border shadow-sm transition-all duration-300">
      <div className="space-y-2 flex-1 min-w-[300px] relative pb-5">
        <Label htmlFor="search" className="text-sm font-medium text-muted-foreground">Rechercher</Label>
        <Input
          id="search"
          placeholder="Rechercher par code ou désignation..."
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="h-10"
        />
      </div>
      <div className="space-y-2 w-[200px] pb-5">
        <Label htmlFor="category" className="text-sm font-medium text-muted-foreground">Catégorie</Label>
        <CustomSelect
          options={categoryOptions}
          value={filters.category || "ALL"}
          onChange={(value) =>
            handleFilterChange("category", value === "ALL" ? undefined : value)
          }
          placeholder="Filtrer par catégorie"
          height="h-10"
        />
      </div>
      <div className="flex items-center space-x-2 pt-10 px-2">
        <Switch
          id="include-deleted"
          checked={filters.include_deleted || false}
          onCheckedChange={(checked) => handleFilterChange("include_deleted", checked)}
        />
        <Label htmlFor="include-deleted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
          Afficher les supprimés
        </Label>
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
