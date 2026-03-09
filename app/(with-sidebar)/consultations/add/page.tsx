"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save } from "lucide-react";
import { CreateConsultationRequest, ConsultationStatus, VitalSigns } from "@/features/consultations/types/consultations.types";
import { useCreateConsultation } from "@/features/consultations/hooks/use-consultations";
import CustomSelect from '@/components/ui/custom-select';
import { HealthFacilitySelect } from "@/features/health-facilities/components/health-facility-select";
import { DepartmentSelect } from "@/features/departments/components/department-select";
import { HospitalStaffSelect } from "@/features/hospital-staff/components/hospital-staff-select";
import { PatientSelect } from "@/features/patients/components/patient-select";
import { usePermissionsContext } from "@/contexts/permissions-context";

export default function AddConsultationPage() {
  const router = useRouter();
  const { mutateAsync: createConsultation, isPending: loading } = useCreateConsultation();
  const { user } = usePermissionsContext();
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const [formData, setFormData] = useState<CreateConsultationRequest>({
    patient_id: "",
    chief_complaint: "",
    health_facility_id: "",
    department_id: "",
    physical_examination: "",
    triage_by_id: undefined,
    consulted_by_id: undefined,
    parent_consultation_id: undefined,
    other_symptoms: "",
    vital_signs: {
      temperature: undefined,
      pulse: undefined,
      systolic_bp: undefined,
      diastolic_bp: undefined,
      weight: undefined,
      height: undefined,
    },
    diagnosis: "",
    treatment_plan: "",
    follow_up_notes: "",
    follow_up_date: undefined,
    status: ConsultationStatus.SCHEDULED,
    is_confidential: false,
  });


  // Options pour le statut de consultation
  const statusOptions = [
    { value: 'scheduled', label: 'Planifiée' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminée' },
    { value: 'cancelled', label: 'Annulée' },
    { value: 'no_show', label: 'Absent' }
  ];


  // Injecter automatiquement l'établissement de santé si l'utilisateur y est rattaché
  useEffect(() => {
    if (user?.health_facility_id && !formData.health_facility_id) {
      // eslint-disable-next-line
      setFormData(prev => ({
        ...prev,
        health_facility_id: user.health_facility_id || ""
      }));
    }
  }, [user, formData.health_facility_id]);

  const validateForm = () => {
    const newErrors: Record<string, string | undefined> = {};

    // Validation du patient
    if (!formData.patient_id) {
      newErrors.patient_id = "";
    }

    // Validation du motif principal
    if (!formData.chief_complaint || formData.chief_complaint.trim() === '') {
      newErrors.chief_complaint = "";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createConsultation(formData);
      router.push('/consultations');
    } catch {
      // Handled by hook
    }
  };

  const handleInputChange = (field: string, value: string | string[] | null) => {
    // Convertir les valeurs vides en null pour les champs optionnels
    const actualValue = (value === '' || value === null) ? null : value;
    setFormData(prev => ({
      ...prev,
      [field]: actualValue
    }));
  };

  const handleInputChangeTrim = (field: string, value: string) => {
    // Pour les champs texte: si vide après trim, envoyer null, sinon envoyer la valeur trimée
    const trimmedValue = value.trim();
    const actualValue = trimmedValue === '' ? null : trimmedValue;
    setFormData(prev => ({
      ...prev,
      [field]: actualValue
    }));
  };

  const handleBooleanChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVitalSignChange = (field: keyof VitalSigns, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      vital_signs: {
        ...prev.vital_signs,
        [field]: numValue
      }
    }));
  };


  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/consultations')}
          className="cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouvelle consultation</h1>
          <p className="text-muted-foreground">
            Créer une nouvelle consultation médicale
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations principales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations principales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="patient_id">Patient <span className="text-red-500">*</span></Label>
                <PatientSelect
                  value={formData.patient_id}
                  onChange={(value) => {
                    handleInputChange('patient_id', value || '');
                    // Effacer l'erreur quand l'utilisateur sélectionne un patient
                    if (errors.patient_id !== undefined) {
                      setErrors(prev => ({ ...prev, patient_id: undefined }));
                    }
                  }}
                  placeholder="Sélectionner un patient"
                  disabled={loading}
                  required={true}
                  className={`w-full ${errors.patient_id !== undefined ? 'border-red-500 focus:border-red-500' : ''}`}
                />
              </div>
            </div>
            <div className="md:col-span-2 mt-6">
              <Label htmlFor="chief_complaint">Motif principal <span className="text-red-500">*</span></Label>
              <Textarea
                id="chief_complaint"
                value={formData.chief_complaint}
                onChange={(e) => {
                  handleInputChange('chief_complaint', e.target.value);
                  // Effacer l'erreur quand l'utilisateur tape
                  if (errors.chief_complaint !== undefined) {
                    setErrors(prev => ({ ...prev, chief_complaint: undefined }));
                  }
                }}
                placeholder="Décrivez le motif principal de la consultation..."
                rows={6}
                required
                className={errors.chief_complaint !== undefined ? 'border-red-500 focus:border-red-500' : ''}
              />
            </div>
            <div className="md:col-span-2 mt-6">
              <Label htmlFor="other_symptoms">Autres symptômes</Label>
              <Textarea
                id="other_symptoms"
                value={formData.other_symptoms || ""}
                onChange={(e) => handleInputChange('other_symptoms', e.target.value)}
                placeholder="Décrivez d'autres symptômes observés..."
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Informations de localisation */}
        <Card>
          <CardHeader>
            <CardTitle>Localisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="health_facility_id">Établissement de santé</Label>
                <HealthFacilitySelect
                  value={formData.health_facility_id}
                  onChange={(value) => {
                    handleInputChange('health_facility_id', value);
                    handleInputChange('department_id', "");
                    handleInputChange('triage_by_id', "");
                    handleInputChange('consulted_by_id', "");
                  }}
                  placeholder="Sélectionner un établissement"
                  disabled={loading}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department_id">Département</Label>
                <DepartmentSelect
                  value={formData.department_id}
                  onChange={(value) => handleInputChange('department_id', value)}
                  placeholder="Sélectionner un département"
                  disabled={loading}
                  healthFacilityId={formData.health_facility_id}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signes vitaux */}
        <Card>
          <CardHeader>
            <CardTitle>Signes vitaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Température (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.vital_signs?.temperature || ""}
                  onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
                  placeholder="37.0"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pulse">Pouls (bpm)</Label>
                <Input
                  id="pulse"
                  type="number"
                  value={formData.vital_signs?.pulse || ""}
                  onChange={(e) => handleVitalSignChange('pulse', e.target.value)}
                  placeholder="70"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systolic_bp">Tension systolique</Label>
                <Input
                  id="systolic_bp"
                  type="number"
                  value={formData.vital_signs?.systolic_bp || ""}
                  onChange={(e) => handleVitalSignChange('systolic_bp', e.target.value)}
                  placeholder="120"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diastolic_bp">Tension diastolique</Label>
                <Input
                  id="diastolic_bp"
                  type="number"
                  value={formData.vital_signs?.diastolic_bp || ""}
                  onChange={(e) => handleVitalSignChange('diastolic_bp', e.target.value)}
                  placeholder="80"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.vital_signs?.weight || ""}
                  onChange={(e) => handleVitalSignChange('weight', e.target.value)}
                  placeholder="70.0"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Taille (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.vital_signs?.height || ""}
                  onChange={(e) => handleVitalSignChange('height', e.target.value)}
                  placeholder="170"
                  className="h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personnel médical */}
        <Card>
          <CardHeader>
            <CardTitle>Personnel médical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="triage_by_id">Triage par</Label>
                <HospitalStaffSelect
                  value={formData.triage_by_id || ""}
                  onChange={(value) => handleInputChange('triage_by_id', value)}
                  placeholder="Sélectionner un membre du personnel"
                  disabled={loading}
                  healthFacilityId={formData.health_facility_id}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consulted_by_id">Consulté par</Label>
                <HospitalStaffSelect
                  value={formData.consulted_by_id || ""}
                  onChange={(value) => handleInputChange('consulted_by_id', value)}
                  placeholder="Sélectionner un membre du personnel"
                  disabled={loading}
                  healthFacilityId={formData.health_facility_id}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diagnostic et traitement */}
        <Card>
          <CardHeader>
            <CardTitle>Diagnostic et traitement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnostic</Label>
                <Textarea
                  id="diagnosis"
                  value={formData.diagnosis || ""}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  placeholder="Diagnostic médical..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatment_plan">Plan de traitement</Label>
                <Textarea
                  id="treatment_plan"
                  value={formData.treatment_plan || ""}
                  onChange={(e) => handleInputChangeTrim('treatment_plan', e.target.value)}
                  placeholder="Plan de traitement à suivre..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="follow_up_notes">Notes de suivi</Label>
                <Textarea
                  id="follow_up_notes"
                  value={formData.follow_up_notes || ""}
                  onChange={(e) => handleInputChange('follow_up_notes', e.target.value)}
                  placeholder="Notes pour le suivi..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="follow_up_date">Date de suivi</Label>
                <Input
                  id="follow_up_date"
                  type="date"
                  value={formData.follow_up_date || ""}
                  onChange={(e) => handleInputChangeTrim('follow_up_date', e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statut et confidentialité */}
        <Card>
          <CardHeader>
            <CardTitle>Statut et confidentialité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_confidential"
                  checked={formData.is_confidential || false}
                  onCheckedChange={(checked: boolean) => handleBooleanChange('is_confidential', checked)}
                />
                <Label htmlFor="is_confidential">Consultation confidentielle</Label>
              </div>
              <div className="space-y-2 pt-2">
                <Label htmlFor="status">Statut</Label>
                <CustomSelect
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                  placeholder="Sélectionner un statut"
                  className="h-12"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className=" flex justify-end pt-6">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/consultations')}
                className="cursor-pointer h-12"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer h-12"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Création..." : "Créer la consultation"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
