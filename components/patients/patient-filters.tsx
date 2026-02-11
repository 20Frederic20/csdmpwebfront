'use client';

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import CustomSelect from "@/components/ui/custom-select";

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

export interface PatientFilters {
  search: string;
  birth_date_from: string;
  genders: 'male' | 'female' | 'other' | 'unknown' | 'all';
}

interface PatientFiltersProps {
  filters: PatientFilters;
  onFiltersChange: (filters: PatientFilters) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function PatientFilters({ 
  filters, 
  onFiltersChange, 
  onReset, 
  isOpen, 
  onToggle 
}: PatientFiltersProps) {
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

  const handleFilterChange = (field: keyof PatientFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value || '',
    });
  };

  const hasActiveFilters = !!(
    filters.search || 
    filters.birth_date_from || 
    filters.genders
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
          {/* Filtres sur 5 colonnes */}
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Recherche générale</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, prénom, email..."
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de naissance</label>
              <Input
                type="date"
                value={filters.birth_date_from || ''}
                onChange={(e) => handleFilterChange('birth_date_from', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Genre</label>
              <CustomSelect
                options={[
                  { value: 'all', label: 'Tous les genres' },
                  { value: 'male', label: 'Masculin' },
                  { value: 'female', label: 'Féminin' },
                  { value: 'other', label: 'Autre' },
                  { value: 'unknown', label: 'Inconnu' }
                ]}
                value={filters.genders || 'all'}
                onChange={(value) => handleFilterChange('genders', value as string)}
                placeholder="Tous les genres"
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
                    Recherche: {filters.search}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('search', '')}
                    />
                  </Badge>
                )}
                {filters.birth_date_from && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Date: {filters.birth_date_from}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('birth_date_from', '')}
                    />
                  </Badge>
                )}
                {filters.genders && filters.genders !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Genre: {filters.genders === 'male' ? 'Masculin' : 
                           filters.genders === 'female' ? 'Féminin' : 
                           filters.genders === 'other' ? 'Autre' : 'Inconnu'}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('genders', 'all')}
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
