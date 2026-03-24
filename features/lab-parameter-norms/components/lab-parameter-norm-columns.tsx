"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LabParameterNorm } from "../types/lab-parameter-norms.types";
import { 
  ActionConfig,
  DataTableActions
} from "@/components/ui/generic-columns";

export function getLabParameterNormActions(
  norm: LabParameterNorm, 
  canAccess: (resource: string, action: string) => boolean, 
  meta?: any
): ActionConfig[] {
  const actions: ActionConfig[] = [];

  if (canAccess('lab_parameter_norms', 'update')) {
    actions.push({
      label: "Modifier",
      icon: <Edit className="h-4 w-4" />,
      onClick: () => {
        if (meta?.onEdit) {
          meta.onEdit(norm);
        }
      },
    });
  }

  if (canAccess('lab_parameter_norms', 'delete')) {
    actions.push(
      { separator: true },
      {
        label: "Supprimer",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => {
          if (meta?.onDelete) {
            meta.onDelete(norm.id);
          }
        },
        variant: 'destructive',
      }
    );
  }

  return actions;
}

export const labParameterNormColumns: ColumnDef<LabParameterNorm>[] = [
  {
    id: 'parameter_code',
    header: 'Paramètre',
    cell: ({ row }) => {
      const norm = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{norm.parameter_code}</span>
          <span className="text-xs text-muted-foreground">{norm.display_name}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: 'gender',
    header: 'Genre',
    cell: ({ row }) => {
      const norm = row.original;
      return (
        <Badge variant="outline" className="capitalize bg-white lowercase border-slate-200 text-slate-600">
          {norm.gender === 'male' ? 'Homme' : norm.gender === 'female' ? 'Femme' : 'Tous'}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    id: 'age_range',
    header: 'Âge (Mois)',
    cell: ({ row }) => {
      const norm = row.original;
      return (
        <div className="text-sm font-medium text-slate-600">
          {norm.age_min_months} - {norm.age_max_months}
        </div>
      );
    },
  },
  {
    id: 'reference_values',
    header: 'Valeurs de Réf.',
    cell: ({ row }) => {
      const norm = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="text-primary font-mono font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
            {norm.min_value}
          </span>
          <span className="text-slate-400 font-bold">-</span>
          <span className="text-primary font-mono font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
            {norm.max_value}
          </span>
        </div>
      );
    },
  },
  {
    id: 'unit',
    header: 'Unité',
    cell: ({ row }) => {
      const norm = row.original;
      return <span className="text-sm font-semibold text-slate-700">{norm.unit}</span>;
    },
  },
  {
    id: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const norm = row.original;
      if (norm.is_pregnant) {
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 font-semibold lowercase">
            enceinte (T{norm.trimester})
          </Badge>
        );
      }
      return <span className="text-slate-300 text-xs italic">N/A</span>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => {
      const norm = row.original;
      const meta = table.options.meta as any;
      
      return (
        <DataTableActions
          row={norm}
          actions={getLabParameterNormActions(norm, meta?.canAccess || (() => true), meta)}
          canAccess={meta?.canAccess}
          resourceName="lab-parameter-norms"
        />
      );
    },
  },
];
