'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Appointment, UpdateAppointmentRequest } from "../types/appointment.types";
import { AppointmentService } from "../services/appointment.service";
import { PatientService } from "@/features/patients";
import { HospitalStaffService } from "@/features/hospital-staff/services/hospital-staff.service";
import { toast } from "sonner";

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onUpdate?: (appointment: Appointment) => void;
}

export function EditAppointmentModal({ isOpen, onClose, appointment, onUpdate }: EditAppointmentModalProps) {
  const [formData, setFormData] = useState<UpdateAppointmentRequest>({
    patient_id: '',
    doctor_id: null,
    scheduled_at: '',
    estimated_duration: 30,
    reason: '',
    status: 'scheduled',
    is_confirmed_by_patient: false,
    is_active: true
  });

  const [patients, setPatients] = useState<{ id: string; full_name: string }[]>([]);
  const [doctors, setDoctors] = useState<{ id: string; full_name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen && appointment) {
      setFormData({
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        scheduled_at: appointment.scheduled_at,
        estimated_duration: appointment.estimated_duration,
        reason: appointment.reason || '',
        status: appointment.status,
        is_confirmed_by_patient: appointment.is_confirmed_by_patient,
        is_active: appointment.is_active
      });
      loadPatientsAndDoctors();
    }
  }, [isOpen, appointment]);

  const loadPatientsAndDoctors = async () => {
    try {
      setLoadingData(true);
      
      const [patientsResponse, doctorsResponse] = await Promise.all([
        PatientService.getPatients({ limit: 50 }),
        HospitalStaffService.getHospitalStaff({ limit: 50 })
      ]);

      setPatients(patientsResponse.data.map(p => ({ id: p.id_, full_name: `${p.given_name} ${p.family_name}` })));
      setDoctors(doctorsResponse.data.map(d => ({ id: d.id_, full_name: `${d.user_given_name || ''} ${d.user_family_name || ''}` })));
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appointment?.id) return;
    
    if (!formData.patient_id || !formData.scheduled_at) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      const updatedAppointment = await AppointmentService.updateAppointment(appointment.id, formData);
      toast.success('Rendez-vous mis à jour avec succès');
      onUpdate?.(updatedAppointment);
      onClose();
    } catch (error) {
      console.error('Failed to update appointment:', error);
      toast.error('Erreur lors de la mise à jour du rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateAppointmentRequest, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen || !appointment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le rendez-vous">
      {loadingData ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-lg">Chargement...</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient_id">Patient *</Label>
              <Select
                value={formData.patient_id}
                onValueChange={(value) => handleInputChange('patient_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor_id">Médecin *</Label>
              <Select
                value={formData.doctor_id || ''}
                onValueChange={(value) => handleInputChange('doctor_id', value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un médecin" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_at">Date/Heure *</Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_duration">Durée (minutes)</Label>
              <Input
                id="estimated_duration"
                type="number"
                min="15"
                max="240"
                value={formData.estimated_duration || ''}
                onChange={(e) => handleInputChange('estimated_duration', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Appointment['status']) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Programmé</SelectItem>
                  <SelectItem value="confirmed">Confirmé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="no_show">Non présenté</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Raison</Label>
            <Textarea
              id="reason"
              value={formData.reason || ''}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="Raison du rendez-vous..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
