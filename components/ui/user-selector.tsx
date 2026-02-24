"use client";

import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { User as UserType } from "@/features/users";

interface UserSelectorProps {
  users: UserType[];
  selectedUser: string;
  onUserChange: (userId: string) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  label?: string;
  placeholder?: string;
  required?: boolean;
  filterActive?: boolean;
}

export function UserSelector({
  users,
  selectedUser,
  onUserChange,
  isLoading = false,
  isDisabled = false,
  label = "Utilisateur",
  placeholder = "Sélectionner un utilisateur",
  required = false,
  filterActive = true
}: UserSelectorProps) {
  
  // Filtrer les utilisateurs si nécessaire
  const filteredUsers = filterActive 
    ? users.filter(user => user.is_active)
    : users;

  return (
    <div className="space-y-2">
      <Label htmlFor="user_id">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <CustomSelect
        options={filteredUsers.map(user => ({
          value: user.id_,
          label: `${user.given_name} ${user.family_name} (${user.id_})`
        }))}
        value={selectedUser || ""}
        onChange={(value) => {
          console.log('Selected user:', value);
          onUserChange(value as string);
        }}
        placeholder={placeholder}
        isDisabled={isDisabled || isLoading}
        isLoading={isLoading}
      />
    </div>
  );
}
