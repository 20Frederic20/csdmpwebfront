"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { Department } from "@/features/departments/types/departments.types";
import { DepartmentService } from "@/features/departments/services/departments.service";
import { formatDepartmentCode } from "@/features/departments/utils/departments.utils";

interface DepartmentSelectProps {
  value?: string;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  height?: string;
  onlyActive?: boolean;
  healthFacilityId?: string | null;
}

export function DepartmentSelect({
  value,
  onChange,
  placeholder = "Sélectionner un département",
  disabled = false,
  required = false,
  className = "",
  height = "h-10",
  onlyActive = true,
  healthFacilityId = null,
}: DepartmentSelectProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoading(true);
        const params = {
          health_facility_id: healthFacilityId || undefined,
          is_active: onlyActive ? true : undefined,
          limit: 100,
        };
        
        const response = await DepartmentService.getDepartments(params);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error loading departments:', error);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, [onlyActive, healthFacilityId]);

  const options = departments.map((department) => ({
    value: department.id_,
    label: `${department.name} - ${formatDepartmentCode(department.code)}`,
  }));

  const handleChange = (selectedValue: string | string[] | null) => {
    const departmentId = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
    onChange(departmentId);
  };

  return (
    <div className={className}>
      {required && (
        <Label htmlFor="department-select" className="text-sm font-medium">
          Département <span className="text-red-500">*</span>
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
