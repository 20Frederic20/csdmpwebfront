"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Info } from "lucide-react";
import { PatientAllergy } from "@/features/patients/types/patient-detail.types";

interface PatientAllergiesTabProps {
  allergies?: PatientAllergy[];
  loading?: boolean;
}

export function PatientAllergiesTab({ allergies = [], loading = false }: PatientAllergiesTabProps) {
  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
      case 'grave':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate':
      case 'modéré':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'mild':
      case 'léger':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Clock className="h-4 w-4 text-gray-400" />
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Allergies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Chargement des allergies...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!allergies || allergies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Allergies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune allergie enregistrée</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Allergies ({allergies.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allergies.map((allergy) => (
            <div
              key={allergy.id_}
              className={`p-4 rounded-lg border ${getSeverityColor(allergy.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{allergy.allergen}</h4>
                    <Badge variant="outline" className="text-xs">
                      {allergy.allergen_type}
                    </Badge>
                    {getStatusIcon(allergy.is_active)}
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Réaction:</p>
                      <p className="text-sm">{allergy.reaction}</p>
                    </div>
                    
                    {allergy.severity && (
                      <div>
                        <p className="text-sm font-medium">Sévérité:</p>
                        <Badge className={getSeverityColor(allergy.severity)}>
                          {allergy.severity}
                        </Badge>
                      </div>
                    )}
                    
                    {allergy.source && (
                      <div>
                        <p className="text-sm font-medium">Source:</p>
                        <p className="text-sm">{allergy.source}</p>
                      </div>
                    )}
                    
                    {allergy.notes && (
                      <div>
                        <p className="text-sm font-medium">Notes:</p>
                        <p className="text-sm">{allergy.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
