"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash2, RotateCcw, Calendar, Clock, User, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Appointment, AppointmentStatus, AppointmentType, PaymentMethod } from "@/features/appointments/types/appointments.types";
import { 
  formatAppointmentStatus, 
  formatAppointmentType, 
  formatPaymentMethod,
  getAppointmentStatusBadge,
  formatAppointmentDateTime,
  getAppointmentDuration,
  getAppointmentDetailUrl
} from "@/features/appointments/utils/appointments.utils";
import { 
  createNameColumn, 
  createDateColumn, 
  createStatusColumn, 
  createActionsColumn,
  ActionConfig,
  DataTableActions
} from "@/components/ui/generic-columns";
import Link from "next/link";

export function getAppointmentActions(
  appointment: Appointment, 
  canAccess: (resource: string, action: string) => boolean,
  onView?: (appointment: Appointment) => void,
  onEdit?: (appointment: Appointment) => void,
  onDelete?: (appointment: Appointment) => void
): ActionConfig[] {
  const actions: ActionConfig[] = [
    {
      label: "Voir",
      icon: <Eye className="h-4 w-4" />,
      onClick: () => onView?.(appointment),
    },
  ];

  if (canAccess('appointments', 'update')) {
    actions.push({
      label: "Modifier",
      icon: <Edit className="h-4 w-4" />,
      onClick: () => onEdit?.(appointment),
    });
  }

  if (canAccess('appointments', 'delete') && !appointment.deleted_at) {
    actions.push(
      { separator: true },
      {
        label: "Supprimer",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => onDelete?.(appointment),
        variant: 'destructive',
      }
    );
  }

  if (appointment.deleted_at && canAccess('appointments', 'delete')) {
    actions.push(
      { separator: true },
      {
        label: "Restaurer",
        icon: <RotateCcw className="h-4 w-4" />,
        onClick: () => {
          // TODO: Implement restore functionality
        },
        variant: 'success',
      }
    );
  }

  return actions;
}

export function getAppointmentName(appointment: Appointment): string {
  return appointment.patient_full_name || `Patient ${appointment.patient_id}`;
}

export function getAppointmentDetailUrlFunction(appointment: Appointment): string {
  return `/appointments/${appointment.id_}`;
}

export function getAppointmentInitial(appointment: Appointment): string {
  const name = getAppointmentName(appointment);
  return name.charAt(0).toUpperCase();
}

export function getAppointmentAvatarColor(appointment: Appointment): string {
  if (appointment.deleted_at) return 'bg-gray-100 text-gray-500';
  if (!appointment.is_active) return 'bg-gray-100 text-gray-500';
  
  const statusColors = {
    [AppointmentStatus.SCHEDULED]: 'bg-blue-100 text-blue-700',
    [AppointmentStatus.CONFIRMED]: 'bg-green-100 text-green-700',
    [AppointmentStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-700',
    [AppointmentStatus.COMPLETED]: 'bg-gray-100 text-gray-700',
    [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-700',
    [AppointmentStatus.NO_SHOW]: 'bg-orange-100 text-orange-700',
    [AppointmentStatus.RESCHEDULED]: 'bg-purple-100 text-purple-700',
  };
  
  return statusColors[appointment.status] || 'bg-blue-100 text-blue-700';
}

export const appointmentColumns: ColumnDef<Appointment>[] = [
  // Colonne Patient avec avatar et statut
  createNameColumn(
    getAppointmentName,
    getAppointmentDetailUrlFunction,
    {
      showStatus: true,
      statusField: 'status',
      getInitial: getAppointmentInitial,
      getAvatarColor: getAppointmentAvatarColor,
    }
  ),

  // Colonne Date et heure
  {
    accessorKey: "scheduled_at",
    header: "Date/Heure",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {formatAppointmentDateTime(appointment.scheduled_at)}
            </span>
          </div>
          {appointment.estimated_duration && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{getAppointmentDuration(appointment.estimated_duration)}</span>
            </div>
          )}
        </div>
      );
    },
  },

  // Colonne Médecin
  {
    accessorKey: "doctor_full_name",
    header: "Médecin",
    cell: ({ row }) => {
      const doctorName = row.getValue("doctor_full_name");
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{String(doctorName) || 'Non assigné'}</span>
        </div>
      );
    },
  },

  // Colonne Établissement
  {
    accessorKey: "health_facility_name",
    header: "Établissement",
    cell: ({ row }) => {
      const facilityName = row.getValue("health_facility_name");
      return (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span>{String(facilityName) || 'Non spécifié'}</span>
        </div>
      );
    },
  },

  // Colonne Type de rendez-vous
  {
    accessorKey: "appointment_type",
    header: "Type",
    cell: ({ row }) => {
      const appointment = row.original;
      const type = appointment.appointment_type;
      if (!type) return '-';
      
      return (
        <Badge variant="outline">
          {formatAppointmentType(type)}
        </Badge>
      );
    },
  },

  // Colonne Méthode de paiement
  {
    accessorKey: "payment_method",
    header: "Paiement",
    cell: ({ row }) => {
      const appointment = row.original;
      const method = appointment.payment_method;
      if (!method) return '-';
      
      return (
        <Badge variant="secondary">
          {formatPaymentMethod(method)}
        </Badge>
      );
    },
  },

  // Colonne Statut
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const appointment = row.original;
      const statusBadge = getAppointmentStatusBadge(appointment.status);
      
      return (
        <Badge variant={statusBadge.variant}>
          {statusBadge.label}
        </Badge>
      );
    },
  },

  // Colonne Actions
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const appointment = row.original;
      const meta = table.options.meta as any;
      
      return (
        <DataTableActions
          row={row}
          actions={getAppointmentActions(
            appointment, 
            meta?.canAccess || (() => true),
            meta?.onOpenViewModal,
            meta?.onOpenEditModal,
            meta?.onOpenDeleteModal
          )}
          canAccess={meta?.canAccess}
          resourceName="appointments"
        />
      );
    },
  },
];
