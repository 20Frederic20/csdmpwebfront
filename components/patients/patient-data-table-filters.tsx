"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/custom-select";
import { Label } from "@/components/ui/label";
import { Search, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

interface PatientDataTableFiltersProps {
  filters: {
    search: string;
    birth_date_from: string;
    genders: 'male' | 'female' | 'other' | 'unknown' | 'all';
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
}

export function PatientDataTableFilters({
  filters,
  onFiltersChange,
  onReset,
}: PatientDataTableFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    });
  };

  return (
    <div className="space-y-4">
      {/* Recherche simple */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, prénom, ID..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Réinitialiser
        </Button>
        <Button
          variant="ghost"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          Filtres avancés
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20">
          {/* Date de naissance */}
          <div className="space-y-2">
            <Label htmlFor="birth_date">Date de naissance (à partir de)</Label>
            <Input
              id="birth_date"
              type="date"
              value={filters.birth_date_from}
              onChange={(e) => handleBirthDateChange(e.target.value)}
            />
          </div>

          {/* Sexe */}
          <div className="space-y-2">
            <Label htmlFor="gender">Sexe</Label>
            <CustomSelect
              options={genderOptions}
              value={filters.genders}
              onChange={handleGenderChange}
              placeholder="Sélectionner le sexe"
              height="h-10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
