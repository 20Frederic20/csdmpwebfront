"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { Save, X } from "lucide-react";
import { CreateAppointmentRequest, AppointmentType, PaymentMethod, AppointmentStatus } from "@/features/appointments/types/appointments.types";
import { AppointmentService } from "@/features/appointments/services/appointment.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { HealthFacilitySelect } from "@/components/health-facilities/health-facility-select";
import { DepartmentSelect } from "@/components/departments/department-select";
import { HospitalStaffSelect } from "@/components/hospital-staff/hospital-staff-select";
import { PatientSelect } from "@/components/patients/patient-select";

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentCreated?: (appointment: any) => void;
  defaultPatientId?: string;
}

export function AddAppointmentModal({
  isOpen,
  onClose,
  onAppointmentCreated,
  defaultPatientId = "",
}: AddAppointmentModalProps) {
  const { token } = useAuthToken();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAppointmentRequest>({
    patient_id: defaultPatientId,
    health_facility_id: "",
    department_id: "",
    appointment_type: AppointmentType.ROUTINE_CONSULTATION,
    payment_method: PaymentMethod.FREE_OF_CHARGE,
    doctor_id: null,
    scheduled_at: "",
    estimated_duration: 30,
    reason: null,
    status: AppointmentStatus.SCHEDULED,
    is_confirmed_by_patient: false,
    is_active: true,
  });

  // Options pour les CustomSelect
  const typeOptions = [
    { value: AppointmentType.ROUTINE_CONSULTATION, label: 'Consultation de routine' },
    { value: AppointmentType.EMERGENCY_CONSULTATION, label: 'Consultation d\'urgence' },
    { value: AppointmentType.FOLLOW_UP, label: 'Suivi' },
    { value: AppointmentType.SPECIALIST_CONSULTATION, label: 'Consultation spécialisée' },
    { value: AppointmentType.SURGERY, label: 'Chirurgie' },
    { value: AppointmentType.IMAGING, label: 'Imagerie' },
    { value: AppointmentType.LABORATORY, label: 'Laboratoire' },
    { value: AppointmentType.VACCINATION, label: 'Vaccination' },
    { value: AppointmentType.PREVENTIVE_CARE, label: 'Soins préventifs' },
  ];

  const paymentMethodOptions = [
    { value: PaymentMethod.FREE_OF_CHARGE, label: 'Gratuit' },
    { value: PaymentMethod.INSURANCE, label: 'Assurance' },
    { value: PaymentMethod.CASH, label: 'Espèces' },
    { value: PaymentMethod.CREDIT_CARD, label: 'Carte de crédit' },
    { value: PaymentMethod.MOBILE_MONEY, label: 'Mobile money' },
    { value: PaymentMethod.BANK_TRANSFER, label: 'Virement bancaire' },
  ];

  const handleInputChange = (field: keyof CreateAppointmentRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeChange = (value: string | string[] | null) => {
    handleInputChange('appointment_type', value as AppointmentType);
  };

  const handlePaymentMethodChange = (value: string | string[] | null) => {
    handleInputChange('payment_method', value as PaymentMethod);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patient_id) {
      return;
    }
    
    if (!formData.health_facility_id) {
      return;
    }
    
    if (!formData.department_id) {
      return;
    }

    if (!formData.scheduled_at) {
      return;
    }

    setLoading(true);
    
    try {
      const newAppointment = await AppointmentService.createAppointment(formData);
      onAppointmentCreated?.(newAppointment);
      
      // Reset du formulaire
      setFormData({
        patient_id: defaultPatientId,
        health_facility_id: "",
        department_id: "",
        appointment_type: AppointmentType.ROUTINE_CONSULTATION,
        payment_method: PaymentMethod.FREE_OF_CHARGE,
        doctor_id: "",
        scheduled_at: "",
        estimated_duration: 30,
        reason: "",
        status: AppointmentStatus.SCHEDULED,
        is_confirmed_by_patient: false,
        is_active: true,
      });
      
      onClose();
    } catch (error: any) {
      console.error('Error creating appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Ajouter un rendez-vous
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient */}
            <div className="space-y-2">
              <PatientSelect
                value={formData.patient_id}
                onChange={(value) => handleInputChange('patient_id', value || '')}
                placeholder="Sélectionner un patient"
                disabled={loading}
                required={true}
              />
            </div>

            {/* Établissement de santé */}
            <div className="space-y-2">
              <HealthFacilitySelect
                value={formData.health_facility_id}
                onChange={(value) => handleInputChange('health_facility_id', value)}
                placeholder="Sélectionner un établissement de santé"
                required={true}
                disabled={loading}
              />
            </div>

            {/* Département */}
            <div className="space-y-2">
              <DepartmentSelect
                value={formData.department_id}
                onChange={(value) => handleInputChange('department_id', value || '')}
                placeholder="Sélectionner un département"
                healthFacilityId={formData.health_facility_id}
                disabled={loading}
                required={true}
              />
            </div>

            {/* Docteur */}
            <div className="space-y-2">
              <Label htmlFor="doctor_id">Docteur</Label>
              <HospitalStaffSelect
                value={formData.doctor_id || undefined}
                onChange={(value) => handleInputChange('doctor_id', value || '')}
                placeholder="Sélectionner un docteur"
                healthFacilityId={formData.health_facility_id}
                disabled={loading}
              />
            </div>

            {/* Type de rendez-vous */}
            <div className="space-y-2">
              <Label htmlFor="appointment_type">Type de rendez-vous</Label>
              <CustomSelect
                options={typeOptions}
                value={formData.appointment_type}
                onChange={handleTypeChange}
                placeholder="Sélectionner le type"
                height="h-10"
                isDisabled={loading}
              />
            </div>

            {/* Date et heure */}
            <div className="space-y-2">
              <Label htmlFor="scheduled_at">Date et heure *</Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Durée estimée */}
            <div className="space-y-2">
              <Label htmlFor="estimated_duration">Durée estimée (minutes)</Label>
              <Input
                id="estimated_duration"
                type="number"
                min="5"
                max="480"
                value={formData.estimated_duration || ""}
                onChange={(e) => handleInputChange('estimated_duration', parseInt(e.target.value) || null)}
                placeholder="30"
                disabled={loading}
              />
            </div>

            {/* Méthode de paiement */}
            <div className="space-y-2">
              <Label htmlFor="payment_method">Méthode de paiement</Label>
              <CustomSelect
                options={paymentMethodOptions}
                value={formData.payment_method}
                onChange={handlePaymentMethodChange}
                placeholder="Sélectionner la méthode"
                height="h-10"
                isDisabled={loading}
              />
            </div>

            {/* Raison */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="reason">Raison du rendez-vous</Label>
              <Input
                id="reason"
                value={formData.reason || ""}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Raison ou motif du rendez-vous"
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Créer le rendez-vous
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
