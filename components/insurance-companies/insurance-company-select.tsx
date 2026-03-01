"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { InsuranceCompany } from "@/features/insurance-companies/types/insurance-companies.types";
import { InsuranceCompanySelectService } from "@/features/insurance-companies/services/insurance-company-select.service";

interface InsuranceCompanySelectProps {
  value?: string;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  height?: string;
  onlyActive?: boolean;
}

export function InsuranceCompanySelect({
  value,
  onChange,
  placeholder = "Sélectionner une compagnie d'assurance",
  disabled = false,
  required = false,
  className = "",
  height = "h-10",
  onlyActive = true,
}: InsuranceCompanySelectProps) {
  const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      try {
        setLoading(true);
        const companies = onlyActive 
          ? await InsuranceCompanySelectService.getActiveInsuranceCompanies()
          : await InsuranceCompanySelectService.getInsuranceCompaniesForSelect();
        
        setInsuranceCompanies(companies);
      } catch (error) {
        console.error('Failed to fetch insurance companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsuranceCompanies();
  }, [onlyActive]);

  const options = insuranceCompanies.map(company => ({
    value: company.id_,
    label: `${company.name} (${company.insurer_code})`
  }));

  const handleChange = (value: string | string[] | null) => {
    onChange(value as string | null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {required && (
        <Label htmlFor="insurance-company-select">
          Compagnie d'assurance {required && "*"}
        </Label>
      )}
      <CustomSelect
        options={options}
        value={value || ""}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={disabled || loading}
        height={height}
        className="w-full"
      />
    </div>
  );
}
