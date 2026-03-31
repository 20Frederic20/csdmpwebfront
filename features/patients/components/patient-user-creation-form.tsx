"use client";

import { UserFields } from "@/features/users/components/UserFields";
import { RoleSelector } from "@/features/roles-permissions/components/RoleSelector";

interface PatientUserCreationFormProps {
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

export function PatientUserCreationForm({
  userData,
  selectedRoleIds,
  onUserDataChange,
  onRolesChange
}: PatientUserCreationFormProps) {
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
          allowedRoles={['PATIENT', 'USER']}
          label="Rôles du patient"
        />
      </div>
    </div>
  );
}


