"use client";

import { useState } from "react";
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
  Thermometer,
  Heart,
  Weight,
  Ruler,
  CheckCircle,
  AlertTriangle,
  CheckSquare,
  Pill
} from "lucide-react";
import { UpdateConsultationRequest, ConsultationStatus } from "@/features/consultations";
import {
  useConsultation,
  useDeleteConsultation,
  useRestoreConsultation,
  usePermanentlyDeleteConsultation,
  useUpdateConsultation,
} from "@/features/consultations/hooks/use-consultations";
import {
  getConsultationStatusLabel,
  getConsultationStatusBadge,
  formatVitalSigns,
  formatDate,
  isConsultationActive,
  canDeleteConsultation,
  canRestoreConsultation,
  validateConsultationData
} from "@/features/consultations";
import Link from "next/link";

export default function ViewConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const consultationId = params.id as string;

  const { data: consultation, isLoading: loading } = useConsultation(consultationId);
  const { mutateAsync: deleteConsultation, isPending: deleting } = useDeleteConsultation();
  const { mutateAsync: restoreConsultation, isPending: restoring } = useRestoreConsultation();
  const { mutateAsync: permanentlyDeleteConsultation, isPending: permanentlyDeleting } = usePermanentlyDeleteConsultation();
  const { mutateAsync: updateConsultation, isPending: completing } = useUpdateConsultation();

  const [formData, setFormData] = useState<UpdateConsultationRequest>({
    diagnosis: "",
  });

  // Pre-fill form when consultation data loads
  if (consultation && !formData.diagnosis && consultation.diagnosis) {
    setFormData({
      diagnosis: consultation.diagnosis || "",
    });
  }

  const handleDelete = async () => {
    if (!consultation) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
      return;
    }

    try {
      await deleteConsultation(consultation.id_);
    } catch {
      // Handled by hook
    }
  };

  const handleRestore = async () => {
    if (!consultation) return;
    try {
      await restoreConsultation(consultation.id_);
    } catch {
      // Handled by hook
    }
  };

  const handlePermanentlyDelete = async () => {
    if (!consultation) return;

    if (!confirm('ATTENTION: Cette action est irréversible. Êtes-vous sûr de vouloir supprimer définitivement cette consultation ?')) {
      return;
    }

    try {
      await permanentlyDeleteConsultation(consultation.id_);
      router.push('/consultations');
    } catch {
      // Handled by hook
    }
  };

  const handleComplete = async () => {
    if (!consultation) return;

    // Validation des champs requis
    const validationErrors = validateConsultationData({
      ...consultation,
      diagnosis: formData.diagnosis || undefined,
    });

    if (validationErrors.length > 0) {
      return;
    }

    try {
      await updateConsultation({
        id: consultation.id_,
        data: {
          diagnosis: formData.diagnosis || undefined,
          status: ConsultationStatus.COMPLETED,
        },
      });
    } catch {
      // Handled by hook
    }
  };

  const handleFieldChange = (field: 'diagnosis', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveFields = async () => {
    if (!consultation) return;
    try {
      await updateConsultation({
        id: consultation.id_,
        data: {
          diagnosis: formData.diagnosis || undefined,
        },
      });
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

  const statusBadge = getConsultationStatusBadge(consultation.status);
  const isActive = isConsultationActive(consultation);
  const canDelete = canDeleteConsultation(consultation);
  const canRestore = canRestoreConsultation(consultation);
  const canComplete = consultation.status !== ConsultationStatus.COMPLETED && isActive && !consultation.deleted_at;
  const isCompleted = consultation.status === ConsultationStatus.COMPLETED;

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
      {canComplete && !consultation.diagnosis && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                Pour terminer cette consultation, veuillez remplir le champ obligatoire : Diagnostic
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

        {/* Localisation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Localisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Établissement</h4>
              <p className="mt-1 text-sm">{consultation.health_facility_id || 'Non spécifié'}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Département</h4>
              <p className="mt-1 text-sm">{consultation.department_id || 'Non spécifié'}</p>
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
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Triage par</h4>
              <p className="mt-1 text-sm">{consultation.triage_by_id || 'Non spécifié'}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Consulté par</h4>
              <p className="mt-1 text-sm">{consultation.consulted_by_id || 'Non spécifié'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Examen physique */}
        {consultation.physical_examination && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Examen physique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{consultation.physical_examination}</p>
            </CardContent>
          </Card>
        )}

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
                value={formData.diagnosis || ""}
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


            {!isCompleted && canComplete && (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleSaveFields}
                  disabled={!formData.diagnosis}
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

        {/* Prescriptions */}
        {consultation.prescription && consultation.prescription.items && consultation.prescription.items.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Médicament</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dosage</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fréquence</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Durée</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Voie</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {consultation.prescription.items.map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium">{item.medication_name}</td>
                        <td className="px-4 py-3 text-sm">{item.dosage}</td>
                        <td className="px-4 py-3 text-sm">{item.frequency}</td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">{item.duration_days} jours</td>
                        <td className="px-4 py-3 text-sm capitalize">{item.route_of_administration}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground italic">
                          {item.special_instructions || <span className="text-gray-300">Aucune</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}


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
                  disabled={permanentlyDeleting}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {permanentlyDeleting ? 'Suppression définitive...' : 'Supprimer définitivement'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
