"use client";

import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { HealthFacility } from "@/features/health-facilities";

interface HealthFacilitySelectorProps {
  healthFacilities: HealthFacility[];
  selectedFacility: string;
  onFacilityChange: (facilityId: string) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function HealthFacilitySelector({
  healthFacilities,
  selectedFacility,
  onFacilityChange,
  isLoading = false,
  isDisabled = false,
  label = "Établissement de santé",
  placeholder = "Sélectionner un établissement",
  required = false
}: HealthFacilitySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="health_facility_id">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <CustomSelect
        options={healthFacilities.map(facility => ({
          value: facility.id_,
          label: `${facility.name} (${facility.id_})`
        }))}
        value={selectedFacility}
        onChange={(value) => onFacilityChange(value as string)}
        placeholder={placeholder}
        isDisabled={isDisabled || isLoading}
        isLoading={isLoading}
      />
    </div>
  );
}
