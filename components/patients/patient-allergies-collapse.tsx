import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { PatientAllergy } from "@/features/patients/types/allergies.types";
import { AllergiesService } from "@/features/patients/services/allergies.service";
import { formatAllergenType, formatAllergySeverity, getAllergySeverityBadge, getAllergenTypeBadge } from "@/features/patients/utils/allergies.utils";
import { useAuthToken } from "@/hooks/use-auth-token";
import { AddAllergyModal } from "./add-allergy-modal";

interface PatientAllergiesCollapseProps {
  patientId: string;
}

export function PatientAllergiesCollapse({ patientId }: PatientAllergiesCollapseProps) {
  const [allergies, setAllergies] = useState<PatientAllergy[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { token } = useAuthToken();

  const loadAllergies = async () => {
    if (loaded && allergies.length > 0) {
      // Si déjà chargé et on a des données, ne pas recharger
      return;
    }

    try {
      setLoading(true);
      const data = await AllergiesService.getPatientAllergies({ patient_id: patientId }, token || undefined);
      
      // L'API retourne { data: [...], total: 3 }
      const allergiesArray = (data as any)?.data || [];
      setAllergies(allergiesArray);
      setLoaded(true);
    } catch (error) {
      console.error("Error loading allergies:", error);
      setAllergies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      // On va ouvrir, charger les données si besoin
      loadAllergies();
    }
    setIsOpen(!isOpen);
  };

  const handleAllergyAdded = () => {
    // Recharger les allergies quand on en ajoute une
    setLoaded(false);
    loadAllergies();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
            onClick={handleToggle}
          >
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Allergies {loaded && `(${allergies.length})`}
            </CardTitle>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          {isOpen && (
            <AddAllergyModal patientId={patientId} onAllergyAdded={handleAllergyAdded} />
          )}
        </div>
      </CardHeader>
      
      {isOpen && (
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Chargement des allergies...</p>
            </div>
          ) : !Array.isArray(allergies) || allergies.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Aucune allergie enregistrée pour ce patient.
              </p>
              <AddAllergyModal patientId={patientId} onAllergyAdded={handleAllergyAdded} />
            </div>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {allergies.map((allergy, index) => {
                if (!allergy) return null;
                const severityBadge = getAllergySeverityBadge(allergy);
                const typeBadge = getAllergenTypeBadge(allergy.allergen_type);
                
                return (
                  <div key={(allergy as any).id_ || index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{allergy.allergen}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Réaction: {allergy.reaction}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant={severityBadge.variant as "default" | "secondary" | "destructive" | "outline"}>
                          {severityBadge.label}
                        </Badge>
                        <Badge variant={typeBadge.variant as "default" | "secondary" | "destructive" | "outline"}>
                          {typeBadge.label}
                        </Badge>
                      </div>
                    </div>
                    
                    {allergy.notes && (
                      <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                        <strong>Notes:</strong> {allergy.notes}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Sévérité: {formatAllergySeverity(allergy.severity)}</span>
                      <span>Type: {formatAllergenType(allergy.allergen_type)}</span>
                      <span>Source: {allergy.source}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
