'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Appointment, AppointmentStatus } from "../types/appointment.types";

interface ViewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export function ViewAppointmentModal({ isOpen, onClose, appointment }: ViewAppointmentModalProps) {
  if (!isOpen || !appointment) return null;

  const getStatusBadge = (status: AppointmentStatus) => {
    const statusConfig = {
      scheduled: { label: 'Programmé', className: 'bg-blue-100 text-blue-800' },
      confirmed: { label: 'Confirmé', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulé', className: 'bg-red-100 text-red-800' },
      completed: { label: 'Terminé', className: 'bg-gray-100 text-gray-800' },
      no_show: { label: 'Non présenté', className: 'bg-orange-100 text-orange-800' },
      rescheduled: { label: 'Reprogrammé', className: 'bg-purple-100 text-purple-800' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      };
      return date.toLocaleDateString('fr-FR', options);
    } catch {
      return dateString;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails du rendez-vous">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Patient</h3>
              <p className="text-lg font-semibold">{appointment.patient_full_name || appointment.patient_id}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Médecin</h3>
              <p className="text-lg font-semibold">{appointment.doctor_full_name || appointment.doctor_id || 'Non assigné'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Date/Heure</h3>
              <p className="text-lg font-semibold">{appointment.scheduled_at}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Durée</h3>
              <p className="text-lg font-semibold">{appointment.estimated_duration || 'N/A'} minutes</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Statut</h3>
              <div className="mt-1">
                {getStatusBadge(appointment.status)}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Confirmation patient</h3>
              <p className="text-lg font-semibold">{appointment.is_confirmed_by_patient ? 'Oui' : 'Non'}</p>
            </div>
          </div>
        </div>
        
        {appointment.reason && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Raison</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{appointment.reason}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <span className="font-medium">ID:</span> {appointment.id}
          </div>
          <div>
            <span className="font-medium">Actif:</span> {appointment.is_active ? 'Oui' : 'Non'}
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
