"use client";

import { useRoles } from "../hooks/use-roles-permissions";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";

interface RoleSelectorProps {
  selectedRoleIds: string[]; // UUIDs of selected roles
  onChange: (roleIds: string[]) => void;
  allowedRoles?: string[]; // Names of roles to display for filtering
  excludedRoles?: string[]; // Names of roles to exclude
  label?: string;
  required?: boolean;
}

export function RoleSelector({
  selectedRoleIds,
  onChange,
  allowedRoles,
  excludedRoles,
  label = "Rôles",
  required = true
}: RoleSelectorProps) {
  const { data: rolesResponse, isLoading, error } = useRoles({ limit: 100 });
  const allRoles = rolesResponse?.data || [];

  // Filter roles: priority to allowedRoles if provided, then remove excludedRoles
  let availableRoles = allRoles;
  
  if (allowedRoles) {
    availableRoles = availableRoles.filter(role => allowedRoles.includes(role.name));
  }
  
  if (excludedRoles) {
    availableRoles = availableRoles.filter(role => !excludedRoles.includes(role.name));
  }

  const toggleRole = (roleId: string) => {
    const newRoleIds = selectedRoleIds.includes(roleId)
      ? selectedRoleIds.filter(id => id !== roleId)
      : [...selectedRoleIds, roleId];
    onChange(newRoleIds);
  };

  const removeRole = (roleId: string) => {
    onChange(selectedRoleIds.filter(id => id !== roleId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement des rôles...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 py-4">
        Erreur lors du chargement des rôles.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {availableRoles.length === 0 ? (
        <div className="text-sm text-muted-foreground italic py-2">
          Aucun rôle disponible.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableRoles.map((role) => (
            <div
              key={role.id_}
              className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedRoleIds.includes(role.id_)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-muted/50'
              }`}
              onClick={() => toggleRole(role.id_)}
            >
              <input
                type="checkbox"
                checked={selectedRoleIds.includes(role.id_)}
                readOnly
                className="sr-only"
              />
              <span className="text-md capitalize">{role.name.toLowerCase().replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      )}
      
      {selectedRoleIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-md text-muted-foreground">Rôles sélectionnés:</span>
          {selectedRoleIds.map((roleId) => {
            const role = allRoles.find(r => r.id_ === roleId);
            if (!role) return null;
            
            return (
              <Badge 
                key={roleId} 
                variant="secondary" 
                className="cursor-pointer"
                onClick={() => removeRole(roleId)}
              >
                <span className="capitalize">{role.name.toLowerCase().replace(/_/g, ' ')}</span>
                <X className="h-3 w-3 ml-1" />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

