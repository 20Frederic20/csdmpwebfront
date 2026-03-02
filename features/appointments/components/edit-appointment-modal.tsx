'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomSelect from "@/components/ui/custom-select";
import { Appointment, UpdateAppointmentRequest, AppointmentStatus, AppointmentType, PaymentMethod } from "../types/appointments.types";
import { AppointmentService } from "../services/appointment.service";
import { PatientService } from "@/features/patients";
import { HospitalStaffService } from "@/features/hospital-staff/services/hospital-staff.service";
import { HealthFacilitySelect } from "@/features/health-facilities/components/health-facility-select";
import { DepartmentSelect } from "@/features/departments/components/department-select";
import { InsuranceCompanySelect } from "@/features/insurance-companies/components/insurance-company-select";
import { toast } from "sonner";

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onUpdate?: (appointment: Appointment) => void;
  onAppointmentUpdated?: (updatedAppointment: any) => void;
}

export function EditAppointmentModal({ isOpen, onClose, appointment, onUpdate, onAppointmentUpdated }: EditAppointmentModalProps) {
  const [formData, setFormData] = useState<UpdateAppointmentRequest>({
    doctor_id: null,
    scheduled_at: '',
    estimated_duration: 30,
    reason: '',
    insurance_company_id: null,
    department_id: null,
    health_facility_id: null,
    appointment_type: null,
    payment_method: null,
    status: 'scheduled' as any,
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
        doctor_id: appointment.doctor_id,
        scheduled_at: appointment.scheduled_at,
        estimated_duration: appointment.estimated_duration,
        reason: appointment.reason || '',
        insurance_company_id: appointment.insurance_company_id,
        department_id: appointment.department_id,
        health_facility_id: appointment.health_facility_id,
        appointment_type: appointment.appointment_type,
        payment_method: appointment.payment_method,
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

  // Transformer les données pour le Select
  const patientOptions = patients.map(patient => ({
    value: patient.id,
    label: patient.full_name
  }));

  const doctorOptions = doctors.map(doctor => ({
    value: doctor.id,
    label: doctor.full_name
  }));

  const statusOptions = [
    { value: 'scheduled', label: 'Programmé' },
    { value: 'confirmed', label: 'Confirmé' },
    { value: 'cancelled', label: 'Annulé' },
    { value: 'completed', label: 'Terminé' },
    { value: 'no_show', label: 'Non présenté' },
    { value: 'rescheduled', label: 'Reprogrammé' }
  ];

  const appointmentTypeOptions = [
    { value: 'ROUTINE_CONSULTATION', label: 'Consultation routine' },
    { value: 'EMERGENCY_CONSULTATION', label: 'Consultation urgence' },
    { value: 'FOLLOW_UP', label: 'Suivi' },
    { value: 'SPECIALIST_CONSULTATION', label: 'Consultation spécialiste' },
    { value: 'SURGERY', label: 'Chirurgie' },
    { value: 'IMAGING', label: 'Imagerie' },
    { value: 'LABORATORY', label: 'Laboratoire' },
    { value: 'VACCINATION', label: 'Vaccination' },
    { value: 'PREVENTIVE_CARE', label: 'Soins préventifs' }
  ];

  const paymentMethodOptions = [
    { value: 'FREE_OF_CHARGE', label: 'Gratuit' },
    { value: 'INSURANCE', label: 'Assurance' },
    { value: 'CASH', label: 'Espèces' },
    { value: 'CREDIT_CARD', label: 'Carte de crédit' },
    { value: 'MOBILE_MONEY', label: 'Mobile money' },
    { value: 'BANK_TRANSFER', label: 'Virement bancaire' }
  ];

  const handleButtonClick = () => {
    console.log('Bouton cliqué'); // Debug
    handleSubmit(new Event('submit') as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit appelé'); // Debug
    
    if (!appointment?.id_) {
      console.log('Pas d appointment ID'); // Debug
      return;
    }
    
    if (!formData.scheduled_at) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    console.log('Début de la soumission'); // Debug
    try {
      setLoading(true);
      
      // Créer un objet avec seulement les champs définis
      const updateData: any = {};
      if (formData.doctor_id !== undefined) updateData.doctor_id = formData.doctor_id;
      if (formData.scheduled_at !== undefined) updateData.scheduled_at = formData.scheduled_at;
      if (formData.estimated_duration !== undefined) updateData.estimated_duration = formData.estimated_duration;
      if (formData.reason !== undefined) updateData.reason = formData.reason;
      if (formData.insurance_company_id !== undefined) updateData.insurance_company_id = formData.insurance_company_id;
      if (formData.department_id !== undefined) updateData.department_id = formData.department_id;
      if (formData.health_facility_id !== undefined) updateData.health_facility_id = formData.health_facility_id;
      if (formData.appointment_type !== undefined) updateData.appointment_type = formData.appointment_type;
      if (formData.payment_method !== undefined) updateData.payment_method = formData.payment_method;
      if (formData.status !== undefined) updateData.status = formData.status;
      if (formData.is_confirmed_by_patient !== undefined) updateData.is_confirmed_by_patient = formData.is_confirmed_by_patient;
      if (formData.is_active !== undefined) updateData.is_active = formData.is_active;
      
      console.log('Données envoyées pour mise à jour:', updateData);
      const updatedAppointment = await AppointmentService.updateAppointment(appointment.id_, updateData);
      console.log('Mise à jour réussie:', updatedAppointment); // Debug
      toast.success('Rendez-vous mis à jour avec succès');
      onUpdate?.(updatedAppointment);
      onAppointmentUpdated?.(updatedAppointment);
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

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Modifier le rendez-vous
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {loadingData ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-lg">Chargement...</div>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient_id">Patient *</Label>
              <CustomSelect
                options={patientOptions}
                value={appointment?.patient_id || ''}
                placeholder="Patient"
                isDisabled={true}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor_id">Médecin *</Label>
              <CustomSelect
                options={doctorOptions}
                value={formData.doctor_id || null}
                onChange={(value) => handleInputChange('doctor_id', Array.isArray(value) ? value[0] : value as any)}
                placeholder="Sélectionner un médecin"
                isDisabled={loading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_at">Date/Heure *</Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                value={formData.scheduled_at || undefined}
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
                value={formData.estimated_duration || undefined}
                onChange={(e) => handleInputChange('estimated_duration', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment_type">Type de rendez-vous</Label>
              <CustomSelect
                options={[
                  { value: '', label: 'Aucun' },
                  { value: 'ROUTINE_CONSULTATION', label: 'Consultation routine' },
                  { value: 'EMERGENCY_CONSULTATION', label: 'Consultation urgence' },
                  { value: 'FOLLOW_UP', label: 'Suivi' },
                  { value: 'SPECIALIST_CONSULTATION', label: 'Consultation spécialiste' },
                  { value: 'SURGERY', label: 'Chirurgie' },
                  { value: 'IMAGING', label: 'Imagerie' },
                  { value: 'LABORATORY', label: 'Laboratoire' },
                  { value: 'VACCINATION', label: 'Vaccination' },
                  { value: 'PREVENTIVE_CARE', label: 'Soins préventifs' }
                ]}
                value={formData.appointment_type || ''}
                onChange={(value) => handleInputChange('appointment_type', value === '' ? null : value as AppointmentType)}
                placeholder="Sélectionner un type"
                isDisabled={loading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_method">Méthode de paiement</Label>
              <CustomSelect
                options={[
                  { value: '', label: 'Aucune' },
                  { value: 'FREE_OF_CHARGE', label: 'Gratuit' },
                  { value: 'INSURANCE', label: 'Assurance' },
                  { value: 'CASH', label: 'Espèces' },
                  { value: 'CREDIT_CARD', label: 'Carte de crédit' },
                  { value: 'MOBILE_MONEY', label: 'Mobile money' },
                  { value: 'BANK_TRANSFER', label: 'Virement bancaire' }
                ]}
                value={formData.payment_method || ''}
                onChange={(value) => handleInputChange('payment_method', value === '' ? null : value as PaymentMethod)}
                placeholder="Sélectionner une méthode"
                isDisabled={loading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="health_facility_id">Établissement</Label>
              <HealthFacilitySelect
                value={formData.health_facility_id || undefined}
                onChange={(value) => handleInputChange('health_facility_id', value)}
                placeholder="Sélectionner un établissement de santé"
                disabled={loading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department_id">Département</Label>
              <DepartmentSelect
                value={formData.department_id || undefined}
                onChange={(value) => handleInputChange('department_id', value)}
                placeholder="Sélectionner un département"
                disabled={loading}
                healthFacilityId={formData.health_facility_id}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurance_company_id">Compagnie d'assurance</Label>
              <InsuranceCompanySelect
                value={formData.insurance_company_id || undefined}
                onChange={(value) => handleInputChange('insurance_company_id', value)}
                placeholder="Sélectionner une compagnie d'assurance"
                disabled={loading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <CustomSelect
                options={[
                  { value: 'scheduled', label: 'Programmé' },
                  { value: 'confirmed', label: 'Confirmé' },
                  { value: 'cancelled', label: 'Annulé' },
                  { value: 'completed', label: 'Terminé' },
                  { value: 'no_show', label: 'Non présenté' },
                  { value: 'rescheduled', label: 'Reprogrammé' }
                ]}
                value={formData.status || ''}
                onChange={(value) => handleInputChange('status', value as AppointmentStatus)}
                placeholder="Sélectionner un statut"
                isDisabled={loading}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Raison</Label>
            <Textarea
              id="reason"
              value={formData.reason || undefined}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="Raison du rendez-vous..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleButtonClick}
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
