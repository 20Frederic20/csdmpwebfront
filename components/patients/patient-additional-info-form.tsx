"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { CitySelector } from "@/components/ui/city-selector";
import { SimplePhoneInput } from "@/components/ui/simple-phone-input";
import { CreatePatientRequest } from "@/features/patients";

interface PatientAdditionalInfoFormProps {
  birthPlace?: string | null;
  residenceCity?: string | null;
  neighborhood?: string | null;
  phoneNumber?: string | null;
  npiNumber?: string | null;
  bloodGroup?: string | null;
  fatherFullName?: string | null;
  motherFullName?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  onFieldChange: (field: keyof CreatePatientRequest, value: string | null) => void;
}

export function PatientAdditionalInfoForm({
  birthPlace,
  residenceCity,
  neighborhood,
  phoneNumber,
  npiNumber,
  bloodGroup,
  fatherFullName,
  motherFullName,
  emergencyContactName,
  emergencyContactPhone,
  onFieldChange
}: PatientAdditionalInfoFormProps) {
  
  const bloodGroupOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <CitySelector
          selectedCity={birthPlace || ""}
          onCityChange={(value) => onFieldChange('birth_place', value)}
          label="Lieu de naissance"
          placeholder="Sélectionner une ville"
          countryCode="BJ"
        />
      </div>
      
      <div className="space-y-2">
        <CitySelector
          selectedCity={residenceCity || ""}
          onCityChange={(value) => onFieldChange('residence_city', value)}
          label="Ville de résidence"
          placeholder="Sélectionner une ville"
          countryCode="BJ"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="neighborhood">Quartier</Label>
        <Input
          id="neighborhood"
          value={neighborhood || ""}
          onChange={(e) => onFieldChange('neighborhood', e.target.value || null)}
          placeholder="Entrez le quartier"
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <SimplePhoneInput
          value={phoneNumber || null}
          onChange={(value) => onFieldChange('phone_number', value)}
          label="Téléphone du patient"
          placeholder="Entrez le numéro de téléphone du patient"
          defaultCountryCode="BJ"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="npi_number">Numéro NPI</Label>
        <Input
          id="npi_number"
          value={npiNumber || ""}
          onChange={(e) => onFieldChange('npi_number', e.target.value || null)}
          placeholder="Entrez le numéro NPI"
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="blood_group">Groupe sanguin</Label>
        <CustomSelect
          options={bloodGroupOptions}
          value={bloodGroup || ""}
          onChange={(value) => onFieldChange('blood_group', value as string || null)}
          placeholder="Sélectionner un groupe sanguin"
          height="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="father_full_name">Nom complet du père</Label>
        <Input
          id="father_full_name"
          value={fatherFullName || ""}
          onChange={(e) => onFieldChange('father_full_name', e.target.value || null)}
          placeholder="Entrez le nom complet du père"
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mother_full_name">Nom complet de la mère</Label>
        <Input
          id="mother_full_name"
          value={motherFullName || ""}
          onChange={(e) => onFieldChange('mother_full_name', e.target.value || null)}
          placeholder="Entrez le nom complet de la mère"
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="emergency_contact_name">Nom du contact d'urgence</Label>
        <Input
          id="emergency_contact_name"
          value={emergencyContactName || ""}
          onChange={(e) => onFieldChange('emergency_contact_name', e.target.value || null)}
          placeholder="Entrez le nom du contact d'urgence"
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <SimplePhoneInput
          value={emergencyContactPhone || null}
          onChange={(value) => onFieldChange('emergency_contact_phone', value)}
          label="Téléphone du contact d'urgence"
          placeholder="Entrez le téléphone du contact d'urgence"
          defaultCountryCode="BJ"
        />
      </div>
    </div>
  );
}
