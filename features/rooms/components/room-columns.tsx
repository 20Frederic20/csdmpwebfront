"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Room, RoomType } from "../types/rooms.types";
import {
    createNameColumn,
    createActionsColumn,
    ActionConfig
} from "@/components/ui/generic-columns";

export const getRoomTypeBadge = (type: RoomType) => {
    switch (type) {
        case RoomType.STANDARD:
            return <Badge variant="outline">Standard</Badge>;
        case RoomType.VIP:
            return <Badge className="bg-amber-100 text-amber-700 border-amber-200">VIP</Badge>;
        case RoomType.ICU:
            return <Badge variant="destructive">ICU</Badge>;
        case RoomType.PEDIATRICS:
            return <Badge className="bg-pink-100 text-pink-700 border-pink-200">Pédiatrie</Badge>;
        default:
            return <Badge variant="secondary">{type}</Badge>;
    }
};

export const getRoomActions = (
    room: Room,
    onEdit: (room: Room) => void,
    onDelete: (room: Room) => void,
    onAdmit: (room: Room) => void
): ActionConfig[] => {
    return [
        {
            label: "Modifier",
            icon: <Edit className="h-4 w-4" />,
            onClick: () => onEdit(room),
        },
        {
            label: "Admettre un patient",
            icon: <UserPlus className="h-4 w-4" />,
            onClick: () => onAdmit(room),
        },
        {
            label: "Supprimer",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => onDelete(room),
            variant: 'destructive',
        }

    ];
};

export const roomColumns = (
    onEdit: (room: Room) => void,
    onDelete: (room: Room) => void,
    onToggleStatus: (id: string) => void,
    onAdmit: (room: Room) => void
): ColumnDef<Room>[] => [
        createNameColumn<Room>(
            (r) => r.name,
            (r) => `/rooms/${r.id_}`, // Adjusted if there's a detail page later
            {
                showStatus: true,
                statusField: 'is_active',
            }
        ),
        {
            accessorKey: "type_",
            header: "Type",
            cell: ({ row }) => getRoomTypeBadge(row.original.type_),
        },
        {
            accessorKey: "capacity",
            header: "Capacité (Lits)",
            cell: ({ row }) => (
                <div className="font-medium">{row.original.capacity}</div>
            ),
        },
        {
            accessorKey: "is_active",
            header: "Statut",
            cell: ({ row }) => (
                <Switch
                    checked={row.original.is_active}
                    onCheckedChange={() => onToggleStatus(row.original.id_)}
                    className="data-[state=checked]:bg-green-500"
                />
            ),
        },
        createActionsColumn<Room>(
            (room) => getRoomActions(room, onEdit, onDelete, onAdmit)
        ),
    ];
