"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Heart, Utensils, Cigarette, Wine, Edit } from "lucide-react";
import { TabActionsButton } from "./tab-actions-button";

interface LifestyleItem {
  id: string;
  tobacco_status: string;
  alcohol_consumption: string;
  physical_activity: string;
  assessment_date?: string;
  tobacco_per_week?: number;
  alcohol_units_per_week?: number;
  dietary_regime?: string;
  occupational_risks?: string;
  notes?: string;
  is_active: boolean;
  deleted_at?: string;
}

interface LifestyleTabProps {
  lifestyle?: LifestyleItem[];
  loading?: boolean;
  onEdit?: () => void;
  patientId?: string;
}

export function LifestyleTab({ lifestyle = [], loading = false, onEdit = () => { }, patientId }: LifestyleTabProps) {
  const getTobaccoIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'non-smoker':
      case 'non-fumeur':
        return <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">✓</div>;
      case 'smoker':
      case 'fumeur':
        return <Cigarette className="h-5 w-5 text-red-500" />;
      case 'former-smoker':
      case 'ex-fumeur':
        return <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center">○</div>;
      default:
        return <Heart className="h-5 w-5" />;
    }
  };

  const getAlcoholIcon = (consumption: string) => {
    switch (consumption?.toLowerCase()) {
      case 'none':
      case 'aucun':
        return <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">✓</div>;
      case 'moderate':
      case 'modéré':
        return <Wine className="h-5 w-5 text-yellow-500" />;
      case 'heavy':
      case 'élevé':
        return <Wine className="h-5 w-5 text-red-500" />;
      default:
        return <Wine className="h-5 w-5" />;
    }
  };

  const getActivityIcon = (activity: string) => {
    switch (activity?.toLowerCase()) {
      case 'active':
      case 'actif':
        return <Activity className="h-5 w-5 text-green-500" />;
      case 'moderate':
      case 'modéré':
        return <Activity className="h-5 w-5 text-yellow-500" />;
      case 'sedentary':
      case 'sédentaire':
        return <Activity className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Filter out inactive items
  const activeLifestyle = lifestyle.filter(item => item.is_active);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Style de vie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Chargement du style de vie...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activeLifestyle || activeLifestyle.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Style de vie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune information sur le style de vie</p>
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
            <Heart className="h-5 w-5" />
            Style de vie ({activeLifestyle.length})
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Tabac</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Alcool</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Activité physique</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Régime</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Risques professionnels</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Date d'évaluation</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-sm">Notes</th>
              </tr>
            </thead>
            <tbody>
              {activeLifestyle.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getTobaccoIcon(item.tobacco_status)}
                      <div>
                        <div className="text-sm capitalize">
                          {item.tobacco_status === 'non-smoker' ? 'Non-fumeur' :
                            item.tobacco_status === 'smoker' ? 'Fumeur' :
                              item.tobacco_status === 'former-smoker' ? 'Ex-fumeur' :
                                item.tobacco_status}
                        </div>
                        {item.tobacco_per_week && (
                          <div className="text-xs text-muted-foreground">
                            {item.tobacco_per_week}/sem
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getAlcoholIcon(item.alcohol_consumption)}
                      <div>
                        <div className="text-sm capitalize">
                          {item.alcohol_consumption === 'none' ? 'Aucun' :
                            item.alcohol_consumption === 'moderate' ? 'Modéré' :
                              item.alcohol_consumption === 'heavy' ? 'Élevé' :
                                item.alcohol_consumption}
                        </div>
                        {item.alcohol_units_per_week && (
                          <div className="text-xs text-muted-foreground">
                            {item.alcohol_units_per_week} unités/semaine
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getActivityIcon(item.physical_activity)}
                      <div className="text-sm capitalize">
                        {item.physical_activity === 'active' ? 'Actif' :
                          item.physical_activity === 'moderate' ? 'Modéré' :
                            item.physical_activity === 'sedentary' ? 'Sédentaire' :
                              item.physical_activity}
                      </div>
                    </div>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    {item.dietary_regime ? (
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{item.dietary_regime}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    {item.occupational_risks ? (
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">{item.occupational_risks}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    {item.assessment_date ? formatDate(item.assessment_date) : '-'}
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
