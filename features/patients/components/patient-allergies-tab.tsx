import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Info } from "lucide-react";
import { PatientAllergy } from "@/features/patients/types/patient-detail.types";
import { TabActionsButton } from "./tab-actions-button";

interface PatientAllergiesTabProps {
  allergies?: PatientAllergy[];
  loading?: boolean;
  onAdd?: () => void;
}

export function PatientAllergiesTab({ allergies = [], loading = false, onAdd }: PatientAllergiesTabProps) {
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
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Allergies ({allergies.length})
          </div>
          <TabActionsButton onAdd={onAdd || (() => {})} label="Ajouter une allergie" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Allergène</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Type</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Réaction</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Sévérité</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Source</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Statut</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Notes</th>
              </tr>
            </thead>
            <tbody>
              {allergies.map((allergy) => (
                <tr key={allergy.id_} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3">
                    <div className="font-medium">{allergy.allergen}</div>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {allergy.allergen_type}
                    </Badge>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    {allergy.reaction}
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    {allergy.severity && (
                      <Badge className={getSeverityColor(allergy.severity)}>
                        {allergy.severity}
                      </Badge>
                    )}
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    {allergy.source || '-'}
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(allergy.is_active)}
                      <span className="text-sm">
                        {allergy.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <div className="max-w-xs truncate" title={allergy.notes}>
                      {allergy.notes || '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
