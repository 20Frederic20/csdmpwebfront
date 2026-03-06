"use client";

import { UserSelector } from "@/components/ui/user-selector";

interface PatientOwnerSelectorProps {
  users: any[];
  selectedOwner: string;
  onOwnerChange: (value: string) => void;
  isLoading: boolean;
  required?: boolean;
  label?: string;
  placeholder?: string;
  showSelector?: boolean; // Nouvelle prop pour contrôler l'affichage
}

export function PatientOwnerSelector({
  users,
  selectedOwner,
  onOwnerChange,
  isLoading,
  required = false,
  label = "Propriétaire du patient",
  placeholder = "Sélectionner un propriétaire",
  showSelector = true // Par défaut, affiche le sélecteur
}: PatientOwnerSelectorProps) {
  // Si showSelector est false, ne rien afficher
  if (!showSelector) {
    return null;
  }

  return (
    <UserSelector
      users={users}
      selectedUser={selectedOwner}
      onUserChange={onOwnerChange}
      isLoading={isLoading}
      required={required}
      label={label}
      placeholder={placeholder}
    />
  );
}
