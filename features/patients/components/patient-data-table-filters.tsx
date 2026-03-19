"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/custom-select";
import { Label } from "@/components/ui/label";
import { Search, RotateCcw, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermissionsContext } from "@/contexts/permissions-context";

interface PatientDataTableFiltersProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export function PatientDataTableFilters({
  filters,
  onFiltersChange,
  onReset,
}: PatientDataTableFiltersProps) {
  const { user } = usePermissionsContext();

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleBirthDateChange = (value: string) => {
    onFiltersChange({ ...filters, birth_date_from: value });
  };

  const handleGenderChange = (value: string | string[] | null) => {
    onFiltersChange({ 
      ...filters, 
      genders: (value as string) || 'all'
    });
  };

  const toggleMyPatients = () => {
    if (filters.owner_id) {
      onFiltersChange({ ...filters, owner_id: undefined });
    } else if (user?.id) {
      onFiltersChange({ ...filters, owner_id: user.id });
    }
  };

  // Options pour le CustomSelect
  const genderOptions = [
    { value: 'all', label: 'Tous' },
    { value: 'male', label: 'Masculin' },
    { value: 'female', label: 'Féminin' },
    { value: 'other', label: 'Autre' },
    { value: 'unknown', label: 'Inconnu' },
  ];

  // Réinitialisation complète de tous les filtres
  const handleReset = () => {
    onReset();
    // Force un reset complet vers les valeurs par défaut
    onFiltersChange({
      search: "",
      birth_date_from: "",
      genders: "all",
      owner_id: undefined,
    });
  };

  const isMyPatientsActive = !!filters.owner_id;

  return (
    <div className="space-y-4">
      {/* Recherche simple et actions */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-muted/30 p-4 rounded-xl border border-input shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, prénom, ID..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isMyPatientsActive ? "default" : "outline"}
            onClick={toggleMyPatients}
            className={cn(
              "flex items-center gap-2",
              isMyPatientsActive && "bg-vital-green hover:bg-vital-green/90 text-white border-vital-green"
            )}
          >
            <Users className="h-4 w-4" />
            <span>Mes patients</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </Button>
        </div>
      </div>

      {/* Tous les filtres (affichés en permanence) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-input rounded-xl bg-card shadow-sm">
        {/* Date de naissance */}
        <div className="space-y-3">
          <Label htmlFor="birth_date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date de naissance (à partir de)</Label>
          <Input
            id="birth_date"
            type="date"
            value={filters.birth_date_from}
            onChange={(e) => handleBirthDateChange(e.target.value)}
          />
        </div>

        {/* Sexe */}
        <div className="space-y-3">
          <Label htmlFor="gender" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sexe</Label>
          <CustomSelect
            options={genderOptions}
            value={filters.genders}
            onChange={handleGenderChange}
            placeholder="Sélectionner le sexe"
            height="h-10"
          />
        </div>
      </div>
    </div>
  );
}
