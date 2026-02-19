"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Activity, 
  Shield,
  DollarSign,
  Thermometer,
  Heart,
  Weight,
  Ruler,
  CheckCircle,
  AlertTriangle,
  CheckSquare
} from "lucide-react";
import { Consultation, UpdateConsultationRequest } from "@/features/consultations";
import { ConsultationService } from "@/features/consultations";
import { useAuthToken } from "@/hooks/use-auth-token";
import { 
  getConsultationStatusLabel, 
  getConsultationStatusBadge,
  formatVitalSigns,
  formatAmount,
  formatDate,
  formatDateTime,
  isConsultationActive,
  canDeleteConsultation,
  canRestoreConsultation,
  validateConsultationData
} from "@/features/consultations";
import { toast } from "sonner";
import Link from "next/link";

export default function ViewConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthToken();
  const consultationId = params.id as string;

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [isEditingFields, setIsEditingFields] = useState(false);
  const [formData, setFormData] = useState<UpdateConsultationRequest>({
    diagnosis: "",
    treatment_plan: "",
  });

  const loadConsultation = async () => {
    try {
      setLoading(true);
      const data = await ConsultationService.getConsultationById(consultationId);
      setConsultation(data);
      
      // Pré-remplir le formulaire avec les données existantes
      setFormData({
        diagnosis: data.diagnosis || "",
        treatment_plan: data.treatment_plan || "",
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

  const handleDelete = async () => {
    if (!consultation) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
      return;
    }

    try {
      setDeleting(true);
      await ConsultationService.deleteConsultation(consultation.id_);
      
      // Mettre à jour l'état localement
      setConsultation(prev => prev ? { ...prev, deleted_at: new Date().toISOString() } : null);
      
      toast.success('Consultation supprimée avec succès');
    } catch (error) {
      console.error('Error deleting consultation:', error);
      toast.error('Erreur lors de la suppression de la consultation');
    } finally {
      setDeleting(false);
    }
  };

  const handleRestore = async () => {
    if (!consultation) return;

    try {
      setRestoring(true);
      const restoredConsultation = await ConsultationService.restoreConsultation(consultation.id_);
      setConsultation(restoredConsultation);
      
      toast.success('Consultation restaurée avec succès');
    } catch (error) {
      console.error('Error restoring consultation:', error);
      toast.error('Erreur lors de la restauration de la consultation');
    } finally {
      setRestoring(false);
    }
  };

  const handlePermanentlyDelete = async () => {
    if (!consultation) return;
    
    if (!confirm('ATTENTION: Cette action est irréversible. Êtes-vous sûr de vouloir supprimer définitivement cette consultation ?')) {
      return;
    }

    try {
      setDeleting(true);
      await ConsultationService.permanentlyDeleteConsultation(consultation.id_);
      
      toast.success('Consultation supprimée définitivement');
      router.push('/consultations');
    } catch (error) {
      console.error('Error permanently deleting consultation:', error);
      toast.error('Erreur lors de la suppression définitive de la consultation');
    } finally {
      setDeleting(false);
    }
  };

  const handleComplete = async () => {
    if (!consultation) return;

    // Validation des champs requis
    const validationErrors = validateConsultationData({
      ...consultation,
      diagnosis: formData.diagnosis,
      treatment_plan: formData.treatment_plan,
    });
    
    if (validationErrors.length > 0) {
      toast.error('Veuillez remplir les champs obligatoires pour terminer la consultation');
      
      // Afficher les erreurs spécifiques
      validationErrors.forEach(error => {
        toast.error(error);
      });
      
      return;
    }

    try {
      setCompleting(true);
      
      const updateData = {
        diagnosis: formData.diagnosis || null,
        treatment_plan: formData.treatment_plan || null,
        status: 'completed' as const,
      };

      const updatedConsultation = await ConsultationService.updateConsultation(consultation.id_, updateData);
      setConsultation(updatedConsultation);
      
      toast.success('Consultation terminée avec succès');
    } catch (error) {
      console.error('Error completing consultation:', error);
      toast.error('Erreur lors de la terminaison de la consultation');
    } finally {
      setCompleting(false);
    }
  };

  const handleFieldChange = (field: 'diagnosis' | 'treatment_plan', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveFields = async () => {
    if (!consultation) return;

    try {
      const updateData = {
        diagnosis: formData.diagnosis || null,
        treatment_plan: formData.treatment_plan || null,
      };

      const updatedConsultation = await ConsultationService.updateConsultation(consultation.id_, updateData);
      setConsultation(updatedConsultation);
      
      toast.success('Champs mis à jour avec succès');
    } catch (error) {
      console.error('Error saving fields:', error);
      toast.error('Erreur lors de la mise à jour des champs');
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

  const statusBadge = getConsultationStatusBadge(consultation.status);
  const isActive = isConsultationActive(consultation);
  const canDelete = canDeleteConsultation(consultation);
  const canRestore = canRestoreConsultation(consultation);
  const canComplete = consultation.status !== 'completed' && isActive && !consultation.deleted_at;
  const isCompleted = consultation.status === 'completed';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/consultations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Détails de la consultation</h1>
            <p className="text-muted-foreground">
              Patient: {consultation.patient_id} | ID: {consultation.id_}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/consultations/${consultation.id_}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      {/* Alertes de statut */}
      {!isActive && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                {consultation.deleted_at ? 'Cette consultation a été supprimée' : 'Cette consultation est inactive'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertes de validation */}
      {canComplete && (!consultation.diagnosis || !consultation.treatment_plan) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                Pour terminer cette consultation, veuillez remplir les champs obligatoires : 
                {!consultation.diagnosis && ' Diagnostic'}
                {!consultation.diagnosis && !consultation.treatment_plan && ' et '}
                {!consultation.treatment_plan && ' Plan de traitement'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

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
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Statut</h4>
              <div className="mt-1">
                <Badge 
                  variant={statusBadge.variant as "default" | "secondary" | "destructive" | "outline"}
                  className={statusBadge.className}
                >
                  {getConsultationStatusLabel(consultation.status)}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Motif principal</h4>
              <p className="mt-1 text-sm">{consultation.chief_complaint || 'Non spécifié'}</p>
            </div>

            {consultation.other_symptoms && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Autres symptômes</h4>
                <p className="mt-1 text-sm">{consultation.other_symptoms}</p>
              </div>
            )}

            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Consultation</h4>
              <p className="mt-1 text-sm">
                Consultation du {formatDate(consultation.follow_up_date)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm text-muted-foreground">Confidentialité</h4>
              {consultation.is_confidential && (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-500" />
                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                    Confidentiel
                  </Badge>
                </div>
              )}
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
            <div className="text-sm">
              {formatVitalSigns(consultation.vital_signs)}
            </div>

            {consultation.vital_signs && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                {consultation.vital_signs.temperature && (
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    <span>Température: {consultation.vital_signs.temperature}°C</span>
                  </div>
                )}
                {consultation.vital_signs.pulse && (
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>Pouls: {consultation.vital_signs.pulse} bpm</span>
                  </div>
                )}
                {consultation.vital_signs.systolic_bp && consultation.vital_signs.diastolic_bp && (
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>Tension: {consultation.vital_signs.systolic_bp}/{consultation.vital_signs.diastolic_bp} mmHg</span>
                  </div>
                )}
                {consultation.vital_signs.weight && (
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4" />
                    <span>Poids: {consultation.vital_signs.weight} kg</span>
                  </div>
                )}
                {consultation.vital_signs.height && (
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    <span>Taille: {consultation.vital_signs.height} cm</span>
                  </div>
                )}
              </div>
            )}
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
                onChange={(e) => handleFieldChange('diagnosis', e.target.value)}
                placeholder="Établir le diagnostic..."
                rows={3}
                disabled={isCompleted}
                className={isCompleted ? 'bg-gray-100 text-gray-700 cursor-not-allowed' : ''}
              />
              {isCompleted && (
                <p className="text-sm text-gray-500">La consultation est terminée - ce champ ne peut plus être modifié</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment_plan">Plan de traitement</Label>
              <Textarea
                id="treatment_plan"
                value={formData.treatment_plan}
                onChange={(e) => handleFieldChange('treatment_plan', e.target.value)}
                placeholder="Définir le plan de traitement..."
                rows={3}
                disabled={isCompleted}
                className={isCompleted ? 'bg-gray-100 text-gray-700 cursor-not-allowed' : ''}
              />
              {isCompleted && (
                <p className="text-sm text-gray-500">La consultation est terminée - ce champ ne peut plus être modifié</p>
              )}
            </div>

            {!isCompleted && canComplete && (
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={handleSaveFields}
                  disabled={!formData.diagnosis && !formData.treatment_plan}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            )}

            {consultation.follow_up_notes && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Notes de suivi</h4>
                <p className="mt-1 text-sm">{consultation.follow_up_notes}</p>
              </div>
            )}

            {consultation.follow_up_date && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Date de suivi</h4>
                <p className="mt-1 text-sm">{formatDate(consultation.follow_up_date)}</p>
              </div>
            )}
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
            {consultation.billing_code && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Code de facturation</h4>
                <p className="mt-1 text-sm">{consultation.billing_code}</p>
              </div>
            )}

            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Montant payé</h4>
              <p className="mt-1 text-sm font-medium">
                {formatAmount(consultation.amount_paid)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Link href={`/consultations/${consultation.id_}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </Link>

              {canComplete && (
                <Button 
                  variant="default" 
                  onClick={handleComplete}
                  disabled={completing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  {completing ? 'Terminaison...' : 'Terminer'}
                </Button>
              )}

              {canDelete && (
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </Button>
              )}

              {canRestore && (
                <Button 
                  variant="outline" 
                  onClick={handleRestore}
                  disabled={restoring}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {restoring ? 'Restauration...' : 'Restaurer'}
                </Button>
              )}

              {consultation.deleted_at && (
                <Button 
                  variant="destructive" 
                  onClick={handlePermanentlyDelete}
                  disabled={deleting}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {deleting ? 'Suppression définitive...' : 'Supprimer définitivement'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
