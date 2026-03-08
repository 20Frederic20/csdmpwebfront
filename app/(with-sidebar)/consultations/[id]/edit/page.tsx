"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomSelect from "@/components/ui/custom-select";
import { Switch } from "@/components/ui/switch";
import { HealthFacilitySelect } from "@/features/health-facilities/components/health-facility-select";
import { DepartmentSelect } from "@/features/departments/components/department-select";
import { InsuranceCompanySelect } from "@/features/insurance-companies/components/insurance-company-select";
import { HospitalStaffSelect } from "@/features/hospital-staff/components/hospital-staff-select";
import { PatientSelect } from "@/features/patients/components/patient-select";
import { PrescriptionsTable } from "@/features/consultations/components/prescriptions-table";
import {
  ArrowLeft,
  Save,
  Activity,
  Shield,
  DollarSign,
  Thermometer,
  Heart,
  Weight,
  Ruler
} from "lucide-react";
import { ConsultationStatus, UpdateConsultationRequest } from "@/features/consultations/types/consultations.types";
import { useConsultation, useUpdateConsultation } from "@/features/consultations/hooks/use-consultations";
import {
  getConsultationStatusOptions,
  formatVitalSigns,
  formatAmount,
} from "@/features/consultations";
import Link from "next/link";

export default function EditConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const consultationId = params.id as string;

  const { data: consultation, isLoading: loading } = useConsultation(consultationId);
  const { mutateAsync: updateConsultation, isPending: saving } = useUpdateConsultation();
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formInitialized, setFormInitialized] = useState(false);

  const [formData, setFormData] = useState<UpdateConsultationRequest>({
    patient_id: undefined,
    chief_complaint: "",
    insurance_company_id: undefined,
    health_facility_id: undefined,
    department_id: undefined,
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
    follow_up_date: "",
    status: ConsultationStatus.SCHEDULED,
    billing_code: "",
    amount_paid: undefined,
    is_confidential: false,
    prescriptions: [],
  });

  // Pre-fill form from fetched consultation data (once)
  useEffect(() => {
    if (consultation && !formInitialized) {
      setFormData({
        patient_id: consultation.patient_id,
        chief_complaint: consultation.chief_complaint || "",
        insurance_company_id: consultation.insurance_company_id,
        health_facility_id: consultation.health_facility_id,
        department_id: consultation.department_id,
        physical_examination: consultation.physical_examination || "",
        triage_by_id: consultation.triage_by_id,
        consulted_by_id: consultation.consulted_by_id,
        parent_consultation_id: consultation.parent_consultation_id,
        other_symptoms: consultation.other_symptoms || "",
        vital_signs: consultation.vital_signs || {
          temperature: undefined, pulse: undefined, systolic_bp: undefined,
          diastolic_bp: undefined, weight: undefined, height: undefined,
        },
        diagnosis: consultation.diagnosis || "",
        treatment_plan: consultation.treatment_plan || "",
        follow_up_notes: consultation.follow_up_notes || "",
        follow_up_date: consultation.follow_up_date || "",
        status: consultation.status || ConsultationStatus.SCHEDULED,
        billing_code: consultation.billing_code || "",
        amount_paid: consultation.amount_paid,
        is_confidential: consultation.is_confidential || false,
      });
      setFormInitialized(true);
    }
  }, [consultation, formInitialized]);

  const handleInputChange = (field: string, value: string | number | boolean | null | undefined | Record<string, unknown> | unknown[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Effacer l'erreur du champ quand l'utilisateur modifie la valeur
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleVitalSignsChange = (field: string, value: string) => {
    const numValue = value === "" ? null : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      vital_signs: {
        ...prev.vital_signs,
        [field]: numValue
      }
    }));
    // Effacer l'erreur du champ quand l'utilisateur modifie la valeur
    const fieldName = `vital_signs.${field}`;
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFieldErrors({});

    try {
      setErrors([]);

      const updateData: UpdateConsultationRequest = {
        chief_complaint: formData.chief_complaint || "",
        other_symptoms: formData.other_symptoms || undefined,
        diagnosis: formData.diagnosis || undefined,
        treatment_plan: formData.treatment_plan || undefined,
        follow_up_notes: formData.follow_up_notes || undefined,
        follow_up_date: formData.follow_up_date || undefined,
        status: formData.status || ConsultationStatus.SCHEDULED,
        billing_code: formData.billing_code || undefined,
        amount_paid: formData.amount_paid ?? undefined,
        is_confidential: formData.is_confidential || false,
        prescriptions: formData.prescriptions || [],
        vital_signs: {
          temperature: formData.vital_signs?.temperature ?? undefined,
          pulse: formData.vital_signs?.pulse ?? undefined,
          systolic_bp: formData.vital_signs?.systolic_bp ?? undefined,
          diastolic_bp: formData.vital_signs?.diastolic_bp ?? undefined,
          weight: formData.vital_signs?.weight ?? undefined,
          height: formData.vital_signs?.height ?? undefined,
        }
      };

      await updateConsultation({ id: consultationId, data: updateData });
      router.push('/consultations');
    } catch {
      // Handled by hook
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Chargement de la consultation...</p>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Consultation non trouvée</h3>
          <Link href="/consultations">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modifier la consultation</h1>
          <p className="text-muted-foreground">
            Patient: {consultation.patient_id} | ID: {consultation.id_}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Informations principales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient_id">Patient *</Label>
                <PatientSelect
                  value={formData.patient_id}
                  onChange={(value) => handleInputChange('patient_id', value)}
                  placeholder="Sélectionner un patient"
                  disabled={saving}
                  required={true}
                  className="w-full"
                />
                {fieldErrors['patient_id'] && (
                  <p className="text-sm text-red-600 mt-1">
                    {fieldErrors['patient_id']}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="chief_complaint">Motif principal *</Label>
                <Textarea
                  id="chief_complaint"
                  value={formData.chief_complaint}
                  onChange={(e) => handleInputChange('chief_complaint', e.target.value)}
                  placeholder="Décrivez le motif principal de la consultation..."
                  rows={3}
                  required
                  className={fieldErrors['chief_complaint'] ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {fieldErrors['chief_complaint'] && (
                  <p className="text-sm text-red-600 mt-1">
                    {fieldErrors['chief_complaint']}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="other_symptoms">Autres symptômes</Label>
                <Textarea
                  id="other_symptoms"
                  value={formData.other_symptoms || ""}
                  onChange={(e) => handleInputChange('other_symptoms', e.target.value)}
                  placeholder="Autres symptômes ou observations..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <CustomSelect
                  options={getConsultationStatusOptions()}
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value as string)}
                  placeholder="Sélectionner un statut"
                  height="h-12"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_confidential"
                  checked={formData.is_confidential || false}
                  onCheckedChange={(checked) => handleInputChange('is_confidential', checked)}
                />
                <Label htmlFor="is_confidential" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Consultation confidentielle
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Localisation et assurance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Localisation et assurance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="health_facility_id">Établissement de santé</Label>
                <HealthFacilitySelect
                  value={formData.health_facility_id}
                  onChange={(value) => handleInputChange('health_facility_id', value)}
                  placeholder="Sélectionner un établissement"
                  disabled={saving}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department_id">Département</Label>
                <DepartmentSelect
                  value={formData.department_id}
                  onChange={(value) => handleInputChange('department_id', value)}
                  placeholder="Sélectionner un département"
                  disabled={saving}
                  healthFacilityId={formData.health_facility_id}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurance_company_id">Compagnie d'assurance</Label>
                <InsuranceCompanySelect
                  value={formData.insurance_company_id || undefined}
                  onChange={(value) => handleInputChange('insurance_company_id', value)}
                  placeholder="Sélectionner une compagnie"
                  disabled={saving}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Signes vitaux */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Signes vitaux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    Température (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.vital_signs?.temperature || ""}
                    onChange={(e) => handleVitalSignsChange('temperature', e.target.value)}
                    placeholder="37.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pulse">Pouls (bpm)</Label>
                  <Input
                    id="pulse"
                    type="number"
                    value={formData.vital_signs?.pulse || ""}
                    onChange={(e) => handleVitalSignsChange('pulse', e.target.value)}
                    placeholder="70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systolic_bp">Tension systolique (mmHg)</Label>
                  <Input
                    id="systolic_bp"
                    type="number"
                    value={formData.vital_signs?.systolic_bp || ""}
                    onChange={(e) => handleVitalSignsChange('systolic_bp', e.target.value)}
                    placeholder="120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diastolic_bp">Tension diastolique (mmHg)</Label>
                  <Input
                    id="diastolic_bp"
                    type="number"
                    value={formData.vital_signs?.diastolic_bp || ""}
                    onChange={(e) => handleVitalSignsChange('diastolic_bp', e.target.value)}
                    placeholder="80"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center gap-2">
                    <Weight className="h-4 w-4" />
                    Poids (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.vital_signs?.weight || ""}
                    onChange={(e) => handleVitalSignsChange('weight', e.target.value)}
                    placeholder="70.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    Taille (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.vital_signs?.height || ""}
                    onChange={(e) => handleVitalSignsChange('height', e.target.value)}
                    placeholder="170"
                  />
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                {formatVitalSigns(formData.vital_signs)}
              </div>
            </CardContent>
          </Card>

          {/* Personnel médical */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Personnel médical
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="triage_by_id">Triage par</Label>
                <HospitalStaffSelect
                  value={formData.triage_by_id || undefined}
                  onChange={(value) => handleInputChange('triage_by_id', value)}
                  placeholder="Sélectionner le personnel de triage"
                  disabled={saving}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consulted_by_id">Consulté par</Label>
                <HospitalStaffSelect
                  value={formData.consulted_by_id || undefined}
                  onChange={(value) => handleInputChange('consulted_by_id', value)}
                  placeholder="Sélectionner le médecin consultant"
                  disabled={saving}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Examen physique */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Examen physique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="physical_examination">Examen physique</Label>
                <Textarea
                  id="physical_examination"
                  value={formData.physical_examination || ""}
                  onChange={(e) => handleInputChange('physical_examination', e.target.value)}
                  placeholder="Résultats de l'examen physique..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Diagnostic et traitement */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic et traitement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnostic</Label>
                <Textarea
                  id="diagnosis"
                  value={formData.diagnosis || ""}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  placeholder="Diagnostic établi..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment_plan">Plan de traitement</Label>
                <Textarea
                  id="treatment_plan"
                  value={formData.treatment_plan || ""}
                  onChange={(e) => handleInputChange('treatment_plan', e.target.value)}
                  placeholder="Plan de traitement prescrit..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="follow_up_notes">Notes de suivi</Label>
                <Textarea
                  id="follow_up_notes"
                  value={formData.follow_up_notes || ""}
                  onChange={(e) => handleInputChange('follow_up_notes', e.target.value)}
                  placeholder="Instructions pour le suivi..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="follow_up_date">Date de suivi</Label>
                <Input
                  id="follow_up_date"
                  type="date"
                  value={formData.follow_up_date || ""}
                  onChange={(e) => handleInputChange('follow_up_date', e.target.value)}
                  className={fieldErrors['follow_up_date'] ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {fieldErrors['follow_up_date'] && (
                  <p className="text-sm text-red-600 mt-1">
                    {fieldErrors['follow_up_date']}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Prescriptions médicales */}
          <PrescriptionsTable
            prescriptions={formData.prescriptions || []}
            onChange={(prescriptions) => handleInputChange('prescriptions', prescriptions)}
            disabled={saving}
          />

          {/* Facturation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Facturation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="billing_code">Code de facturation</Label>
                <Input
                  id="billing_code"
                  value={formData.billing_code || ""}
                  onChange={(e) => handleInputChange('billing_code', e.target.value)}
                  placeholder="Code de facturation..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount_paid">Montant payé (XOF)</Label>
                <Input
                  id="amount_paid"
                  type="number"
                  value={formData.amount_paid || ""}
                  onChange={(e) => handleInputChange('amount_paid', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="0"
                />
              </div>

              {formData.amount_paid && (
                <div className="text-sm text-muted-foreground">
                  Montant formaté: {formatAmount(formData.amount_paid)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Erreurs de validation */}
        {errors.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-600">
                    • {error}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8">
          <Link href="/consultations">
            <Button variant="outline" type="button">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>
    </div>
  );
}
