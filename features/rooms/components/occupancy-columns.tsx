"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RoomOccupancy } from "../types/rooms.types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRightLeft, LogOut } from "lucide-react";
import {
    createActionsColumn,
    ActionConfig
} from "@/components/ui/generic-columns";


export const getOccupancyActions = (
    occupancy: RoomOccupancy,
    onTransfer: (occupancy: RoomOccupancy) => void,
    onDischarge: (occupancy: RoomOccupancy) => void
): ActionConfig[] => {
    const actions: ActionConfig[] = [];

    actions.push({
        label: "Transférer",
        icon: <ArrowRightLeft className="mr-2 h-4 w-4" />,
        onClick: () => onTransfer(occupancy),
    });
    actions.push({
        label: "Enregistrer la sortie",
        icon: <LogOut className="mr-2 h-4 w-4" />,
        onClick: () => onDischarge(occupancy),
        variant: 'destructive',
    });


    return actions;
};

export const occupancyColumns = (
    onTransfer: (occupancy: RoomOccupancy) => void,
    onDischarge: (occupancy: RoomOccupancy) => void
): ColumnDef<RoomOccupancy>[] => [
        {
            accessorKey: "patient_name",
            header: "Patient",
            cell: ({ row }) => (
                <div className="font-medium text-blue-600">
                    {row.original.patient_name || row.original.patient_id.substring(0, 8)}
                </div>
            ),
        },
        {
            accessorKey: "room_name",
            header: "Chambre",
            cell: ({ row }) => (
                <Badge variant="outline" className="bg-slate-50">
                    {row.original.room_name || row.original.room_id.substring(0, 8)}
                </Badge>
            ),
        },
        {
            accessorKey: "admission_date",
            header: "Date d'admission",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {format(new Date(row.original.admission_date), "dd MMM yyyy HH:mm", { locale: fr })}
                </div>
            ),
        },
        {
            accessorKey: "discharge_date",
            header: "Date de sortie",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {row.original.discharge_date 
                        ? format(new Date(row.original.discharge_date), "dd MMM yyyy HH:mm", { locale: fr })
                        : "---"
                    }
                </div>
            ),
        },
        {
            accessorKey: "is_active",
            header: "Statut",
            cell: ({ row }) => {
                const isActive = !row.original.discharge_date;
                return (
                    <Badge 
                        variant={isActive ? "default" : "secondary"} 
                        className={isActive ? "bg-green-100 text-green-700 border-green-200" : ""}
                    >
                        {isActive ? "Hospitalisé" : "Sortie enregistrée"}
                    </Badge>
                );
            },
        },



        createActionsColumn<RoomOccupancy>(
            (occupancy) => getOccupancyActions(occupancy, onTransfer, onDischarge)
        ),
    ];


