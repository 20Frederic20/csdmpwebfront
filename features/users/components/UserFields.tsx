"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserFieldsProps {
  userData: {
    given_name?: string;
    family_name?: string;
    health_id?: string;
    password?: string;
  };
  onUserDataChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export function UserFields({
  userData,
  onUserDataChange,
  disabled = false
}: UserFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="given_name">
          Prénom <span className="text-red-500">*</span>
        </Label>
        <Input
          id="given_name"
          value={userData.given_name || ""}
          onChange={(e) => onUserDataChange('given_name', e.target.value)}
          placeholder="Entrez le prénom"
          required
          disabled={disabled}
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="family_name">
          Nom de famille <span className="text-red-500">*</span>
        </Label>
        <Input
          id="family_name"
          value={userData.family_name || ""}
          onChange={(e) => onUserDataChange('family_name', e.target.value)}
          placeholder="Entrez le nom de famille"
          required
          disabled={disabled}
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="health_id">
          ID Santé <span className="text-red-500">*</span>
        </Label>
        <Input
          id="health_id"
          value={userData.health_id || ""}
          onChange={(e) => onUserDataChange('health_id', e.target.value)}
          placeholder="Entrez l'ID santé"
          required
          disabled={disabled}
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">
          Mot de passe <span className="text-red-500">*</span>
        </Label>
        <Input
          id="password"
          type="password"
          value={userData.password || ""}
          onChange={(e) => onUserDataChange('password', e.target.value)}
          placeholder="Entrez le mot de passe"
          required={!disabled}
          disabled={disabled}
          minLength={6}
          className="h-10"
        />
      </div>
    </div>
  );
}
