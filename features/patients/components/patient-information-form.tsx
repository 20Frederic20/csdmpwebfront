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
    <div className="space-y-6">
      {/* Identity Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">01. Identité</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="family_name" className="text-[0.6875rem] uppercase tracking-wider">Nom</Label>
            <Input
              id="family_name"
              value={familyName}
              onChange={(e) => onFieldChange('family_name', e.target.value)}
              placeholder="Entrez le nom"
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="given_name" className="text-[0.6875rem] uppercase tracking-wider">Prénom</Label>
            <Input
              id="given_name"
              value={givenName}
              onChange={(e) => onFieldChange('given_name', e.target.value)}
              placeholder="Entrez le prénom"
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_date" className="text-[0.6875rem] uppercase tracking-wider">Date de naissance</Label>
            <Input
              id="birth_date"
              type="date"
              value={birthDate}
              onChange={(e) => onFieldChange('birth_date', e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-[0.6875rem] uppercase tracking-wider">Sexe</Label>
            <CustomSelect
              options={genderOptions}
              value={gender}
              onChange={(value) => onFieldChange('gender', value as "male" | "female" | "other" | "unknown")}
              placeholder="Choisir"
              height="h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-[0.6875rem] uppercase tracking-wider">Localisation</Label>
          <Input
            id="location"
            value={location || ""}
            onChange={(e) => onFieldChange('location', e.target.value || null)}
            placeholder="Entrez la localisation"
            required
            className="h-12"
          />
        </div>
      </div>
    </div>
  );
}
