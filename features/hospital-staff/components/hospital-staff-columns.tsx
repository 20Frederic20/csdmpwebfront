"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash2, RotateCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { HospitalStaff } from "@/features/hospital-staff";
import { formatSpecialty } from "@/features/hospital-staff/utils/hospital-staff.utils";
import { 
  ActionConfig,
  DataTableActions
} from "@/components/ui/generic-columns";
import Link from "next/link";

export function getHospitalStaffActions(staff: HospitalStaff, canAccess: (resource: string, action: string) => boolean, meta?: any): ActionConfig[] {
  const actions: ActionConfig[] = [
    {
      label: "Voir",
      icon: <Eye className="h-4 w-4" />,
      href: `/hospital-staff/${staff.id_}`,
    },
  ];

  if (canAccess('hospital_staffs', 'update')) {
    actions.push({
      label: "Modifier",
      icon: <Edit className="h-4 w-4" />,
      href: `/hospital-staff/${staff.id_}/edit`,
    });
  }

  if (canAccess('hospital_staffs', 'soft_delete') && !staff.deleted_at) {
    actions.push(
      { separator: true },
      {
        label: "Supprimer",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => {
          if (meta?.onOpenDeleteModal) {
            meta.onOpenDeleteModal(staff);
          }
        },
        variant: 'destructive',
      }
    );
  }

  if (staff.deleted_at && canAccess('hospital_staffs', 'delete')) {
    actions.push(
      { separator: true },
      {
        label: "Restaurer",
        icon: <RotateCcw className="h-4 w-4" />,
        onClick: () => {
          if (meta?.onStaffRestored) {
            meta.onStaffRestored(staff.id_);
          }
        },
        variant: 'success',
      }
    );
  }

  if (staff.deleted_at && canAccess('hospital_staffs', 'delete')) {
    actions.push(
      {
        label: "Supprimer définitivement",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => {
          if (meta?.onOpenPermanentDeleteModal) {
            meta.onOpenPermanentDeleteModal(staff);
          }
        },
        variant: 'destructive',
      }
    );
  }

  return actions;
}

export const hospitalStaffColumns: ColumnDef<HospitalStaff>[] = [
  // Colonne Nom avec badge de statut
  {
    id: 'name',
    header: 'Personnel',
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="font-medium">
              {staff.user_given_name} {staff.user_family_name}
            </div>
            <div className="text-sm text-muted-foreground">
              Matricule: {staff.matricule}
            </div>
          </div>
          {staff.is_active && (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>
      );
    },
    enableSorting: true,
  },

  // Colonne Spécialité
  {
    id: 'specialty',
    header: 'Spécialité',
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {formatSpecialty(staff.specialty)}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },

  // Colonne Département
  {
    id: 'department_name',
    header: 'Département',
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {staff.department_name}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },

  // Colonne Établissement
  {
    id: 'health_facility_name',
    header: 'Établissement',
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <div className="text-sm">
          {staff.health_facility_name}
        </div>
      );
    },
    enableSorting: true,
  },

  // Colonne Expérience
  {
    id: 'year_of_exp',
    header: 'Expérience',
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <div className="text-sm">
          {staff.year_of_exp} an{staff.year_of_exp > 1 ? 's' : ''}
        </div>
      );
    },
    enableSorting: true,
  },

  // Colonne Statut
  {
    id: 'is_active',
    header: 'Statut',
    cell: ({ row, table }) => {
      const staff = row.original;
      const meta = table.options.meta as any;
      
      return (
        <div className="flex items-center gap-2">
          {/* Indicateur de statut */}
          <div className={`w-2 h-2 rounded-full ${
            staff.deleted_at 
              ? 'bg-gray-500' // Gris pour supprimé
              : staff.is_active 
                ? 'bg-green-500' // Vert pour actif
                : 'bg-red-500'   // Rouge pour inactif
          }`} />
          
          <Switch
            checked={staff.is_active && !staff.deleted_at}
            onCheckedChange={() => {
              if (meta?.onToggleStatus) {
                meta.onToggleStatus(staff.id_);
              }
            }}
            disabled={!meta?.canAccess('hospital_staffs', 'update') || !!staff.deleted_at}
          />
          <span className="text-sm text-muted-foreground">
            {staff.deleted_at 
              ? 'Supprimé' 
              : staff.is_active 
                ? 'Actif' 
                : 'Inactif'
            }
          </span>
        </div>
      );
    },
    enableSorting: true,
  },

  // Colonne Actions
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => {
      const staff = row.original;
      const meta = table.options.meta as any;
      
      return (
        <DataTableActions
          row={staff}
          actions={getHospitalStaffActions(staff, meta?.canAccess || (() => true), meta)}
          canAccess={meta?.canAccess}
          resourceName="hospital-staff"
        />
      );
    },
  },
];
