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
  // Rôles disponibles pour le personnel hospitalier
  const staffRoles = [
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
      <UserFields 
        userData={userData} 
        onUserDataChange={onUserDataChange} 
      />

      <div className="pt-4 border-t">
        <RoleSelector
          selectedRoleIds={selectedRoleIds}
          onChange={onRolesChange}
          allowedRoles={staffRoles}
          label="Rôles du personnel"
        />
      </div>
    </div>
  );
}


