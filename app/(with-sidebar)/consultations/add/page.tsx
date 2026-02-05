"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Loader2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { CreateConsultationRequest, VitalSigns } from "@/features/consultations";
import { ConsultationService } from "@/features/consultations";
import { useAuthToken } from "@/hooks/use-auth-token";
import { Patient, PatientsQueryParams } from "@/features/patients";
import { PatientService } from "@/features/patients";
import { User, ListUsersQueryParams } from "@/features/users";
import { UserService } from "@/features/users";
import { HospitalStaff, ListHospitalStaffQueryParams } from "@/features/hospital-staff";
import { HospitalStaffService } from "@/features/hospital-staff";
import CustomSelect from '@/components/ui/custom-select';

export default function AddConsultationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [hospitalStaff, setHospitalStaff] = useState<HospitalStaff[]>([]);
  
  const [formData, setFormData] = useState<CreateConsultationRequest>({
    patient_id: "",
    chief_complaint: "",
    triage_by_id: null,
    consulted_by_id: null,
    parent_consultation_id: null,
    other_symptoms: "",
    vital_signs: {
      temperature: null,
      pulse: null,
      systolic_bp: null,
      diastolic_bp: null,
      weight: null,
      height: null,
    },
    diagnosis: "",
    treatment_plan: "",
    follow_up_notes: "",
    follow_up_date: null,
    status: "scheduled",
    billing_code: "",
    amount_paid: null,
    is_confidential: false,
  });
  
  const { token } = useAuthToken();

  // Convertir les patients en options pour CustomSelect
  const patientOptions = [
    { value: '', label: 'Sélectionner un patient' },
    ...patients.map((patient) => ({
      value: patient.id_,
      label: `${patient.given_name} ${patient.family_name} (${patient.id_})`
    }))
  ];

  // Convertir le personnel hospitalier en options pour CustomSelect
  const staffOptions = [
    { value: '', label: 'Aucun' },
    ...hospitalStaff.map((staff) => ({
      value: staff.id_,
      label: `${staff.matricule} (${staff.id_})`
    }))
  ];

  // Options pour le statut de consultation
  const statusOptions = [
    { value: 'scheduled', label: 'Planifiée' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminée' },
    { value: 'cancelled', label: 'Annulée' },
    { value: 'no_show', label: 'Absent' }
  ];

  // Charger tous les patients actifs au démarrage
  useEffect(() => {
    const loadPatients = async () => {
      setLoadingPatients(true);
      try {
        const params: PatientsQueryParams = {
          limit: 50, // Plus de résultats pour la recherche
        };
        console.log('Loading patients with params:', params);
        const response = await PatientService.getPatients(params, token || undefined);
        console.log('Patients response:', response);
        // La réponse utilise 'patients' comme clé, pas 'data'
        setPatients(response.data || []);
      } catch (error) {
        console.error('Error loading patients:', error);
        toast.error('Erreur lors du chargement des patients');
      } finally {
        setLoadingPatients(false);
      }
    };

    loadPatients();
  }, [token]);

  // Charger tous les utilisateurs actifs au démarrage
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const params: ListUsersQueryParams = {
          limit: 50, // Plus de résultats pour la recherche
          is_active: true,
        };
        const response = await UserService.getUsers(params, token || undefined);
        setUsers(response.data || []);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Erreur lors du chargement des utilisateurs');
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [token]);

  // Charger tout le personnel hospitalier actif au démarrage
  useEffect(() => {
    const loadHospitalStaff = async () => {
      setLoadingStaff(true);
      try {
        const params: ListHospitalStaffQueryParams = {
          limit: 50, // Plus de résultats pour la recherche
          is_active: true,
        };
        const response = await HospitalStaffService.getHospitalStaff(params, token || undefined);
        setHospitalStaff(response.data || []);
      } catch (error) {
        console.error('Error loading hospital staff:', error);
        toast.error('Erreur lors du chargement du personnel hospitalier');
      } finally {
        setLoadingStaff(false);
      }
    };

    loadHospitalStaff();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patient_id) {
      toast.error("Le patient est requis");
      return;
    }
    if (!formData.chief_complaint.trim()) {
      toast.error("Le motif principal est requis");
      return;
    }

    setLoading(true);
    try {
      await ConsultationService.createConsultation(formData, token || undefined);
      toast.success("Consultation créée avec succès");
      router.push('/consultations');
    } catch (error: any) {
      console.error('Error creating consultation:', error);
      toast.error(error.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
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

  const handleNumberChange = (field: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [field]: numValue
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

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id_ === patientId);
    if (patient) {
      return `${patient.given_name} ${patient.family_name}`;
    }
    return patientId;
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id_ === userId);
    if (user) {
      return `${user.given_name} ${user.family_name}`;
    }
    return userId;
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
                <Label htmlFor="patient_id" className="text-red-500">Patient *</Label>
                <CustomSelect
                  options={patientOptions}
                  value={formData.patient_id || ""}
                  onChange={(value) => handleInputChange('patient_id', value)}
                  placeholder="Sélectionner un patient"
                  isLoading={loadingPatients}
                  className="w-full h-12"
                />
              </div>
            </div>
            <div className="md:col-span-2 mt-6">
              <Label htmlFor="chief_complaint" className="text-red-500">Motif principal *</Label>
              <Textarea
                id="chief_complaint"
                value={formData.chief_complaint}
                onChange={(e) => handleInputChangeTrim('chief_complaint', e.target.value)}
                placeholder="Décrivez le motif principal de la consultation..."
                rows={6}
                required
              />
            </div>
            <div className="md:col-span-2 mt-6">
              <Label htmlFor="other_symptoms">Autres symptômes</Label>
              <Textarea
                id="other_symptoms"
                value={formData.other_symptoms || ""}
                onChange={(e) => handleInputChangeTrim('other_symptoms', e.target.value)}
                placeholder="Décrivez d'autres symptômes observés..."
                rows={5}
              />
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
                <CustomSelect
                  options={staffOptions}
                  value={formData.triage_by_id || ""}
                  onChange={(value) => handleInputChange('triage_by_id', value)}
                  placeholder="Sélectionner un membre du personnel"
                  isLoading={loadingStaff}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consulted_by_id">Consulté par</Label>
                <CustomSelect
                  options={staffOptions}
                  value={formData.consulted_by_id || ""}
                  onChange={(value) => handleInputChange('consulted_by_id', value)}
                  placeholder="Sélectionner un membre du personnel"
                  isLoading={loadingStaff}
                  className="h-12"
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
                  onChange={(e) => handleInputChangeTrim('diagnosis', e.target.value)}
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
                  onChange={(e) => handleInputChangeTrim('follow_up_notes', e.target.value)}
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

        {/* Informations de facturation */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de facturation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="billing_code">Code de facturation</Label>
                <Input
                  id="billing_code"
                  value={formData.billing_code || ""}
                  onChange={(e) => handleInputChangeTrim('billing_code', e.target.value)}
                  placeholder="Code de facturation..."
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount_paid">Montant payé (XOF)</Label>
                <Input
                  id="amount_paid"
                  type="number"
                  value={formData.amount_paid || ""}
                  onChange={(e) => handleNumberChange('amount_paid', e.target.value)}
                  placeholder="0"
                  className="h-12"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_confidential"
                    checked={formData.is_confidential || false}
                    onCheckedChange={(checked: boolean) => handleBooleanChange('is_confidential', checked)}
                  />
                  <Label htmlFor="is_confidential">Consultation confidentielle</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2 pt-6">
              <Label htmlFor="status">Statut</Label>
              <CustomSelect
                options={statusOptions}
                value={formData.status}
                onChange={(value) => handleInputChange('status', value)}
                placeholder="Sélectionner un statut"
                className="h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/consultations')}
                className="cursor-pointer"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Création..." : "Créer la consultation"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
