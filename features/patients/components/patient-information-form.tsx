"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { CreatePatientRequest } from "@/features/patients";

interface PatientInformationFormProps {
  givenName: string;
  familyName: string;
  birthDate: string;
  gender: "male" | "female" | "other" | "unknown";
  location: string | null;
  onFieldChange: (field: keyof CreatePatientRequest, value: string | null) => void;
}

export function PatientInformationForm({
  givenName,
  familyName,
  birthDate,
  gender,
  location,
  onFieldChange
}: PatientInformationFormProps) {
  const genderOptions = [
    { value: "male", label: "Homme" },
    { value: "female", label: "Femme" },
    { value: "other", label: "Autre" },
    { value: "unknown", label: "Inconnu" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="given_name">
          Prénom <span className="text-red-500">*</span>
        </Label>
        <Input
          id="given_name"
          value={givenName}
          onChange={(e) => onFieldChange('given_name', e.target.value)}
          placeholder="Entrez le prénom"
          required
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="family_name">
          Nom <span className="text-red-500">*</span>
        </Label>
        <Input
          id="family_name"
          value={familyName}
          onChange={(e) => onFieldChange('family_name', e.target.value)}
          placeholder="Entrez le nom de famille"
          required
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birth_date">
          Date de naissance <span className="text-red-500">*</span>
        </Label>
        <Input
          id="birth_date"
          type="date"
          value={birthDate}
          onChange={(e) => onFieldChange('birth_date', e.target.value)}
          required
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gender">
          Genre <span className="text-red-500">*</span>
        </Label>
        <CustomSelect
          options={genderOptions}
          value={gender}
          onChange={(value) => onFieldChange('gender', value as "male" | "female" | "other" | "unknown")}
          placeholder="Sélectionner un genre"
          height="h-10"
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="location">
          Localisation <span className="text-red-500">*</span>
        </Label>
        <Input
          id="location"
          value={location || ""}
          onChange={(e) => onFieldChange('location', e.target.value || null)}
          placeholder="Entrez la localisation"
          required
          className="h-10"
        />
      </div>
    </div>
  );
}
