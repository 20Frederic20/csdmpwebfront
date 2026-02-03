import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus } from "lucide-react";
import { PatientAllergy } from "@/features/patients/types/allergies.types";
import { AllergiesService } from "@/features/patients/services/allergies.service";
import { formatAllergenType, formatAllergySeverity, getAllergySeverityBadge, getAllergenTypeBadge } from "@/features/patients/utils/allergies.utils";
import { useAuthToken } from "@/hooks/use-auth-token";
import { AddAllergyModal } from "./add-allergy-modal";

interface PatientAllergiesProps {
  patientId: string;
}

export function PatientAllergies({ patientId }: PatientAllergiesProps) {
  const [allergies, setAllergies] = useState<PatientAllergy[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthToken();

  const loadAllergies = async () => {
    try {
      setLoading(true);
      const data = await AllergiesService.getPatientAllergies({ patient_id: patientId }, token || undefined);
      
      // L'API retourne { data: [...], total: 3 }
      const allergiesArray = (data as any)?.data || [];
      setAllergies(allergiesArray);
    } catch (error) {
      console.error("Error loading allergies:", error);
      setAllergies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      loadAllergies();
    }
  }, [patientId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Allergies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">Chargement des allergies...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Allergies ({Array.isArray(allergies) ? allergies.length : 0})
          </CardTitle>
          <AddAllergyModal patientId={patientId} onAllergyAdded={loadAllergies} />
        </div>
      </CardHeader>
      <CardContent>
        {!Array.isArray(allergies) || allergies.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Aucune allergie enregistrée pour ce patient.
            </p>
            <AddAllergyModal patientId={patientId} onAllergyAdded={loadAllergies} />
          </div>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {allergies.map((allergy, index) => {
                if (!allergy) return null; // Protection contre les allergies undefined
                const severityBadge = getAllergySeverityBadge(allergy);
                const typeBadge = getAllergenTypeBadge(allergy.allergen_type);
                
                return (
                  <div key={allergy.id || index} className="border rounded-lg p-4 space-y-3">
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
    </Card>
  );
}
