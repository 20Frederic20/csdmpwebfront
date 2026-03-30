'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { EnhancedDataTable } from '@/components/ui/enhanced-data-table';
import { Permission } from '../types/roles-permissions.types';
import { usePermissions, useDeletePermission } from '../hooks/use-roles-permissions';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export function PermissionsTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { data: permissionsResponse, isLoading } = usePermissions({ limit, offset: (page - 1) * limit });
  const permissions = permissionsResponse?.data || [];
  const totalPermissions = permissionsResponse?.total || 0;
  const { mutate: deletePermission } = useDeletePermission();

  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: 'resource',
      header: 'Ressource',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-500" />
          <Badge variant="outline" className="font-mono text-xs">
            {row.original.resource}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <Badge className="bg-vital-green/10 text-vital-green border-vital-green/20 uppercase text-[10px]">
          {row.original.action}
        </Badge>
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
              className="text-red-600"
              onClick={() => {
                const permId = row.original.id_;
                if (permId && confirm(`Supprimer la permission ${row.original.resource}:${row.original.action} ?`)) {
                  deletePermission(permId);
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

  return (
    <EnhancedDataTable 
      columns={columns} 
      data={permissions} 
      loading={isLoading} 
      manualPagination={true}
      total={totalPermissions}
      currentPage={page}
      itemsPerPage={limit}
      onPageChange={setPage}
      onItemsPerPageChange={(newLimit) => {
        setLimit(newLimit);
        setPage(1);
      }}
    />
  );
}
