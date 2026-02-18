"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomSelect from "@/components/ui/custom-select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import { Consultation, ConsultationResponse, UpdateConsultationRequest } from "@/features/consultations";
import { ConsultationService } from "@/features/consultations";
import { useAuthToken } from "@/hooks/use-auth-token";
import { 
  getConsultationStatusLabel, 
  getConsultationStatusOptions,
  formatVitalSigns,
  formatAmount,
  validateConsultationData
} from "@/features/consultations";
import { toast } from "sonner";
import Link from "next/link";

export default function EditConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthToken();
  const consultationId = params.id as string;

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Formulaire
  const [formData, setFormData] = useState<UpdateConsultationRequest>({
    chief_complaint: "",
    other_symptoms: "",
    diagnosis: "",
    treatment_plan: "",
    follow_up_notes: "",
    follow_up_date: "",
    status: "scheduled",
    billing_code: "",
    amount_paid: null,
    is_confidential: false,
    vital_signs: {
      temperature: null,
      pulse: null,
      systolic_bp: null,
      diastolic_bp: null,
      weight: null,
      height: null,
    }
  });

  const loadConsultation = async () => {
    try {
      setLoading(true);
      const data = await ConsultationService.getConsultationById(consultationId);
      setConsultation(data);
      
      // Pré-remplir le formulaire avec les données existantes
      setFormData({
        chief_complaint: data.chief_complaint || "",
        other_symptoms: data.other_symptoms || "",
        diagnosis: data.diagnosis || "",
        treatment_plan: data.treatment_plan || "",
        follow_up_notes: data.follow_up_notes || "",
        follow_up_date: data.follow_up_date || "",
        status: data.status || "scheduled",
        billing_code: data.billing_code || "",
        amount_paid: data.amount_paid || null,
        is_confidential: data.is_confidential || false,
        vital_signs: data.vital_signs || {
          temperature: null,
          pulse: null,
          systolic_bp: null,
          diastolic_bp: null,
          weight: null,
          height: null,
        }
      });
    } catch (error) {
      console.error('Error loading consultation:', error);
      toast.error('Erreur lors du chargement de la consultation');
      router.push('/consultations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (consultationId && token) {
      loadConsultation();
    }
  }, [consultationId, token]);

  const handleInputChange = (field: string, value: any) => {
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
    
    // Réinitialiser les erreurs de champs
    setFieldErrors({});
    
    try {
      setSaving(true);
      setErrors([]);
      
      const updateData: UpdateConsultationRequest = {
        chief_complaint: formData.chief_complaint || null,
        other_symptoms: formData.other_symptoms || null,
        diagnosis: formData.diagnosis || null,
        treatment_plan: formData.treatment_plan || null,
        follow_up_notes: formData.follow_up_notes || null,
        follow_up_date: formData.follow_up_date || null,
        status: formData.status || "scheduled",
        billing_code: formData.billing_code || null,
        amount_paid: formData.amount_paid === null ? null : formData.amount_paid,
        is_confidential: formData.is_confidential || false,
        vital_signs: {
          temperature: formData.vital_signs?.temperature || null,
          pulse: formData.vital_signs?.pulse || null,
          systolic_bp: formData.vital_signs?.systolic_bp || null,
          diastolic_bp: formData.vital_signs?.diastolic_bp || null,
          weight: formData.vital_signs?.weight || null,
          height: formData.vital_signs?.height || null,
        }
      };

      const updatedConsultation = await ConsultationService.updateConsultation(consultationId, updateData);
      
      toast.success('Consultation mise à jour avec succès');
      router.push('/consultations');
    } catch (error: any) {
      console.error('Error updating consultation:', error);
      
      // Extraire et afficher les erreurs de champ spécifiques
      if (error?.detail && Array.isArray(error.detail)) {
        const newFieldErrors: Record<string, string> = {};
        const generalErrors: string[] = [];
        
        error.detail.forEach((err: any) => {
          if (err.loc && Array.isArray(err.loc) && err.loc.length >= 2) {
            const fieldName = err.loc[1]; // Le champ est en deuxième position
            newFieldErrors[fieldName] = err.msg;
          } else {
            generalErrors.push(err.msg);
          }
        });
        
        setFieldErrors(newFieldErrors);
        setErrors(generalErrors);
      } else {
        setErrors(['Erreur lors de la mise à jour de la consultation']);
      }
      
      toast.error('Veuillez corriger les erreurs dans le formulaire');
    } finally {
      setSaving(false);
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
                  value={formData.other_symptoms}
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
                  checked={formData.is_confidential}
                  onCheckedChange={(checked) => handleInputChange('is_confidential', checked)}
                />
                <Label htmlFor="is_confidential" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Consultation confidentielle
                </Label>
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
                  value={formData.diagnosis}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  placeholder="Diagnostic établi..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment_plan">Plan de traitement</Label>
                <Textarea
                  id="treatment_plan"
                  value={formData.treatment_plan}
                  onChange={(e) => handleInputChange('treatment_plan', e.target.value)}
                  placeholder="Plan de traitement prescrit..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="follow_up_notes">Notes de suivi</Label>
                <Textarea
                  id="follow_up_notes"
                  value={formData.follow_up_notes}
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
                  value={formData.follow_up_date}
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
                  value={formData.billing_code}
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
