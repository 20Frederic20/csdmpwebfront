"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/custom-select";
import { Label } from "@/components/ui/label";
import { Search, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { DepartmentFilterParams, HospitalDepartment } from "@/features/departments/types/departments.types";

interface DepartmentDataTableFiltersProps {
  filters: DepartmentFilterParams;
  onFiltersChange: (filters: DepartmentFilterParams) => void;
  onReset: () => void;
}

export function DepartmentDataTableFilters({
  filters,
  onFiltersChange,
  onReset,
}: DepartmentDataTableFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleHealthFacilityChange = (value: string) => {
    onFiltersChange({ ...filters, health_facility_id: value });
  };

  const handleCodeChange = (value: string | string[] | null) => {
    const codeValue = value as string;
    onFiltersChange({ 
      ...filters, 
      code: codeValue === '' ? null : (codeValue as HospitalDepartment) || null
    });
  };

  const handleStatusChange = (value: string | string[] | null) => {
    onFiltersChange({ 
      ...filters, 
      is_active: (value as string) === 'true' ? true : (value as string) === 'false' ? false : null
    });
  };

  // Options pour le CustomSelect
  const codeOptions = [
    { value: '', label: 'Tous' },
    { value: HospitalDepartment.EMERGENCY, label: 'Urgences' },
    { value: HospitalDepartment.INTENSIVE_CARE, label: 'Soins intensifs' },
    { value: HospitalDepartment.SURGERY, label: 'Chirurgie' },
    { value: HospitalDepartment.PEDIATRICS, label: 'Pédiatrie' },
    { value: HospitalDepartment.OBSTETRICS_GYNECOLOGY, label: 'Obstétrique-Gynécologie' },
    { value: HospitalDepartment.CARDIOLOGY, label: 'Cardiologie' },
    { value: HospitalDepartment.NEUROLOGY, label: 'Neurologie' },
    { value: HospitalDepartment.ONCOLOGY, label: 'Oncologie' },
    { value: HospitalDepartment.RADIOLOGY, label: 'Radiologie' },
    { value: HospitalDepartment.LABORATORY, label: 'Laboratoire' },
    { value: HospitalDepartment.PHARMACY, label: 'Pharmacie' },
    { value: HospitalDepartment.OUTPATIENT, label: 'Consultations externes' },
    { value: HospitalDepartment.INPATIENT, label: 'Hospitalisation' },
    { value: HospitalDepartment.MATERNITY, label: 'Maternité' },
    { value: HospitalDepartment.NEONATAL, label: 'Néonatalogie' },
    { value: HospitalDepartment.PSYCHIATRY, label: 'Psychiatrie' },
    { value: HospitalDepartment.DENTISTRY, label: 'Dentisterie' },
    { value: HospitalDepartment.OPHTHALMOLOGY, label: 'Ophtalmologie' },
    { value: HospitalDepartment.ORTHOPEDICS, label: 'Orthopédie' },
    { value: HospitalDepartment.DERMATOLOGY, label: 'Dermatologie' },
    { value: HospitalDepartment.INFECTIOUS_DISEASES, label: 'Maladies infectieuses' },
    { value: HospitalDepartment.INTERNAL_MEDICINE, label: 'Médecine interne' },
    { value: HospitalDepartment.ANESTHESIOLOGY, label: 'Anesthésiologie' },
    { value: HospitalDepartment.PATHOLOGY, label: 'Pathologie' },
    { value: HospitalDepartment.NUTRITION, label: 'Nutrition' },
    { value: HospitalDepartment.REHABILITATION, label: 'Rééducation' },
    { value: HospitalDepartment.EMERGENCY_ROOM, label: 'Salle d\'urgence' },
    { value: HospitalDepartment.INTENSIVE_CARE_UNIT, label: 'Unité de soins intensifs' },
    { value: HospitalDepartment.PEDIATRIC_EMERGENCY, label: 'Urgences pédiatriques' },
    { value: HospitalDepartment.SURGICAL_EMERGENCY, label: 'Urgences chirurgicales' },
    { value: HospitalDepartment.OBSTETRIC_EMERGENCY, label: 'Urgences obstétriques' },
  ];

  const statusOptions = [
    { value: '', label: 'Tous' },
    { value: 'true', label: 'Actif' },
    { value: 'false', label: 'Inactif' },
  ];

  // Réinitialisation complète de tous les filtres
  const handleReset = () => {
    onReset();
    // Force un reset complet vers les valeurs par défaut
    onFiltersChange({
      search: "",
      health_facility_id: null,
      code: null,
      is_active: null,
    });
  };

  return (
    <div className="space-y-4">
      {/* Recherche simple */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, ID..."
            value={filters.search || ""}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20">
          {/* Établissement de santé */}
          <div className="space-y-2">
            <Label htmlFor="health_facility">Établissement de santé</Label>
            <Input
              id="health_facility"
              placeholder="ID de l'établissement"
              value={filters.health_facility_id || ""}
              onChange={(e) => handleHealthFacilityChange(e.target.value)}
            />
          </div>

          {/* Code du département */}
          <div className="space-y-2">
            <Label htmlFor="code">Code du département</Label>
            <CustomSelect
              options={codeOptions}
              value={filters.code || ""}
              onChange={handleCodeChange}
              placeholder="Sélectionner le code"
              height="h-10"
            />
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <CustomSelect
              options={statusOptions}
              value={filters.is_active === null ? "" : filters.is_active?.toString() || ""}
              onChange={handleStatusChange}
              placeholder="Sélectionner le statut"
              height="h-10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
