'use client';

import React from 'react';
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
import { Calendar, Clock, User, FileText, Activity } from "lucide-react";
import { Appointment, AppointmentStatus, AppointmentType, PaymentMethod } from "../types/appointments.types";

interface ViewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onAppointmentUpdated?: (updatedAppointment: any) => void;
}

export function ViewAppointmentModal({ isOpen, onClose, appointment, onAppointmentUpdated }: ViewAppointmentModalProps) {
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
      [AppointmentType.EMERGENCY_CONSULTATION]: 'Consultation d\'urgence',
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

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    const methodLabels: Record<PaymentMethod, string> = {
      [PaymentMethod.FREE_OF_CHARGE]: 'Gratuit',
      [PaymentMethod.INSURANCE]: 'Assurance',
      [PaymentMethod.CASH]: 'Espèces',
      [PaymentMethod.CREDIT_CARD]: 'Carte de crédit',
      [PaymentMethod.MOBILE_MONEY]: 'Mobile money',
      [PaymentMethod.BANK_TRANSFER]: 'Virement bancaire',
    };
    return methodLabels[method] || method;
  };

  return (
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
                  <p className="text-lg font-semibold">{getAppointmentTypeLabel(appointment.appointment_type )}</p>
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
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Méthode de paiement</h3>
              <p className="text-lg font-semibold">{getPaymentMethodLabel(appointment.payment_method)}</p>
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
              <span className="ml-1">{appointment.department_id || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium">Établissement:</span> 
              <span className="ml-1">{appointment.health_facility_id?.substring(0, 8)}...</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
