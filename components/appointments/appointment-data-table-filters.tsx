"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/custom-select";
import { Label } from "@/components/ui/label";
import { Search, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { AppointmentFilterParams, AppointmentStatus, AppointmentType, PaymentMethod } from "@/features/appointments/types/appointments.types";

interface AppointmentDataTableFiltersProps {
  filters: AppointmentFilterParams;
  onFiltersChange: (filters: AppointmentFilterParams) => void;
  onReset: () => void;
}

export function AppointmentDataTableFilters({
  filters,
  onFiltersChange,
  onReset,
}: AppointmentDataTableFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (value: string | string[] | null) => {
    onFiltersChange({ 
      ...filters, 
      status: (value as AppointmentStatus) || null
    });
  };

  const handleTypeChange = (value: string | string[] | null) => {
    onFiltersChange({ 
      ...filters, 
      appointment_type: (value as AppointmentType) || null
    });
  };

  const handlePaymentMethodChange = (value: string | string[] | null) => {
    onFiltersChange({ 
      ...filters, 
      payment_method: (value as PaymentMethod) || null
    });
  };

  const handleDateFromChange = (value: string) => {
    onFiltersChange({ ...filters, scheduled_from: value });
  };

  const handleDateToChange = (value: string) => {
    onFiltersChange({ ...filters, scheduled_to: value });
  };

  // Options pour les CustomSelect
  const statusOptions = [
    { value: '', label: 'Tous' },
    { value: AppointmentStatus.SCHEDULED, label: 'Programmé' },
    { value: AppointmentStatus.CONFIRMED, label: 'Confirmé' },
    { value: AppointmentStatus.IN_PROGRESS, label: 'En cours' },
    { value: AppointmentStatus.COMPLETED, label: 'Terminé' },
    { value: AppointmentStatus.CANCELLED, label: 'Annulé' },
    { value: AppointmentStatus.NO_SHOW, label: 'Non présenté' },
    { value: AppointmentStatus.RESCHEDULED, label: 'Reprogrammé' },
  ];

  const typeOptions = [
    { value: '', label: 'Tous' },
    { value: AppointmentType.ROUTINE_CONSULTATION, label: 'Consultation de routine' },
    { value: AppointmentType.EMERGENCY_CONSULTATION, label: 'Consultation d\'urgence' },
    { value: AppointmentType.FOLLOW_UP, label: 'Suivi' },
    { value: AppointmentType.SPECIALIST_CONSULTATION, label: 'Consultation spécialisée' },
    { value: AppointmentType.SURGERY, label: 'Chirurgie' },
    { value: AppointmentType.IMAGING, label: 'Imagerie' },
    { value: AppointmentType.LABORATORY, label: 'Laboratoire' },
    { value: AppointmentType.VACCINATION, label: 'Vaccination' },
    { value: AppointmentType.PREVENTIVE_CARE, label: 'Soins préventifs' },
  ];

  const paymentMethodOptions = [
    { value: '', label: 'Tous' },
    { value: PaymentMethod.FREE_OF_CHARGE, label: 'Gratuit' },
    { value: PaymentMethod.INSURANCE, label: 'Assurance' },
    { value: PaymentMethod.CASH, label: 'Espèces' },
    { value: PaymentMethod.CREDIT_CARD, label: 'Carte de crédit' },
    { value: PaymentMethod.MOBILE_MONEY, label: 'Mobile money' },
    { value: PaymentMethod.BANK_TRANSFER, label: 'Virement bancaire' },
  ];

  // Réinitialisation complète de tous les filtres
  const handleReset = () => {
    onReset();
    // Force un reset complet vers les valeurs par défaut
    onFiltersChange({
      search: "",
      status: null,
      appointment_type: null,
      payment_method: null,
      scheduled_from: null,
      scheduled_to: null,
    });
  };

  return (
    <div className="space-y-4">
      {/* Recherche simple */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par patient, médecin, raison..."
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
          {/* Statut */}
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <CustomSelect
              options={statusOptions}
              value={filters.status || ""}
              onChange={handleStatusChange}
              placeholder="Sélectionner le statut"
              height="h-10"
            />
          </div>

          {/* Type de rendez-vous */}
          <div className="space-y-2">
            <Label htmlFor="appointment_type">Type de rendez-vous</Label>
            <CustomSelect
              options={typeOptions}
              value={filters.appointment_type || ""}
              onChange={handleTypeChange}
              placeholder="Sélectionner le type"
              height="h-10"
            />
          </div>

          {/* Méthode de paiement */}
          <div className="space-y-2">
            <Label htmlFor="payment_method">Méthode de paiement</Label>
            <CustomSelect
              options={paymentMethodOptions}
              value={filters.payment_method || ""}
              onChange={handlePaymentMethodChange}
              placeholder="Sélectionner la méthode"
              height="h-10"
            />
          </div>

          {/* Date de début */}
          <div className="space-y-2">
            <Label htmlFor="scheduled_from">Date de début</Label>
            <Input
              id="scheduled_from"
              type="date"
              value={filters.scheduled_from || ""}
              onChange={(e) => handleDateFromChange(e.target.value)}
            />
          </div>

          {/* Date de fin */}
          <div className="space-y-2">
            <Label htmlFor="scheduled_to">Date de fin</Label>
            <Input
              id="scheduled_to"
              type="date"
              value={filters.scheduled_to || ""}
              onChange={(e) => handleDateToChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
