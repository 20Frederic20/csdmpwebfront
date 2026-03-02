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
}

export function PatientOwnerSelector({
  users,
  selectedOwner,
  onOwnerChange,
  isLoading,
  required = false,
  label = "Propriétaire du patient",
  placeholder = "Sélectionner un propriétaire"
}: PatientOwnerSelectorProps) {
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
