"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash2, RotateCcw, AlertTriangle, Building2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PatientInsurance } from "@/features/patient-insurance/types/patient-insurance.types";
import { 
  createNameColumn, 
  ActionConfig,
  DataTableActions
} from "@/components/ui/generic-columns";

export function getPatientInsuranceActions(patientInsurance: PatientInsurance, canAccess: (resource: string, action: string) => boolean): ActionConfig[] {
  const actions: ActionConfig[] = [];

  if (canAccess('patient_insurances', 'read')) {
    actions.push({
      label: "Voir",
      icon: <Eye className="h-4 w-4" />,
      onClick: (meta) => meta?.onView?.(patientInsurance),
    });
  }

  if (canAccess('patient_insurances', 'update') && !patientInsurance.deleted_at) {
    actions.push({
      label: "Modifier",
      icon: <Edit className="h-4 w-4" />,
      onClick: (meta) => meta?.onEdit?.(patientInsurance),
    });
  }

  if (canAccess('patient_insurances', 'soft_delete') && !patientInsurance.deleted_at) {
    actions.push(
      { separator: true },
      {
        label: "Supprimer",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: (meta) => meta?.onDelete?.(patientInsurance),
        variant: 'destructive',
      }
    );
  }

  if (patientInsurance.deleted_at && canAccess('patient_insurances', 'delete')) {
    actions.push(
      { separator: true },
      {
        label: "Restaurer",
        icon: <RotateCcw className="h-4 w-4" />,
        onClick: (meta) => meta?.onRestore?.(patientInsurance.id_),
        variant: 'success',
      }
    );
  }

  if (patientInsurance.deleted_at && canAccess('patient_insurances', 'delete')) {
    actions.push(
      { separator: true },
      {
        label: "Supprimer définitivement",
        icon: <AlertTriangle className="h-4 w-4" />,
        onClick: (meta) => meta?.onPermanentlyDelete?.(patientInsurance.id_),
        variant: 'destructive',
      }
    );
  }

  return actions;
}

export function getPatientInsuranceName(patientInsurance: PatientInsurance): string {
  return patientInsurance.patient_full_name || 'Nom inconnu';
}

export function getPatientInsuranceAvatarColor(patientInsurance: PatientInsurance): string {
  if (patientInsurance.deleted_at) return 'bg-gray-100 text-gray-500';
  if (!patientInsurance.is_active) return 'bg-gray-100 text-gray-500';
  return 'bg-blue-100 text-blue-700';
}

export function getPatientInsuranceInitial(patientInsurance: PatientInsurance): string {
  const name = getPatientInsuranceName(patientInsurance);
  return name.charAt(0).toUpperCase();
}

export const patientInsuranceColumns: ColumnDef<PatientInsurance>[] = [
  createNameColumn(
    getPatientInsuranceName,
    undefined, // No href, handled by modal
    {
      showStatus: true,
      statusField: 'is_active',
      getInitial: getPatientInsuranceInitial,
      getAvatarColor: getPatientInsuranceAvatarColor,
    }
  ),

  {
    accessorKey: "insurance_name",
    header: "Assurance",
    cell: ({ row }) => {
      const patientInsurance = row.original;
      return (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <div>
            <div className="font-medium">{patientInsurance.insurance_name || 'Assurance inconnue'}</div>
            <div className="text-sm text-gray-600">{patientInsurance.insurance_id}</div>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "policy_number",
    header: "Police",
    cell: ({ row }) => {
      const patientInsurance = row.original;
      return <span className="font-mono text-sm">{patientInsurance.policy_number}</span>;
    },
  },

  {
    accessorKey: "priority",
    header: "Priorité",
    cell: ({ row }) => {
      const patientInsurance = row.original;
      return (
        <Badge variant={patientInsurance.priority <= 3 ? "default" : "secondary"}>
          {patientInsurance.priority}
        </Badge>
      );
    },
  },

  {
    accessorKey: "is_active",
    header: "Statut",
    cell: ({ row, table }) => {
      const patientInsurance = row.original;
      const meta = table.options.meta as any;
      const canAccess = meta?.canAccess || (() => false);
      
      return (
        <Switch
          checked={patientInsurance.is_active && !patientInsurance.deleted_at}
          onCheckedChange={() => {
            if (meta?.onToggleStatus) {
              meta.onToggleStatus(patientInsurance);
            }
          }}
          disabled={!!patientInsurance.deleted_at || !canAccess('patient_insurances', 'update')}
          className="data-[state=checked]:bg-green-500"
        />
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const patientInsurance = row.original;
      const meta = table.options.meta as any;
      
      return (
        <DataTableActions
          row={row}
          actions={getPatientInsuranceActions(patientInsurance, meta?.canAccess || (() => true))}
          canAccess={meta?.canAccess}
          resourceName="patient_insurances"
        />
      );
    },
  },
];
