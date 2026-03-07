"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, AlertCircle } from "lucide-react";
import { TabActionsButton } from "./tab-actions-button";

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
  onAdd?: () => void;
}

export function FamilyHistoryTab({ familyHistory = [], loading = false, onAdd = () => {} }: FamilyHistoryTabProps) {
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
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Historique familial ({familyHistory.length})
          </div>
          <TabActionsButton onAdd={onAdd || (() => {})} label="Ajouter un antécédent familial" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Relation</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Condition</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Âge d'apparition</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Statut</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Notes</th>
              </tr>
            </thead>
            <tbody>
              {familyHistory.map((item) => (
                <tr key={item.id_} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3">
                    <Badge variant="outline" className={getRelationshipColor(item.relationship)}>
                      {item.relationship}
                    </Badge>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <div className="font-medium">{item.condition}</div>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    {item.age_of_onset ? `${item.age_of_onset} ans` : '-'}
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.is_active ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm">Actif</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <span className="text-sm">Inactif</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <div className="max-w-xs truncate" title={item.notes}>
                      {item.notes || '-'}
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
