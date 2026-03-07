"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, AlertCircle } from "lucide-react";
import { TabActionsButton } from "./tab-actions-button";

interface MedicalHistoryItem {
  id_: string;
  condition: string;
  diagnosis_date?: string;
  description?: string;
  status: string;
  severity?: string;
  is_active: boolean;
}

interface MedicalHistoryTabProps {
  medicalHistory?: MedicalHistoryItem[];
  loading?: boolean;
  onAdd?: () => void;
}

export function MedicalHistoryTab({ medicalHistory = [], loading = false, onAdd = () => {} }: MedicalHistoryTabProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'actif':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'resolved':
      case 'résolu':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'chronic':
      case 'chronique':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique médical</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Chargement de l'historique médical...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!medicalHistory || medicalHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historique médical
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun historique médical enregistré</p>
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
            <FileText className="h-5 w-5" />
            Historique médical ({medicalHistory.length})
          </div>
          <TabActionsButton onAdd={onAdd || (() => {})} label="Ajouter un antécédent" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Condition</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Date de diagnostic</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Statut</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Sévérité</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Description</th>
              </tr>
            </thead>
            <tbody>
              {medicalHistory.map((item) => (
                <tr key={item.id_} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3">
                    <div className="font-medium">{item.condition}</div>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    {item.diagnosis_date ? new Date(item.diagnosis_date).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    {item.severity && (
                      <Badge className={getSeverityColor(item.severity)}>
                        {item.severity}
                      </Badge>
                    )}
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <div className="max-w-xs truncate" title={item.description}>
                      {item.description || '-'}
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
