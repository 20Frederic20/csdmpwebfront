"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash2, RotateCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Department, HospitalDepartment } from "@/features/departments/types/departments.types";
import { formatDepartmentCode, getDepartmentStatusBadge, getDepartmentInitial, getDepartmentAvatarColor, getDepartmentDetailUrl } from "@/features/departments/utils/departments.utils";
import { 
  createNameColumn, 
  createDateColumn, 
  createStatusColumn, 
  createActionsColumn,
  ActionConfig,
  DataTableActions
} from "@/components/ui/generic-columns";
import Link from "next/link";

export function getDepartmentActions(department: Department, canAccess: (resource: string, action: string) => boolean): ActionConfig[] {
  const actions: ActionConfig[] = [
    {
      label: "Voir",
      icon: <Eye className="h-4 w-4" />,
      href: getDepartmentDetailUrl(department),
    },
  ];

  if (canAccess('departments', 'update')) {
    actions.push({
      label: "Modifier",
      icon: <Edit className="h-4 w-4" />,
      href: `${getDepartmentDetailUrl(department)}/edit`,
    });
  }

  if (canAccess('departments', 'soft_delete') && !department.deleted_at) {
    actions.push(
      { separator: true },
      {
        label: "Supprimer",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => {
          // Sera géré par le meta de la table
        },
        variant: 'destructive',
      }
    );
  }

  if (department.deleted_at && canAccess('departments', 'delete')) {
    actions.push(
      { separator: true },
      {
        label: "Restaurer",
        icon: <RotateCcw className="h-4 w-4" />,
        onClick: () => {
          // TODO: Implement restore functionality
        },
        variant: 'success',
      }
    );
  }

  return actions;
}

export function getDepartmentName(department: Department): string {
  return department.name || '';
}

export function getDepartmentDetailUrlFunction(department: Department): string {
  return `/departments/${department.id_}`;
}

export function getDepartmentAvatarColorFunction(department: Department): string {
  if (department.deleted_at) return 'bg-gray-100 text-gray-500';
  if (!department.is_active) return 'bg-gray-100 text-gray-500';
  return 'bg-blue-100 text-blue-700';
}

export function getDepartmentInitialFunction(department: Department): string {
  const name = getDepartmentName(department);
  return name.charAt(0).toUpperCase();
}

export const departmentColumns: ColumnDef<Department>[] = [
  // Colonne Nom avec avatar et statut
  createNameColumn(
    getDepartmentName,
    getDepartmentDetailUrlFunction,
    {
      showStatus: true,
      statusField: 'is_active',
      getInitial: getDepartmentInitialFunction,
      getAvatarColor: getDepartmentAvatarColorFunction,
    }
  ),

  // Colonne Code
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const department = row.original;
      return (
        <Badge variant="outline">
          {formatDepartmentCode(department.code)}
        </Badge>
      );
    },
  },

  // Colonne Établissement de santé
  {
    accessorKey: "health_facility_id",
    header: "Établissement",
    cell: ({ row }) => {
      const facilityId = row.getValue("health_facility_id") as string;
      return facilityId ? `ID: ${facilityId.substring(0, 8)}` : '-';
    },
  },

  // Colonne Statut (switch)
  {
    accessorKey: "is_active",
    header: "Statut",
    cell: ({ row, table }) => {
      const department = row.original;
      
      return (
        <Switch
          checked={department.is_active}
          onCheckedChange={() => {
            const meta = table.options.meta as any;
            if (meta?.onToggleStatus) {
              meta.onToggleStatus(department.id_);
            }
          }}
          className="data-[state=checked]:bg-green-500"
        />
      );
    },
  },

  // Colonne Actions
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const department = row.original;
      const meta = table.options.meta as any;
      
      return (
        <DataTableActions
          row={row}
          actions={getDepartmentActions(department, meta?.canAccess || (() => true))}
          canAccess={meta?.canAccess}
          resourceName="departments"
        />
      );
    },
  },
];
