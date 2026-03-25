'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ExamDefinition } from '../types/lab-exam-definitions.types';
import { ActionConfig, DataTableActions } from '@/components/ui/generic-columns';
import { formatTestType } from '../types/lab-results.types';

export function getExamDefinitionActions(
  definition: ExamDefinition,
  canAccess: (resource: string, action: string) => boolean,
  meta?: any
): ActionConfig[] {
  const actions: ActionConfig[] = [];

  if (canAccess('exam_definitions', 'update')) {
    actions.push({
      label: 'Modifier',
      icon: <Edit className="h-4 w-4" />,
      onClick: () => meta?.onEdit?.(definition),
    });
  }

  if (canAccess('exam_definitions', 'delete')) {
    actions.push(
      { separator: true },
      {
        label: 'Supprimer',
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => meta?.onDelete?.(definition.id_),
        variant: 'destructive',
      }
    );
  }

  return actions;
}

export const examDefinitionColumns: ColumnDef<ExamDefinition>[] = [
  {
    id: 'name',
    header: 'Définition',
    cell: ({ row }) => {
      const def = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{def.name}</span>
          {def.description && (
            <span className="text-xs text-muted-foreground truncate max-w-[250px]">{def.description}</span>
          )}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: 'test_type',
    header: 'Type de test',
    cell: ({ row }) => {
      const def = row.original;
      return (
        <Badge variant="outline" className="capitalize border-slate-200 text-slate-600">
          {formatTestType(def.test_type)}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    id: 'parameter_codes',
    header: 'Paramètres',
    cell: ({ row }) => {
      const def = row.original;
      return (
        <div className="flex flex-wrap gap-1 max-w-[300px]">
          {def.parameter_codes.map((code) => (
            <Badge
              key={code}
              className="bg-primary/10 text-primary border border-primary/20 font-mono text-xs"
            >
              {code}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: 'health_facility',
    header: 'Établissement',
    cell: ({ row }) => {
      const def = row.original;
      if (!def.health_facility_id) {
        return <span className="text-xs text-muted-foreground italic">Global</span>;
      }
      return (
        <Badge variant="outline" className="border-slate-200 text-slate-600 font-mono text-xs">
          {def.health_facility_id.slice(0, 8)}…
        </Badge>
      );
    },
  },
  {
    id: 'is_active',
    header: 'Statut',
    cell: ({ row }) => {
      const def = row.original;
      return def.is_active ? (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">Actif</Badge>
      ) : (
        <Badge variant="outline" className="text-slate-400">Inactif</Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => {
      const def = row.original;
      const meta = table.options.meta as any;
      return (
        <DataTableActions
          row={def}
          actions={getExamDefinitionActions(def, meta?.canAccess || (() => true), meta)}
          canAccess={meta?.canAccess}
          resourceName="exam-definitions"
        />
      );
    },
  },
];
