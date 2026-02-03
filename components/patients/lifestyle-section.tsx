import { PatientLifestyle } from "@/features/patients/types/lifestyle.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, Cigarette, Wine, Utensils, Briefcase } from "lucide-react";
import { 
  formatTobaccoStatus, 
  formatAlcoholConsumption, 
  formatPhysicalActivity,
  getTobaccoStatusBadge,
  getAlcoholConsumptionBadge,
  getPhysicalActivityBadge
} from "@/features/patients/utils/lifestyle.utils";
import { AddLifestyleModal } from "./add-lifestyle-modal";

interface LifestyleSectionProps {
  lifestyle: PatientLifestyle[];
  loading: boolean;
  patientId: string;
  onLifestyleAdded: () => void;
}

export function LifestyleSection({ lifestyle, loading, patientId, onLifestyleAdded }: LifestyleSectionProps) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Chargement du style de vie...</p>
      </div>
    );
  }

  if (!Array.isArray(lifestyle) || lifestyle.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">
          Aucune information sur le style de vie enregistrée pour ce patient.
        </p>
      </div>
    );
  }

  // Prendre le plus récent ou le premier
  const currentLifestyle = lifestyle[0];

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-6 space-y-6">
        {/* En-tête avec badges principaux */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-2">Style de vie actuel</h4>
            <p className="text-sm text-muted-foreground">
              Date d'évaluation: {currentLifestyle.assessment_date ? new Date(currentLifestyle.assessment_date).toLocaleDateString('fr-FR') : 'Non spécifiée'}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={getPhysicalActivityBadge(currentLifestyle.physical_activity).variant as "default" | "secondary" | "destructive" | "outline"}>
              {getPhysicalActivityBadge(currentLifestyle.physical_activity).label}
            </Badge>
            <Badge variant={getAlcoholConsumptionBadge(currentLifestyle.alcohol_consumption).variant as "default" | "secondary" | "destructive" | "outline"}>
              {getAlcoholConsumptionBadge(currentLifestyle.alcohol_consumption).label}
            </Badge>
          </div>
        </div>

        {/* Grid d'informations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Habitudes */}
          <div className="space-y-4">
            <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Habitudes</h5>
            
            <div className="flex items-center gap-3">
              <Cigarette className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Tabagisme</p>
                <Badge variant={getTobaccoStatusBadge(currentLifestyle.tobacco_status).variant as "default" | "secondary" | "destructive" | "outline"} className="mt-1">
                  {getTobaccoStatusBadge(currentLifestyle.tobacco_status).label}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Wine className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Consommation d'alcool</p>
                <Badge variant={getAlcoholConsumptionBadge(currentLifestyle.alcohol_consumption).variant as "default" | "secondary" | "destructive" | "outline"} className="mt-1">
                  {getAlcoholConsumptionBadge(currentLifestyle.alcohol_consumption).label}
                </Badge>
              </div>
            </div>

            {currentLifestyle.tobacco_per_week && (
              <div className="flex items-center gap-3">
                <Cigarette className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Cigarettes par semaine</p>
                  <p className="text-sm text-muted-foreground">{currentLifestyle.tobacco_per_week}</p>
                </div>
              </div>
            )}

            {currentLifestyle.alcohol_units_per_week && (
              <div className="flex items-center gap-3">
                <Wine className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Unités d'alcool par semaine</p>
                  <p className="text-sm text-muted-foreground">{currentLifestyle.alcohol_units_per_week}</p>
                </div>
              </div>
            )}
          </div>

          {/* Mode de vie */}
          <div className="space-y-4">
            <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Mode de vie</h5>
            
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Activité physique</p>
                <p className="text-sm text-muted-foreground">{formatPhysicalActivity(currentLifestyle.physical_activity)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Utensils className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Régime alimentaire</p>
                <p className="text-sm text-muted-foreground">{currentLifestyle.dietary_regime || 'Non spécifié'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Risques professionnels</p>
                <p className="text-sm text-muted-foreground">{currentLifestyle.occupational_risks || 'Non spécifié'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Date d'évaluation</p>
                <p className="text-sm text-muted-foreground">{currentLifestyle.assessment_date ? new Date(currentLifestyle.assessment_date).toLocaleDateString('fr-FR') : 'Non spécifiée'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {currentLifestyle.notes && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-medium mb-1">Notes</p>
            <p className="text-sm text-muted-foreground">{currentLifestyle.notes}</p>
          </div>
        )}

        {/* Métadonnées */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <span>Actif: {currentLifestyle.is_active ? 'Oui' : 'Non'}</span>
          <span>ID: {currentLifestyle.id}</span>
        </div>
      </div>
    </div>
  );
}
