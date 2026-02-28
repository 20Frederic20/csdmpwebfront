"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { HealthFacility } from "@/features/health-facilities/types/health-facilities.types";
import { HealthFacilitySelectService } from "@/features/health-facilities/services/health-facility-select.service";

interface HealthFacilitySelectProps {
  value?: string;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  height?: string;
  onlyActive?: boolean;
}

export function HealthFacilitySelect({
  value,
  onChange,
  placeholder = "Sélectionner un établissement de santé",
  disabled = false,
  required = false,
  className = "",
  height = "h-10",
  onlyActive = true,
}: HealthFacilitySelectProps) {
  const [healthFacilities, setHealthFacilities] = useState<HealthFacility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHealthFacilities = async () => {
      try {
        setLoading(true);
        const facilities = onlyActive 
          ? await HealthFacilitySelectService.getActiveHealthFacilities()
          : await HealthFacilitySelectService.getHealthFacilitiesForSelect();
        
        setHealthFacilities(facilities);
      } catch (error) {
        console.error('Error loading health facilities:', error);
        setHealthFacilities([]);
      } finally {
        setLoading(false);
      }
    };

    loadHealthFacilities();
  }, [onlyActive]);

  const options = healthFacilities.map((facility) => ({
    value: facility.id_,
    label: `${facility.name} (${facility.id_.substring(0, 8)}...)`,
  }));

  const handleChange = (selectedValue: string | string[] | null) => {
    const facilityId = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
    onChange(facilityId);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {required && (
        <Label htmlFor="health-facility-select">
          Établissement de santé {required && "*"}
        </Label>
      )}
      <CustomSelect
        id="health-facility-select"
        options={options}
        value={value || ""}
        onChange={handleChange}
        placeholder={placeholder}
        height={height}
        disabled={disabled || loading}
      />
      {loading && (
        <p className="text-sm text-muted-foreground">
          Chargement des établissements...
        </p>
      )}
    </div>
  );
}
