"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  PrescriptionFilterParams 
} from "@/features/prescriptions/types/prescriptions.types";

interface PrescriptionFiltersProps {
  filters: PrescriptionFilterParams;
  onFiltersChange: (filters: PrescriptionFilterParams) => void;
}

export function PrescriptionFiltersWrapper({ filters, onFiltersChange }: PrescriptionFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PrescriptionFilterParams>(filters);

  const handleSearchChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      search: value || undefined,
    }));
  };

  const handleConsultationChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      consultation_id: value || undefined,
    }));
  };

  const handleActiveChange = (value: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      is_active: value,
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Recherche</Label>
            <Input
              id="search"
              type="text"
              value={localFilters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Rechercher par médicament..."
              className="h-10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consultation_id">Consultation</Label>
            <Input
              id="consultation_id"
              type="text"
              value={localFilters.consultation_id || ""}
              onChange={(e) => handleConsultationChange(e.target.value)}
              placeholder="ID de la consultation"
              className="h-10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="is_active">Statut</Label>
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="is_active"
                checked={localFilters.is_active}
                onChange={(e) => handleActiveChange(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="is_active" className="text-sm">
                Actives uniquement
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button onClick={handleApplyFilters}>
            Appliquer les filtres
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
