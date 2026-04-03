'use client';

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Building2 } from "lucide-react";
import {
  getSpecialtyOptions,
  getEmploymentStatusOptions,
  MedicalSpecialty,
  EmploymentStatus
} from "@/features/hospital-staff";
import CustomSelect from "@/components/ui/custom-select";
import { DepartmentSelect } from "@/features/departments/components/department-select";
import { usePermissionsContext } from "@/contexts/permissions-context";

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
  specialty: MedicalSpecialty | "";
  department_id: string;
  employment_status: EmploymentStatus | "";
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
  const { user, loading: permissionsLoading } = usePermissionsContext();
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  // Supprimer l'état local des départements et utiliser une fonction de recherche
  // pour éviter le double chargement avec DepartmentSelect

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
    filters.department_id ||
    filters.employment_status
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
          {/* Filtres sur 6 colonnes pour un meilleur espacement */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Recherche générale</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Nom, prénom, matricule..."
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
              {permissionsLoading ? (
                <div className="h-10 w-full animate-pulse bg-muted rounded-md" />
              ) : (
                <DepartmentSelect
                  value={filters.department_id}
                  onChange={(value) => handleFilterChange('department_id', value || '')}
                  placeholder="Tous les départements"
                  height="h-10"
                  onlyActive={true}
                  healthFacilityId={user?.health_facility_id || null}
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut emploi</label>
              <CustomSelect
                options={[
                  { value: '', label: 'Tous les statuts' },
                  ...getEmploymentStatusOptions()
                ]}
                value={filters.employment_status || ''}
                onChange={(value) => handleFilterChange('employment_status', value as string)}
                placeholder="Tous les statuts"
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
                {filters.department_id && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    Département: {filters.department_id}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange('department_id', '')}
                    />
                  </Badge>
                )}
                {filters.employment_status && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Statut: {getEmploymentStatusOptions().find(opt => opt.value === filters.employment_status)?.label || filters.employment_status}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange('employment_status', '')}
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
