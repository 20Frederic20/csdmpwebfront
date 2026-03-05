import { ColumnDef } from "@tanstack/react-table";
import { Prescription } from "@/features/prescriptions/types/prescriptions.types";
import { 
  ActionConfig,
  DataTableActions
} from "@/components/ui/generic-columns";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";

export function getPrescriptionActions(prescription: Prescription, canAccess: (resource: string, action: string) => boolean, meta?: any): ActionConfig[] {
  const actions: ActionConfig[] = [
    {
      label: "Voir",
      icon: <Eye className="h-4 w-4" />,
      href: `/prescriptions/${prescription.id}`,
    },
  ];

  if (canAccess('prescriptions', 'update')) {
    actions.push({
      label: "Modifier",
      icon: <Edit className="h-4 w-4" />,
      href: `/prescriptions/${prescription.id}/edit`,
    });
  }

  if (canAccess('prescriptions', 'delete')) {
    actions.push(
      { separator: true },
      {
        label: "Supprimer",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => {
          if (meta?.onOpenDeleteModal) {
            meta.onOpenDeleteModal(prescription);
          }
        },
        variant: 'destructive',
      }
    );
  }

  return actions;
}

export const prescriptionsColumns: ColumnDef<Prescription>[] = [
    {
      id: 'medication_name',
      header: 'Médicament',
      cell: ({ row }) => {
        const prescription = row.original;
        return (
          <div className="max-w-48 truncate font-medium">
            {prescription.medication_name}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: 'dosage_instructions',
      header: 'Instructions de dosage',
      cell: ({ row }) => {
        const prescription = row.original;
        return (
          <div className="max-w-48 truncate text-sm text-muted-foreground">
            {prescription.dosage_instructions}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: 'form',
      header: 'Forme',
      cell: ({ row }) => {
        const prescription = row.original;
        return (
          <div className="flex flex-wrap gap-1">
            {prescription.form?.map((form, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {form}
              </Badge>
            ))}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: 'strength',
      header: 'Force',
      cell: ({ row }) => {
        const prescription = row.original;
        return (
          <div className="max-w-48 truncate text-sm">
            {prescription.strength || '-'}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: 'duration_days',
      header: 'Durée (jours)',
      cell: ({ row }) => {
        const prescription = row.original;
        return (
          <div className="max-w-48 truncate text-sm">
            {prescription.duration_days || '-'}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: 'is_active',
      header: 'Statut',
      cell: ({ row }) => {
        const prescription = row.original;
        return (
          <div className="flex items-center gap-2">
            <Badge variant={prescription.is_active ? 'default' : 'secondary'}>
              {prescription.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: 'is_confidential',
      header: 'Confidentiel',
      cell: ({ row }) => {
        const prescription = row.original;
        return (
          <div className="flex items-center gap-2">
            <Badge variant={prescription.is_confidential ? 'destructive' : 'outline'}>
              {prescription.is_confidential ? 'Oui' : 'Non'}
            </Badge>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: 'created_at',
      header: 'Date de création',
      cell: ({ row }) => {
        const prescription = row.original;
        return (
          <div className="max-w-48 truncate text-sm text-muted-foreground">
            {new Date(prescription.created_at || '').toLocaleDateString()}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row, table }) => {
        const prescription = row.original;
        const meta = table.options.meta as any;
        
        return (
          <DataTableActions
            row={prescription}
            actions={getPrescriptionActions(prescription, meta?.canAccess || (() => true), meta)}
            canAccess={meta?.canAccess}
            resourceName="prescriptions"
          />
        );
      },
      enableSorting: false,
    },
  ];
