import { PatientMedicalHistory } from "@/features/patients/types/medical-history.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { 
  formatMedicalCategory, 
  formatMedicalStatus, 
  formatMedicalSeverity,
  getMedicalCategoryBadge,
  getMedicalStatusBadge,
  getMedicalSeverityBadge,
  sortMedicalHistoryByDate
} from "@/features/patients/utils/medical-history.utils";
import { AddMedicalHistoryModal } from "./add-medical-history-modal";

interface MedicalHistorySectionProps {
  medicalHistory: PatientMedicalHistory[];
  loading: boolean;
  patientId: string;
  onMedicalHistoryAdded: () => void;
}

export function MedicalHistorySection({ medicalHistory, loading, patientId, onMedicalHistoryAdded }: MedicalHistorySectionProps) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Chargement des antécédents médicaux...</p>
      </div>
    );
  }

  if (!Array.isArray(medicalHistory) || medicalHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">
          Aucun antécédent médical enregistré pour ce patient.
        </p>
      </div>
    );
  }

  // Trier par date de début (plus récent en premier)
  const sortedHistory = sortMedicalHistoryByDate(medicalHistory, 'desc');

  return (
    <div className="space-y-4">
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {sortedHistory.map((history, index) => {
          const categoryBadge = getMedicalCategoryBadge(history.category);
          const statusBadge = getMedicalStatusBadge(history.status);
          const severityBadge = getMedicalSeverityBadge(history.severity);
          
          return (
            <div key={history.id || `medical-history-${index}`} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{history.description}</h4>
                  <p className="text-md text-muted-foreground mt-1">
                    Début: {new Date(history.onset_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant={categoryBadge.variant as "default" | "secondary" | "destructive" | "outline"}>
                    {categoryBadge.label}
                  </Badge>
                  <Badge variant={statusBadge.variant as "default" | "secondary" | "destructive" | "outline"}>
                    {statusBadge.label}
                  </Badge>
                  <Badge variant={severityBadge.variant as "default" | "secondary" | "destructive" | "outline"}>
                    {severityBadge.label}
                  </Badge>
                </div>
              </div>
              
              {/* Détails supplémentaires */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-md">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Date de début:</span>
                    <span className="text-muted-foreground">{new Date(history.onset_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  
                  {history.resolution_date && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Date de résolution:</span>
                      <span className="text-muted-foreground">{new Date(history.resolution_date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                  
                  {history.code && (
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Code:</span>
                      <span className="text-muted-foreground font-mono">{history.code}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Statut:</span>
                    <Badge variant={statusBadge.variant as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                      {statusBadge.label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Sévérité:</span>
                    <Badge variant={severityBadge.variant as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                      {severityBadge.label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Actif:</span>
                    <span className={history.is_active ? "text-green-600" : "text-gray-500"}>
                      {history.is_active ? "Oui" : "Non"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              {history.notes && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-md font-medium mb-1">Notes</p>
                  <p className="text-md text-muted-foreground">{history.notes}</p>
                </div>
              )}
              
              {/* Métadonnées */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                <span>ID: {history.id}</span>
                <span>Catégorie: {formatMedicalCategory(history.category)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
