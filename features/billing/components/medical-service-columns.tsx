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
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { MedicalService, ServiceCategory } from "../types/medical-service.types";

export const getMedicalServiceColumns = (onEdit: (service: MedicalService) => void, onDelete: (service: MedicalService) => void): ColumnDef<MedicalService>[] => [
  {
    accessorKey: "code",
    header: "Code",
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
      const isActive = row.getValue("is_active") as boolean;
      return (
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? "Actif" : "Inactif"}
        </Badge>
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
            <DropdownMenuItem onClick={() => onEdit(service)}>
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(service)} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
