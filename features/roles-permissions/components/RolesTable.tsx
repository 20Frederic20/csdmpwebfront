'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Shield, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { EnhancedDataTable } from '@/components/ui/enhanced-data-table';
import { Role, Permission } from '../types/roles-permissions.types';
import { useRoles, useDeleteRole, useRemovePermissionFromRole, useAddPermissionToRole, usePermissions } from '../hooks/use-roles-permissions';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export function RolesTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { data: rolesResponse, isLoading } = useRoles({ limit, offset: (page - 1) * limit });
  const roles = rolesResponse?.data || [];
  const totalRoles = rolesResponse?.total || 0;

  const { data: allPermissionsResponse } = usePermissions({ limit: 1000 });
  const allPermissions = allPermissionsResponse?.data || [];
  const { mutate: deleteRole } = useDeleteRole();
  const { mutate: addPermission } = useAddPermissionToRole();
  const { mutate: removePermission } = useRemovePermissionFromRole();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isAddPermissionOpen, setIsAddPermissionOpen] = useState(false);
  const [permissionToAdd, setPermissionToAdd] = useState<string>('');

  const handleAddPermission = () => {
    if (selectedRole && permissionToAdd) {
      const roleId = selectedRole.id_;
      if (!roleId) return;
      
      addPermission({
        role_id: roleId,
        permission_id: permissionToAdd,
      }, {
        onSuccess: () => {
          setIsAddPermissionOpen(false);
          setPermissionToAdd('');
        }
      });
    }
  };

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Nom du Rôle',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-vital-green" />
          <span className="font-bold">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-muted-foreground italic text-sm">
          {row.original.description || 'Aucune description'}
        </span>
      ),
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 max-w-md">
          {row.original.permissions?.length > 0 ? (
            row.original.permissions.map((p) => {
              const permId = p.id_;
              const roleId = row.original.id_;
              return (
                <Badge 
                  key={permId} 
                  variant="secondary" 
                  className="text-[10px] py-0 px-2 bg-muted/50 flex items-center gap-1 group"
                >
                  {p.resource}:{p.action}
                  <button 
                    onClick={() => roleId && permId && removePermission({ roleId, permissionId: permId })}
                    className="hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </Badge>
              );
            })
          ) : (
            <span className="text-xs text-muted-foreground">Aucune permission</span>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => {
                setSelectedRole(row.original);
                setIsAddPermissionOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une permission
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => {
                const roleId = row.original.id_;
                if (roleId && confirm(`Êtes-vous sûr de vouloir supprimer le rôle ${row.original.name} ?`)) {
                  deleteRole(roleId);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Filter permissions not already in the selected role
  const availablePermissions = allPermissions.filter(
    (p) => !selectedRole?.permissions?.some((rp) => (rp.id_) === (p.id_))
  );

  return (
    <>
      <EnhancedDataTable 
        columns={columns} 
        data={roles} 
        loading={isLoading} 
        manualPagination={true}
        total={totalRoles}
        currentPage={page}
        itemsPerPage={limit}
        onPageChange={setPage}
        onItemsPerPageChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />

      <Dialog open={isAddPermissionOpen} onOpenChange={setIsAddPermissionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une permission au rôle {selectedRole?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sélectionner une permission</label>
              <Select value={permissionToAdd} onValueChange={setPermissionToAdd}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une permission..." />
                </SelectTrigger>
                <SelectContent>
                  {availablePermissions.map((p) => {
                    const permId = p.id_;
                    return permId ? (
                      <SelectItem key={permId} value={permId}>
                        {p.resource}:{p.action}
                      </SelectItem>
                    ) : null;
                  })}
                  {availablePermissions.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Aucune permission disponible
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddPermission} disabled={!permissionToAdd} className="w-full">
              Ajouter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
