import { PatientLifestyle } from "@/features/patients/types/lifestyle.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Brain, Utensils, Cigarette, Wine } from "lucide-react";
import { 
  formatSmokingStatus, 
  formatAlcoholConsumption, 
  formatPhysicalActivity, 
  formatDietType, 
  formatStressLevel,
  getSmokingStatusBadge,
  getAlcoholConsumptionBadge,
  getPhysicalActivityBadge,
  getStressLevelBadge
} from "@/features/patients/utils/lifestyle.utils";

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
              Dernière mise à jour: {currentLifestyle.updated_at ? new Date(currentLifestyle.updated_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={getPhysicalActivityBadge(currentLifestyle.physical_activity).variant as "default" | "secondary" | "destructive" | "outline"}>
              {getPhysicalActivityBadge(currentLifestyle.physical_activity).label}
            </Badge>
            <Badge variant={getStressLevelBadge(currentLifestyle.stress_level).variant as "default" | "secondary" | "destructive" | "outline"}>
              {getStressLevelBadge(currentLifestyle.stress_level).label}
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
                <Badge variant={getSmokingStatusBadge(currentLifestyle.smoking_status).variant as "default" | "secondary" | "destructive" | "outline"} className="mt-1">
                  {getSmokingStatusBadge(currentLifestyle.smoking_status).label}
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
                <p className="text-sm font-medium">Type de régime</p>
                <p className="text-sm text-muted-foreground">{formatDietType(currentLifestyle.diet_type)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Heures de sommeil</p>
                <p className="text-sm text-muted-foreground">{currentLifestyle.sleep_hours} heures par nuit</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Brain className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Niveau de stress</p>
                <p className="text-sm text-muted-foreground">{formatStressLevel(currentLifestyle.stress_level)}</p>
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
          <span>Source: {currentLifestyle.source}</span>
          <span>ID: {(currentLifestyle as any).id_}</span>
        </div>
      </div>
    </div>
  );
}
