import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RotateCcw, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { MedicalService, ServiceCategory } from "../types/medical-service.types";

export const getMedicalServiceColumns = (
  onEdit: (service: MedicalService) => void,
  onDelete: (service: MedicalService) => void,
  onToggleStatus: (id: string) => void,
  onRestore: (id: string) => void,
  onPermanentDelete: (service: MedicalService) => void
): ColumnDef<MedicalService>[] => [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const service = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-mono text-xs">{service.code}</span>
          {service.deleted_at && (
            <Badge variant="destructive" className="w-fit text-[10px] h-4 mt-1">
              Supprimé
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: "label",
    header: "Désignation",
  },
  {
    accessorKey: "category",
    header: "Catégorie",
    cell: ({ row }) => {
      const category = row.getValue("category") as ServiceCategory;
      const variants: Record<ServiceCategory, "default" | "secondary" | "outline" | "destructive"> = {
        [ServiceCategory.CONSULTATION]: "default",
        [ServiceCategory.LAB]: "secondary",
        [ServiceCategory.HOSPITALIZATION]: "outline",
        [ServiceCategory.PHARMACY]: "default",
        [ServiceCategory.IMAGING]: "secondary",
        [ServiceCategory.OTHER]: "outline",
      };
      return <Badge variant={variants[category] || "outline"}>{category}</Badge>;
    },
  },
  {
    accessorKey: "base_price",
    header: "Prix de base",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("base_price"));
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
      }).format(price);
    },
  },
  {
    accessorKey: "is_active",
    header: "Statut",
    cell: ({ row }) => {
      const service = row.original;
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={service.is_active && !service.deleted_at}
            onCheckedChange={() => onToggleStatus(service.id)}
            disabled={!!service.deleted_at}
          />
          <span className={`text-xs ${service.is_active && !service.deleted_at ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
            {service.deleted_at ? "N/A" : service.is_active ? "Actif" : "Inactif"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const service = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            
            {!service.deleted_at && (
              <>
                <DropdownMenuItem onClick={() => onEdit(service)}>
                  <Edit className="mr-2 h-4 w-4" /> Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(service)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                </DropdownMenuItem>
              </>
            )}

            {service.deleted_at && (
              <>
                <DropdownMenuItem onClick={() => onRestore(service.id)}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Restaurer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onPermanentDelete(service)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" /> Supprimer définitivement
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
