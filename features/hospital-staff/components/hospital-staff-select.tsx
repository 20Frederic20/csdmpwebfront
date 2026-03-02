"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { HospitalStaff, HospitalStaffQueryParams } from "@/features/hospital-staff/types/hospital-staff.types";
import { HospitalStaffService } from "@/features/hospital-staff/services/hospital-staff.service";

interface HospitalStaffSelectProps {
  value?: string;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  height?: string;
  onlyActive?: boolean;
  healthFacilityId?: string | null;
  departmentId?: string | null;
}

export function HospitalStaffSelect({
  value,
  onChange,
  placeholder = "Sélectionner un membre du personnel",
  disabled = false,
  required = false,
  className = "",
  height = "h-10",
  onlyActive = true,
  healthFacilityId = null,
  departmentId = null,
}: HospitalStaffSelectProps) {
  const [staff, setStaff] = useState<HospitalStaff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        setLoading(true);
        const params: HospitalStaffQueryParams = {
          health_facility_id: healthFacilityId || undefined,
          limit: 100,
        };
        
        const response = await HospitalStaffService.getHospitalStaff(params);
        setStaff(response.data);
      } catch (error) {
        console.error('Error loading hospital staff:', error);
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, [onlyActive, healthFacilityId]);

  const options = staff.map((person) => ({
    value: person.id_,
    label: `${person.user_given_name} ${person.user_family_name} - ${person.specialty}`,
  }));

  const handleChange = (selectedValue: string | string[] | null) => {
    const staffId = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
    onChange(staffId);
  };

  return (
    <div className={className}>
      {required && (
        <Label htmlFor="hospital-staff-select" className="text-sm font-medium">
          Membre du personnel <span className="text-red-500">*</span>
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
