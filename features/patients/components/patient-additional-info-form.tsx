"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CitySelector } from "@/components/ui/city-selector";
import { SimplePhoneInput } from "@/components/ui/simple-phone-input";
import { CreatePatientRequest } from "@/features/patients";
import { cn } from "@/lib/utils";

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

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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
  return (
    <div className="space-y-6">
      {/* Contact Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">02. Contact</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="residence_city" className="text-[0.6875rem] uppercase tracking-wider">Ville de résidence</Label>
            <CitySelector
              selectedCity={residenceCity || ""}
              onCityChange={(value) => onFieldChange('residence_city', value)}
              placeholder="Ex: Cotonou"
              countryCode="BJ"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood" className="text-[0.6875rem] uppercase tracking-wider">Quartier</Label>
            <Input
              id="neighborhood"
              value={neighborhood || ""}
              onChange={(e) => onFieldChange('neighborhood', e.target.value || null)}
              placeholder="Entrez le quartier"
              className="h-12"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <SimplePhoneInput
              value={phoneNumber || null}
              onChange={(value) => onFieldChange('phone_number', value)}
              label="Téléphone du patient"
              placeholder="+229 00 00 00 00"
              defaultCountryCode="BJ"
            />
          </div>
        </div>
      </div>

      {/* Health Information Section */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">03. Informations de santé</span>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="blood_group" className="text-[0.6875rem] uppercase tracking-wider">Groupe Sanguin</Label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {bloodGroups.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => onFieldChange('blood_group', bg)}
                  className={cn(
                    "h-10 border rounded-lg text-sm font-medium transition-all active:scale-95",
                    bloodGroup === bg
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:bg-primary/10 hover:border-primary"
                  )}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birth_place" className="text-[0.6875rem] uppercase tracking-wider">Lieu de naissance</Label>
              <CitySelector
                selectedCity={birthPlace || ""}
                onCityChange={(value) => onFieldChange('birth_place', value)}
                placeholder="Sélectionner une ville"
                countryCode="BJ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="npi_number" className="text-[0.6875rem] uppercase tracking-wider">Numéro NPI</Label>
              <Input
                id="npi_number"
                value={npiNumber || ""}
                onChange={(e) => onFieldChange('npi_number', e.target.value || null)}
                placeholder="Entrez le numéro NPI"
                className="h-12"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-destructive">04. Contact d'urgence</span>
        </div>
        <div className="bg-destructive/5 rounded-xl p-4 space-y-4 border border-destructive/10">
          <div className="space-y-2">
            <Label htmlFor="emergency_contact_name" className="text-[0.6875rem] uppercase tracking-wider">Nom du contact</Label>
            <Input
              id="emergency_contact_name"
              value={emergencyContactName || ""}
              onChange={(e) => onFieldChange('emergency_contact_name', e.target.value || null)}
              placeholder="Nom complet"
              className="h-12 bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <SimplePhoneInput
              value={emergencyContactPhone || null}
              onChange={(value) => onFieldChange('emergency_contact_phone', value)}
              label="Téléphone d'urgence"
              placeholder="+229 00 00 00 00"
              defaultCountryCode="BJ"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
