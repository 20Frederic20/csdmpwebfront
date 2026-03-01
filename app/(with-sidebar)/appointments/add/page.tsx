"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, Clock, User, FileText } from "lucide-react";
import { toast } from "sonner";
import { useAuthToken } from "@/hooks/use-auth-token";
import { CreateAppointmentRequest, AppointmentStatus } from "@/features/appointments/types/appointments.types";
import { AppointmentService } from "@/features/appointments/services/appointment.service";
import { Patient } from "@/features/patients";
import { PatientService } from "@/features/patients";
import { HospitalStaff } from "@/features/hospital-staff";
import { HospitalStaffService } from "@/features/hospital-staff";
import CustomSelect from '@/components/ui/custom-select';

export default function AddAppointmentPage() {
  const router = useRouter();
  const { token } = useAuthToken();
  
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<HospitalStaff[]>([]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  
  const [formData, setFormData] = useState<CreateAppointmentRequest>({
    patient_id: "",
    doctor_id: null,
    scheduled_at: "",
    estimated_duration: 30,
    reason: "",
    status: AppointmentStatus.SCHEDULED,
    is_confirmed_by_patient: false,
    is_active: true,
  });

  useEffect(() => {
    loadPatients();
    loadDoctors();
  }, [token]);

  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await PatientService.getPatients({ limit: 50 }, token || undefined);
      setPatients(response.data || []);
    } catch (error: any) {
      console.error('Error loading patients:', error);
      toast.error('Erreur lors du chargement des patients');
    } finally {
      setLoadingPatients(false);
    }
  };

  const loadDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const response = await HospitalStaffService.getHospitalStaff({ limit: 50 }, token || undefined);
      setDoctors(response.data || []);
    } catch (error: any) {
      console.error('Error loading doctors:', error);
      toast.error('Erreur lors du chargement des médecins');
    } finally {
      setLoadingDoctors(false);
    }
  };

  const statusOptions = [
    { value: 'scheduled', label: 'Programmé' },
    { value: 'confirmed', label: 'Confirmé' },
    { value: 'cancelled', label: 'Annulé' },
    { value: 'completed', label: 'Terminé' },
    { value: 'no_show', label: 'Non présenté' },
  ];

  const patientOptions = [
    { value: '', label: 'Sélectionner un patient' },
    ...patients.map((patient) => ({
      value: patient.id_,
      label: `${patient.given_name} ${patient.family_name}`
    }))
  ];

  const doctorOptions = [
    { value: '', label: 'Aucun médecin' },
    ...doctors.map((doctor) => ({
      value: doctor.id_,
      label: `Dr. ${doctor.matricule}`
    }))
  ];

  const validateForm = () => {
    const newErrors: Record<string, string | undefined> = {};

    // Validation du patient
    if (!formData.patient_id) {
      newErrors.patient_id = "";
    }

    // Validation de la date
    if (!formData.scheduled_at) {
      newErrors.scheduled_at = "";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        ...formData,
        scheduled_at: new Date(formData.scheduled_at).toISOString(),
      };

      await AppointmentService.createAppointment(appointmentData);
      toast.success("Rendez-vous créé avec succès");
      router.push('/appointments');
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      toast.error(error.message || "Erreur lors de la création du rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[] | null) => {
    const actualValue = (value === '' || value === null) ? null : value;
    setFormData(prev => ({
      ...prev,
      [field]: actualValue
    }));
    
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (errors[field as keyof typeof errors] !== undefined) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNumberChange = (field: string, value: string) => {
    const numValue = value === '' ? null : parseInt(value);
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleBooleanChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  // Format date for input datetime-local
  const formatDateTimeForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Get min date (current datetime)
  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => router.push('/appointments')}
          className="cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouveau rendez-vous</h1>
          <p className="text-muted-foreground">
            Créer un nouveau rendez-vous médical
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations principales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informations principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="patient_id">Patient <span className="text-red-500">*</span></Label>
                <CustomSelect
                  options={patientOptions}
                  value={formData.patient_id || ""}
                  onChange={(value) => {
                    handleInputChange('patient_id', value);
                  }}
                  placeholder="Sélectionner un patient"
                  isLoading={loadingPatients}
                  className={`w-full h-12 ${errors.patient_id !== undefined ? 'border-red-500 focus:border-red-500' : ''}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor_id">Médecin</Label>
                <CustomSelect
                  options={doctorOptions}
                  value={formData.doctor_id || ""}
                  onChange={(value) => handleInputChange('doctor_id', value)}
                  placeholder="Sélectionner un médecin (optionnel)"
                  isLoading={loadingDoctors}
                  className="w-full h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduled_at">Date et heure <span className="text-red-500">*</span></Label>
                <Input
                  id="scheduled_at"
                  type="datetime-local"
                  value={formatDateTimeForInput(formData.scheduled_at)}
                  onChange={(e) => {
                    handleInputChange('scheduled_at', e.target.value);
                  }}
                  min={getMinDateTime()}
                  className={`h-12 ${errors.scheduled_at !== undefined ? 'border-red-500 focus:border-red-500' : ''}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_duration">Durée estimée (minutes)</Label>
                <Input
                  id="estimated_duration"
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  value={formData.estimated_duration || ""}
                  onChange={(e) => handleNumberChange('estimated_duration', e.target.value)}
                  placeholder="30"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <CustomSelect
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                  placeholder="Sélectionner un statut"
                  className="w-full h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motif */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Motif du rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="reason">Motif</Label>
              <Textarea
                id="reason"
                value={formData.reason || ""}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Décrivez le motif du rendez-vous..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_confirmed_by_patient"
                  checked={formData.is_confirmed_by_patient}
                  onCheckedChange={(checked) => handleBooleanChange('is_confirmed_by_patient', checked as boolean)}
                />
                <Label htmlFor="is_confirmed_by_patient" className="cursor-pointer">
                  Confirmé par le patient
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleBooleanChange('is_active', checked as boolean)}
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Rendez-vous actif
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/appointments')}
            className="cursor-pointer"
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Création en cours...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Créer le rendez-vous
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
