"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { MedicalSpecialty, HospitalDepartment, CreateHospitalStaffRequest, EmploymentStatus } from "@/features/hospital-staff";
import { 
  getSpecialtyOptions, 
  getDepartmentOptions,
  getEmploymentStatusOptions
} from "@/features/hospital-staff/utils/hospital-staff.utils";

interface StaffInformationFormProps {
  matricule: string;
  yearOfExp: number;
  specialty: MedicalSpecialty;
  department: HospitalDepartment;
  orderNumber?: number | null;
  employmentStatus?: EmploymentStatus;
  onFieldChange: (field: keyof CreateHospitalStaffRequest, value: string | number) => void;
}

export function StaffInformationForm({
  matricule,
  yearOfExp,
  specialty,
  department,
  orderNumber,
  employmentStatus,
  onFieldChange
}: StaffInformationFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="matricule">
          Matricule <span className="text-red-500">*</span>
        </Label>
        <Input
          id="matricule"
          value={matricule}
          onChange={(e) => onFieldChange('matricule', e.target.value)}
          placeholder="Entrez le matricule"
          required
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="year_of_exp">
          Années d'expérience <span className="text-red-500">*</span>
        </Label>
        <Input
          id="year_of_exp"
          type="number"
          min="0"
          max="70"
          value={yearOfExp}
          onChange={(e) => onFieldChange('year_of_exp', parseInt(e.target.value) || 0)}
          placeholder="0"
          required
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialty">
          Spécialité <span className="text-red-500">*</span>
        </Label>
        <CustomSelect
          options={getSpecialtyOptions()}
          value={specialty}
          onChange={(value) => onFieldChange('specialty', value as MedicalSpecialty)}
          placeholder="Sélectionner une spécialité"
          height="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="department">
          Département <span className="text-red-500">*</span>
        </Label>
        <CustomSelect
          options={getDepartmentOptions()}
          value={department}
          onChange={(value) => onFieldChange('department', value as HospitalDepartment)}
          placeholder="Sélectionner un département"
          height="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="order_number">Numéro d'ordre</Label>
        <Input
          id="order_number"
          value={orderNumber || ""}
          onChange={(e) => onFieldChange('order_number', e.target.value ? parseInt(e.target.value) : null as any)}
          placeholder="Entrez le numéro d'ordre"
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="employment_status">Statut emploi</Label>
        <CustomSelect
          options={getEmploymentStatusOptions()}
          value={employmentStatus || ""}
          onChange={(value) => onFieldChange('employment_status', value as EmploymentStatus)}
          placeholder="Sélectionner un statut"
          height="h-10"
        />
      </div>
    </div>
  );
}
