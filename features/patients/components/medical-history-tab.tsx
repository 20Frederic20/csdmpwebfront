"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, AlertCircle } from "lucide-react";

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
}

export function MedicalHistoryTab({ medicalHistory = [], loading = false }: MedicalHistoryTabProps) {
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
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Historique médical ({medicalHistory.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medicalHistory.map((item) => (
            <div
              key={item.id_}
              className="p-4 rounded-lg border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{item.condition}</h4>
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    {item.severity && (
                      <Badge className={getSeverityColor(item.severity)}>
                        {item.severity}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {item.diagnosis_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Diagnostic: {new Date(item.diagnosis_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    
                    {item.description && (
                      <div>
                        <p className="text-sm font-medium">Description:</p>
                        <p className="text-sm">{item.description}</p>
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
