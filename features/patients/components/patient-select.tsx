"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { Patient, usePatients } from "@/features/patients";

interface PatientSelectProps {
  value?: string;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  height?: string;
  onlyActive?: boolean;
}

export function PatientSelect({
  value,
  onChange,
  placeholder = "Sélectionner un patient",
  disabled = false,
  required = false,
  className = "",
  height = "h-10",
  onlyActive = true,
}: PatientSelectProps) {
  const { data: response, isLoading: loading } = usePatients({
    limit: 100,
    search: '',
  });

  const patients = response?.data || [];

  const options = patients.map((patient) => ({
    value: patient.id_,
    label: `${patient.given_name} ${patient.family_name} - ${patient.health_id || patient.id_.substring(0, 8)}`,
  }));

  const handleChange = (selectedValue: string | string[] | null) => {
    const patientId = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
    onChange(patientId);
  };

  return (
    <div className={className}>
      {required && (
        <Label htmlFor="patient-select" className="text-sm font-medium">
          Patient <span className="text-red-500">*</span>
        </Label>
      )}
      <CustomSelect
        options={options}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={disabled}
        isLoading={loading}
        height={height}
      />
    </div>
  );
}
