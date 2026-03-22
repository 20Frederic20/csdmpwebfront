'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, FileText, Activity, CheckCircle, XCircle, Check } from "lucide-react";
import { Appointment, AppointmentStatus, AppointmentType } from "../types/appointments.types";
import { ConfirmAppointmentModal } from "./confirm-appointment-modal";
import { CancelAppointmentModal } from "./cancel-appointment-modal";
import { CompleteAppointmentModal } from "./complete-appointment-modal";

interface ViewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onAppointmentUpdated?: (updatedAppointment: any) => void;
}

export function ViewAppointmentModal({ isOpen, onClose, appointment, onAppointmentUpdated }: ViewAppointmentModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  if (!isOpen || !appointment) return null;

  const getStatusBadge = (status: AppointmentStatus) => {
    const statusConfig: Record<AppointmentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      [AppointmentStatus.SCHEDULED]: { label: 'Programmé', variant: 'default' },
      [AppointmentStatus.CONFIRMED]: { label: 'Confirmé', variant: 'default' },
      [AppointmentStatus.CANCELLED]: { label: 'Annulé', variant: 'destructive' },
      [AppointmentStatus.COMPLETED]: { label: 'Terminé', variant: 'secondary' },
      [AppointmentStatus.NO_SHOW]: { label: 'Non présenté', variant: 'destructive' },
      [AppointmentStatus.RESCHEDULED]: { label: 'Reprogrammé', variant: 'outline' },
      [AppointmentStatus.IN_PROGRESS]: { label: 'En cours', variant: 'default' }
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('fr-FR', options);
    } catch {
      return dateString;
    }
  };

  const getAppointmentTypeLabel = (type: AppointmentType) => {
    const typeLabels: Record<AppointmentType, string> = {
      [AppointmentType.ROUTINE_CONSULTATION]: 'Consultation de routine',
      [AppointmentType.EMERGENCY_CONSULTATION]: "Consultation d'urgence",
      [AppointmentType.FOLLOW_UP]: 'Suivi',
      [AppointmentType.SPECIALIST_CONSULTATION]: 'Consultation spécialisée',
      [AppointmentType.SURGERY]: 'Chirurgie',
      [AppointmentType.IMAGING]: 'Imagerie',
      [AppointmentType.LABORATORY]: 'Laboratoire',
      [AppointmentType.VACCINATION]: 'Vaccination',
      [AppointmentType.PREVENTIVE_CARE]: 'Soins préventifs',
    };
    return typeLabels[type] || type;
  };


  const handleActionSuccess = () => {
    onAppointmentUpdated?.(appointment);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Détails du rendez-vous
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le rendez-vous sélectionné
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Patient</h3>
                    <p className="text-lg font-semibold">{appointment.patient_full_name || appointment.patient_id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Médecin</h3>
                    <p className="text-lg font-semibold">{appointment.doctor_full_name || appointment.doctor_id || 'Non assigné'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date/Heure</h3>
                    <p className="text-lg font-semibold">{formatDate(appointment.scheduled_at)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Durée</h3>
                    <p className="text-lg font-semibold">{appointment.estimated_duration || 'N/A'} minutes</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                    <div className="mt-1">
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                    <p className="text-lg font-semibold">{getAppointmentTypeLabel(appointment.appointment_type || AppointmentType.ROUTINE_CONSULTATION)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Informations additionnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Confirmation patient</h3>
                <Badge variant={appointment.is_confirmed_by_patient ? 'default' : 'outline'}>
                  {appointment.is_confirmed_by_patient ? 'Confirmé' : 'Non confirmé'}
                </Badge>
              </div>
              
            </div>
            
            {/* Raison */}
            {appointment.reason && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Raison du rendez-vous
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-gray-700 whitespace-pre-wrap">{appointment.reason}</p>
                </div>
              </div>
            )}
            
            {/* Métadonnées */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 border-t pt-4">
              <div>
                <span className="font-medium">ID:</span> 
                <span className="ml-1 font-mono">{appointment.id_?.substring(0, 8)}...</span>
              </div>
              <div>
                <span className="font-medium">Actif:</span> 
                <span className="ml-1">{appointment.is_active ? 'Oui' : 'Non'}</span>
              </div>
              <div>
                <span className="font-medium">Département:</span> 
                <span className="ml-1">{appointment.department_name || appointment.department_id || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium">Établissement:</span> 
                <span className="ml-1">{appointment.health_facility_name || appointment.health_facility_id?.substring(0, 8)}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-wrap justify-end gap-2 pt-4 border-t">
            {/* Confirmer (patient) – seulement si SCHEDULED et pas encore confirmé par patient */}
            {appointment.status === AppointmentStatus.SCHEDULED && !appointment.is_confirmed_by_patient && (
              <Button 
                variant="outline" 
                className="border-green-600 text-green-600 hover:bg-green-50"
                onClick={() => setShowConfirm(true)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirmer (Patient)
              </Button>
            )}

            {/* Annuler – SCHEDULED ou CONFIRMED */}
            {(appointment.status === AppointmentStatus.SCHEDULED || appointment.status === AppointmentStatus.CONFIRMED) && (
              <Button 
                variant="outline" 
                className="border-red-600 text-red-600 hover:bg-red-50"
                onClick={() => setShowCancel(true)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            )}

            {/* Terminer – SCHEDULED, CONFIRMED ou IN_PROGRESS */}
            {(
              appointment.status === AppointmentStatus.SCHEDULED ||
              appointment.status === AppointmentStatus.CONFIRMED ||
              appointment.status === AppointmentStatus.IN_PROGRESS
            ) && (
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setShowComplete(true)}
              >
                <Check className="mr-2 h-4 w-4" />
                Terminer
              </Button>
            )}

            <Button variant="ghost" onClick={onClose}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modaux d'action */}
      <ConfirmAppointmentModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        appointment={appointment}
        onSuccess={handleActionSuccess}
      />

      <CancelAppointmentModal
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        appointment={appointment}
        onSuccess={handleActionSuccess}
      />

      <CompleteAppointmentModal
        isOpen={showComplete}
        onClose={() => setShowComplete(false)}
        appointment={appointment}
        onSuccess={handleActionSuccess}
      />
    </>
  );
}
