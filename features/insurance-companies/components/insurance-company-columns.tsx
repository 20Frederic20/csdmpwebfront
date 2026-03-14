"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash2, RotateCcw, AlertTriangle, Phone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { InsuranceCompany } from "@/features/insurance-companies/types/insurance-companies.types";
import { 
  createNameColumn, 
  ActionConfig,
  DataTableActions
} from "@/components/ui/generic-columns";

export function getInsuranceCompanyActions(company: InsuranceCompany, meta: any): ActionConfig[] {
  const actions: ActionConfig[] = [];
  const canAccess = meta?.canAccess || (() => false);

  if (canAccess('insurance_companies', 'read')) {
    actions.push({
      label: "Voir",
      icon: <Eye className="h-4 w-4" />,
      href: `/insurance-companies/${company.id_}`,
    });
  }

  if (canAccess('insurance_companies', 'update') && !company.deleted_at) {
    actions.push({
      label: "Modifier",
      icon: <Edit className="h-4 w-4" />,
      href: `/insurance-companies/${company.id_}/edit`,
    });
  }

  if (canAccess('insurance_companies', 'soft_delete') && !company.deleted_at) {
    actions.push(
      { separator: true },
      {
        label: "Supprimer",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => meta?.onDelete?.(company),
        variant: 'destructive',
      }
    );
  }

  if (company.deleted_at && canAccess('insurance_companies', 'delete')) {
    actions.push(
      { separator: true },
      {
        label: "Restaurer",
        icon: <RotateCcw className="h-4 w-4" />,
        onClick: () => meta?.onRestore?.(company.id_),
        variant: 'success',
      }
    );
  }

  if (company.deleted_at && canAccess('insurance_companies', 'delete')) {
    actions.push(
      { separator: true },
      {
        label: "Supprimer définitivement",
        icon: <AlertTriangle className="h-4 w-4" />,
        onClick: () => meta?.onPermanentlyDelete?.(company.id_),
        variant: 'destructive',
      }
    );
  }

  return actions;
}

export function getInsuranceCompanyName(company: InsuranceCompany): string {
  return company.name || '';
}

export function getInsuranceCompanyAvatarColor(company: InsuranceCompany): string {
  if (company.deleted_at) return 'bg-gray-100 text-gray-500';
  if (!company.is_active) return 'bg-gray-100 text-gray-500';
  return 'bg-blue-100 text-blue-700';
}

export function getInsuranceCompanyInitial(company: InsuranceCompany): string {
  const name = getInsuranceCompanyName(company);
  return name.charAt(0).toUpperCase();
}

export const insuranceCompanyColumns: ColumnDef<InsuranceCompany>[] = [
  createNameColumn(
    getInsuranceCompanyName,
    (company) => `/insurance-companies/${company.id_}`,
    {
      showStatus: true,
      statusField: 'is_active',
      getInitial: getInsuranceCompanyInitial,
      getAvatarColor: getInsuranceCompanyAvatarColor,
    }
  ),

  {
    accessorKey: "insurer_code",
    header: "Code assureur",
    cell: ({ row }) => {
      const company = row.original;
      return company.insurer_code || '-';
    },
  },

  {
    accessorKey: "contact_phone",
    header: "Téléphone",
    cell: ({ row }) => {
      const company = row.original;
      return company.contact_phone ? (
        <div className="flex items-center gap-1">
          <Phone className="h-4 w-4" />
          <span>{company.contact_phone}</span>
        </div>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },

  {
    accessorKey: "coverage_rate",
    header: "Couverture",
    cell: ({ row }) => {
      const company = row.original;
      return company.coverage_rate != null ? `${company.coverage_rate}%` : '-';
    },
  },

  {
    accessorKey: "is_active",
    header: "Statut",
    cell: ({ row, table }) => {
      const company = row.original;
      const meta = table.options.meta as any;
      const canAccess = meta?.canAccess || (() => false);
      
      return (
        <Switch
          checked={company.is_active && !company.deleted_at}
          onCheckedChange={() => {
            if (meta?.onToggleStatus) {
              meta.onToggleStatus(company);
            }
          }}
          disabled={!!company.deleted_at || !canAccess('insurance_companies', 'update')}
          className="data-[state=checked]:bg-green-500"
        />
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const company = row.original;
      const meta = table.options.meta as any;
      
      return (
        <DataTableActions
          row={row}
          actions={getInsuranceCompanyActions(company, meta)}
          canAccess={meta?.canAccess}
          resourceName="insurance_companies"
        />
      );
    },
  },
];
