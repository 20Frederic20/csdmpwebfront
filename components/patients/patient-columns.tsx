"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash2, RotateCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Patient } from "@/features/patients";
import { formatBirthDate, formatGender } from "@/features/patients/utils/patients.utils";
import { 
  createNameColumn, 
  createDateColumn, 
  createStatusColumn, 
  createActionsColumn,
  ActionConfig,
  DataTableActions
} from "@/components/ui/generic-columns";
import Link from "next/link";

export function getPatientActions(patient: Patient, canAccess: (resource: string, action: string) => boolean): ActionConfig[] {
  const actions: ActionConfig[] = [
    {
      label: "Voir",
      icon: <Eye className="h-4 w-4" />,
      href: `/patients/${patient.id_}`,
    },
  ];

  if (canAccess('patients', 'update')) {
    actions.push({
      label: "Modifier",
      icon: <Edit className="h-4 w-4" />,
      href: `/patients/${patient.id_}/edit`,
    });
  }

  if (canAccess('patients', 'soft_delete') && !patient.deleted_at) {
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

  if (patient.deleted_at && canAccess('patients', 'delete')) {
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

export function getPatientName(patient: Patient): string {
  return `${patient.given_name || ''} ${patient.family_name || ''}`.trim();
}

export function getPatientDetailUrl(patient: Patient): string {
  return `/patients/${patient.id_}`;
}

export function getPatientAvatarColor(patient: Patient): string {
  if (patient.deleted_at) return 'bg-gray-100 text-gray-500';
  if (!patient.is_active) return 'bg-gray-100 text-gray-500';
  return 'bg-blue-100 text-blue-700';
}

export function getPatientInitial(patient: Patient): string {
  const name = getPatientName(patient);
  return name.charAt(0).toUpperCase();
}

export const patientColumns: ColumnDef<Patient>[] = [
  // Colonne Nom avec avatar et statut
  createNameColumn(
    getPatientName,
    getPatientDetailUrl,
    {
      showStatus: true,
      statusField: 'is_active',
      getInitial: getPatientInitial,
      getAvatarColor: getPatientAvatarColor,
    }
  ),

  // Colonne Date de naissance
  createDateColumn(
    'birth_date',
    'Date de naissance',
    formatBirthDate
  ),

  // Colonne Sexe
  {
    accessorKey: "gender",
    header: "Sexe",
    cell: ({ row }) => formatGender(row.getValue("gender")),
  },

  // Colonne Localisation
  {
    accessorKey: "location",
    header: "Localisation",
    cell: ({ row }) => row.getValue("location") || '-',
  },

  // Colonne Statut (switch)
  {
    accessorKey: "is_active",
    header: "Statut",
    cell: ({ row, table }) => {
      const patient = row.original;
      
      return (
        <Switch
          checked={patient.is_active}
          onCheckedChange={() => {
            const meta = table.options.meta as any;
            if (meta?.onToggleStatus) {
              meta.onToggleStatus(patient.id_);
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
      const patient = row.original;
      const meta = table.options.meta as any;
      
      return (
        <DataTableActions
          row={row}
          actions={getPatientActions(patient, meta?.canAccess || (() => true))}
          canAccess={meta?.canAccess}
          resourceName="patients"
        />
      );
    },
  },
];
