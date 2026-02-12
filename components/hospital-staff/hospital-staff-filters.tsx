'use client';

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Building2 } from "lucide-react";
import CustomSelect from "@/components/ui/custom-select";
import { 
  getSpecialtyOptions, 
  getDepartmentOptions,
  HospitalStaffSpecialty,
  HospitalStaffDepartment 
} from "@/features/hospital-staff";

// Fonction debounce personnalisée
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export interface HospitalStaffFilters {
  search: string;
  specialty: HospitalStaffSpecialty | "";
  department: HospitalStaffDepartment | "";
}

interface HospitalStaffFiltersProps {
  filters: HospitalStaffFilters;
  onFiltersChange: (filters: HospitalStaffFilters) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function HospitalStaffFilters({ 
  filters, 
  onFiltersChange, 
  onReset, 
  isOpen, 
  onToggle 
}: HospitalStaffFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Synchroniser localSearch avec filters.search quand il change de l'extérieur
  useEffect(() => {
    setLocalSearch(filters.search || '');
  }, [filters.search]);

  // Fonction debounce pour la recherche
  const debouncedSearchChange = useCallback(
    debounce((value: string) => {
      if (value.length >= 3 || value.length === 0) {
        onFiltersChange({
          ...filters,
          search: value,
        });
      }
    }, 500),
    [filters, onFiltersChange]
  );

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    debouncedSearchChange(value);
  };

  const handleFilterChange = (field: keyof HospitalStaffFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value || '',
    });
  };

  const hasActiveFilters = !!(
    filters.search || 
    filters.specialty || 
    filters.department
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres avancés
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggle}
            >
              {isOpen ? 'Masquer' : 'Afficher'} les filtres
            </Button>
          </div>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="space-y-4">
          {/* Filtres sur 4 colonnes */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Recherche générale</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, prénom, matricule..."
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Spécialité</label>
              <CustomSelect
                options={[
                  { value: '', label: 'Toutes les spécialités' },
                  ...getSpecialtyOptions()
                ]}
                value={filters.specialty || ''}
                onChange={(value) => handleFilterChange('specialty', value as string)}
                placeholder="Toutes les spécialités"
                height="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Département</label>
              <CustomSelect
                options={[
                  { value: '', label: 'Tous les départements' },
                  ...getDepartmentOptions()
                ]}
                value={filters.department || ''}
                onChange={(value) => handleFilterChange('department', value as string)}
                placeholder="Tous les départements"
                height="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium invisible">Actions</label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onReset}
                className="text-red-600 hover:text-red-700 w-full h-10"
              >
                <X className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
            </div>
          </div>

          {/* Filtres actifs */}
          {hasActiveFilters && (
            <div className="pt-2 border-t">
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    Recherche: {filters.search}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('search', '')}
                    />
                  </Badge>
                )}
                {filters.specialty && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Spécialité: {getSpecialtyOptions().find(opt => opt.value === filters.specialty)?.label || filters.specialty}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('specialty', '')}
                    />
                  </Badge>
                )}
                {filters.department && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    Département: {getDepartmentOptions().find(opt => opt.value === filters.department)?.label || filters.department}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('department', '')}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
