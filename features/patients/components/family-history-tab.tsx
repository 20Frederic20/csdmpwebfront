"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, AlertCircle } from "lucide-react";

interface FamilyHistoryItem {
  id_: string;
  condition: string;
  relationship: string;
  age_of_onset?: number;
  notes?: string;
  is_active: boolean;
}

interface FamilyHistoryTabProps {
  familyHistory?: FamilyHistoryItem[];
  loading?: boolean;
}

export function FamilyHistoryTab({ familyHistory = [], loading = false }: FamilyHistoryTabProps) {
  const getRelationshipColor = (relationship: string) => {
    switch (relationship?.toLowerCase()) {
      case 'father':
      case 'père':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mother':
      case 'mère':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'sibling':
      case 'frère':
      case 'sœur':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'grandparent':
      case 'grand-parent':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique familial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Chargement de l'historique familial...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!familyHistory || familyHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Historique familial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun historique familial enregistré</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Historique familial ({familyHistory.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {familyHistory.map((item) => (
            <div
              key={item.id_}
              className="p-4 rounded-lg border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{item.condition}</h4>
                    <Badge variant="outline" className={getRelationshipColor(item.relationship)}>
                      {item.relationship}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {item.age_of_onset && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Âge d'apparition: {item.age_of_onset} ans</span>
                      </div>
                    )}
                    
                    {item.notes && (
                      <div>
                        <p className="text-sm font-medium">Notes:</p>
                        <p className="text-sm">{item.notes}</p>
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
