"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { UserRole } from "@/features/users/types/user.types";
import { USER_ROLES_LABELS } from "@/features/users/utils/user.utils";

interface UserCreationFormProps {
  userData: {
    given_name?: string;
    family_name?: string;
    health_id?: string;
    password?: string;
  };
  selectedRoles: string[];
  onUserDataChange: (field: string, value: string) => void;
  onRolesChange: (roles: string[]) => void;
}

export function UserCreationForm({
  userData,
  selectedRoles,
  onUserDataChange,
  onRolesChange
}: UserCreationFormProps) {
  const toggleRole = (role: string) => {
    const newRoles = selectedRoles.includes(role)
      ? selectedRoles.filter(r => r !== role)
      : [...selectedRoles, role];
    onRolesChange(newRoles);
  };

  const removeRole = (role: string) => {
    onRolesChange(selectedRoles.filter(r => r !== role));
  };

  // Rôles disponibles pour le personnel hospitalier
  const availableRoles: UserRole[] = [
    'HEALTH_PRO',
    'DOCTOR',
    'NURSE',
    'MIDWIFE',
    'LAB_TECHNICIAN',
    'PHARMACIST',
    'COMMUNITY_AGENT'
  ];

  return (
    <div className="space-y-6">
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
            required
            minLength={6}
            className="h-10"
          />
        </div>
      </div>

      {/* Rôles */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">
          Rôles <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableRoles.map((role) => (
            <div
              key={role}
              className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedRoles.includes(role)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-muted/50'
              }`}
              onClick={() => toggleRole(role)}
            >
              <input
                type="checkbox"
                checked={selectedRoles.includes(role)}
                onChange={() => toggleRole(role)}
                className="sr-only"
              />
              <span className="text-md">{USER_ROLES_LABELS[role]}</span>
            </div>
          ))}
        </div>
        
        {selectedRoles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-md text-muted-foreground">Rôles sélectionnés:</span>
            {selectedRoles.map((role) => (
              <Badge 
                key={role} 
                variant="secondary" 
                className="cursor-pointer"
                onClick={() => removeRole(role)}
              >
                {USER_ROLES_LABELS[role as UserRole] || role}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
