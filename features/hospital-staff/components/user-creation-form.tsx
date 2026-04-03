"use client";

import { UserFields } from "@/features/users/components/UserFields";
import { RoleSelector } from "@/features/roles-permissions/components/RoleSelector";

interface UserCreationFormProps {
  userData: {
    given_name?: string;
    family_name?: string;
    health_id?: string;
    password?: string;
  };
  selectedRoleIds: string[]; // UUIDs
  onUserDataChange: (field: string, value: string) => void;
  onRolesChange: (roleIds: string[]) => void;
}

export function UserCreationForm({
  userData,
  selectedRoleIds,
  onUserDataChange,
  onRolesChange
}: UserCreationFormProps) {
  // Rôles à exclure pour le personnel hospitalier
  const excludedRoles = ['PATIENT', 'SUPER_ADMIN', 'ADMIN'];

  return (
    <div className="space-y-6">
      <UserFields 
        userData={userData} 
        onUserDataChange={onUserDataChange} 
      />

      <div className="pt-4 border-t">
        <RoleSelector
          selectedRoleIds={selectedRoleIds}
          onChange={onRolesChange}
          excludedRoles={excludedRoles}
          label="Rôles du personnel"
        />
      </div>
    </div>
  );
}


