"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/custom-select";
import { Label } from "@/components/ui/label";
import { Search, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

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
      <div className="flex items-center space-x-3 bg-slate-50/50 p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher par nom, prénom, ID..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-white border-slate-200 focus:border-vital-green/50 focus:ring-vital-green/20 text-slate-900"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2 border-slate-200 hover:bg-slate-100 text-slate-600"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 transition-colors ${showAdvanced ? 'text-vital-green bg-vital-green/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <span className="hidden sm:inline">Filtres avancés</span>
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-slate-200 rounded-xl bg-white shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Date de naissance */}
          <div className="space-y-3">
            <Label htmlFor="birth_date" className="text-xs font-bold uppercase tracking-wider text-slate-500">Date de naissance (à partir de)</Label>
            <Input
              id="birth_date"
              type="date"
              value={filters.birth_date_from}
              onChange={(e) => handleBirthDateChange(e.target.value)}
              className="bg-white border-slate-200 focus:border-vital-green/50"
            />
          </div>

          {/* Sexe */}
          <div className="space-y-3">
            <Label htmlFor="gender" className="text-xs font-bold uppercase tracking-wider text-slate-500">Sexe</Label>
            <CustomSelect
              options={genderOptions}
              value={filters.genders}
              onChange={handleGenderChange}
              placeholder="Sélectionner le sexe"
              height="h-10"
              className="bg-white border-slate-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}
