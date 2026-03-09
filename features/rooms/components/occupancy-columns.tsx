"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RoomOccupancy } from "../types/rooms.types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowRightLeft, LogOut } from "lucide-react";

export const occupancyColumns = (
    onTransfer: (occupancy: RoomOccupancy) => void,
    onDischarge: (occupancy: RoomOccupancy) => void
): ColumnDef<RoomOccupancy>[] => [
        {
            accessorKey: "patient_name",
            header: "Patient",
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.original.patient_name || row.original.patient_id.substring(0, 8)}
                </div>
            ),
        },
        {
            accessorKey: "room_name",
            header: "Chambre",
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.room_name || row.original.room_id.substring(0, 8)}
                </Badge>
            ),
        },
        {
            accessorKey: "admission_date",
            header: "Date d'admission",
            cell: ({ row }) => (
                <div className="text-sm">
                    {format(new Date(row.original.admission_date), "dd MMM yyyy HH:mm", { locale: fr })}
                </div>
            ),
        },
        {
            accessorKey: "is_active",
            header: "Statut",
            cell: ({ row }) => (
                <Badge variant={row.original.is_active ? "default" : "secondary"}>
                    {row.original.is_active ? "En cours" : "Terminé"}
                </Badge>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const occupancy = row.original;
                if (!occupancy.is_active) return null;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onTransfer(occupancy)}>
                                <ArrowRightLeft className="mr-2 h-4 w-4" />
                                Transférer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDischarge(occupancy)}
                                className="text-destructive focus:text-destructive"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Enregistrer la sortie
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
