"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ConsultationQM } from "@/features/consultations/types/consultations.types";
import {
    createNameColumn,
    DataTableActions,
    ActionConfig,
} from "@/components/ui/generic-columns";
import {
    getConsultationStatusLabel,
    getConsultationStatusBadge,
    canDeleteConsultation,
    canRestoreConsultation,
} from "@/features/consultations/utils/consultation.utils";

export function getConsultationName(consultation: ConsultationQM): string {
    return consultation.patient_full_name || consultation.patient_id || "Patient inconnu";
}

export function getConsultationDetailUrl(consultation: ConsultationQM): string {
    return `/consultations/${consultation.id_}`;
}

export function getConsultationAvatarColor(consultation: ConsultationQM): string {
    if (consultation.deleted_at) return "bg-gray-100 text-gray-500";
    if (!consultation.is_active) return "bg-gray-100 text-gray-500";
    return "bg-green-100 text-green-700";
}

export function getConsultationInitial(consultation: ConsultationQM): string {
    const name = getConsultationName(consultation);
    return name.charAt(0).toUpperCase();
}

export function getConsultationActions(
    consultation: ConsultationQM,
    canAccess: (resource: string, action: string) => boolean,
    table?: any
): ActionConfig[] {
    const isDeleted = !!(consultation.deleted_at && consultation.deleted_at !== "");
    const actions: ActionConfig[] = [
        {
            label: "Voir",
            icon: <Eye className="h-4 w-4" />,
            href: `/consultations/${consultation.id_}`,
        },
    ];

    if (!isDeleted && canAccess("consultations", "update")) {
        actions.push({
            label: "Modifier",
            icon: <Edit className="h-4 w-4" />,
            href: `/consultations/${consultation.id_}/edit`,
        });
    }

    if (!isDeleted && canDeleteConsultation(consultation)) {
        actions.push(
            { separator: true },
            {
                label: "Supprimer",
                icon: <Trash2 className="h-4 w-4" />,
                onClick: () => {
                    const meta = table?.options.meta as any;
                    meta?.onDeleteConsultation?.(consultation);
                },
                variant: "destructive",
            }
        );
    }

    if (isDeleted && canRestoreConsultation(consultation)) {
        actions.push(
            { separator: true },
            {
                label: "Restaurer",
                icon: <RotateCcw className="h-4 w-4" />,
                onClick: () => {
                    const meta = table?.options.meta as any;
                    meta?.onRestoreConsultation?.(consultation);
                },
                variant: "success",
            }
        );
    }

    if (isDeleted) {
        actions.push({
            label: "Supprimer définitivement",
            icon: <AlertTriangle className="h-4 w-4" />,
            onClick: () => {
                const meta = table?.options.meta as any;
                meta?.onPermanentlyDeleteConsultation?.(consultation);
            },
            variant: "destructive",
        });
    }

    return actions;
}

export const consultationColumns: ColumnDef<ConsultationQM>[] = [
    // Colonne Patient
    createNameColumn(
        getConsultationName,
        getConsultationDetailUrl,
        {
            showStatus: true,
            statusField: "is_active",
            getInitial: getConsultationInitial,
            getAvatarColor: getConsultationAvatarColor,
        }
    ),

    // Colonne Médecin
    {
        accessorKey: "consulted_by_full_name",
        header: "Médecin",
        cell: ({ row }) => (
            <div className="max-w-xs truncate text-sm">
                {row.getValue("consulted_by_full_name") || "Non assigné"}
            </div>
        ),
    },

    // Colonne Établissement
    {
        accessorKey: "health_facility_name",
        header: "Établissement",
        cell: ({ row }) => (
            <div className="max-w-xs truncate text-sm">
                {row.getValue("health_facility_name") || "-"}
            </div>
        ),
    },

    // Colonne Statut consultation
    {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => {
            const consultation = row.original;
            const statusBadge = getConsultationStatusBadge(consultation.status);
            return (
                <Badge
                    variant={statusBadge.variant as "default" | "secondary" | "destructive" | "outline"}
                    className={statusBadge.className}
                >
                    {getConsultationStatusLabel(consultation.status)}
                </Badge>
            );
        },
    },


    // Colonne Active (switch)
    {
        accessorKey: "is_active",
        header: "Active",
        cell: ({ row, table }) => {
            const consultation = row.original;
            const isDeleted = !!(consultation.deleted_at && consultation.deleted_at !== "");
            const meta = table.options.meta as any;

            if (!isDeleted && meta?.canAccess?.("consultations", "toggle")) {
                return (
                    <Switch
                        checked={consultation.is_active}
                        onCheckedChange={() => meta?.onToggleStatus?.(consultation.id_)}
                        className="data-[state=checked]:bg-green-500"
                    />
                );
            }

            return (
                <Badge variant={consultation.is_active ? "default" : "secondary"}>
                    {consultation.is_active ? "Oui" : "Non"}
                </Badge>
            );
        },
    },

    // Colonne Actions
    {
        id: "actions",
        header: "Actions",
        cell: ({ row, table }) => {
            const consultation = row.original;
            const meta = table.options.meta as any;

            return (
                <DataTableActions
                    row={row}
                    actions={getConsultationActions(consultation, meta?.canAccess || (() => true), table)}
                    canAccess={meta?.canAccess}
                    resourceName="consultations"
                />
            );
        },
    },
];
