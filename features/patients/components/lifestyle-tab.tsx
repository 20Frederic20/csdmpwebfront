"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, Utensils, Cigarette, Wine } from "lucide-react";

interface LifestyleItem {
  id_: string;
  category: string;
  habit: string;
  frequency?: string;
  details?: string;
  is_active: boolean;
}

interface LifestyleTabProps {
  lifestyle?: LifestyleItem[];
  loading?: boolean;
}

export function LifestyleTab({ lifestyle = [], loading = false }: LifestyleTabProps) {
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'exercise':
      case 'activité physique':
        return <Activity className="h-5 w-5" />;
      case 'diet':
      case 'alimentation':
        return <Utensils className="h-5 w-5" />;
      case 'smoking':
      case 'tabac':
        return <Cigarette className="h-5 w-5" />;
      case 'alcohol':
      case 'alcool':
        return <Wine className="h-5 w-5" />;
      default:
        return <Heart className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'exercise':
      case 'activité physique':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'diet':
      case 'alimentation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'smoking':
      case 'tabac':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'alcohol':
      case 'alcool':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

  if (!lifestyle || lifestyle.length === 0) {
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

  // Group by category
  const groupedLifestyle = lifestyle.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, LifestyleItem[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Style de vie ({lifestyle.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedLifestyle).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                {getCategoryIcon(category)}
                <h3 className="font-semibold text-lg capitalize">{category}</h3>
                <Badge variant="outline" className={getCategoryColor(category)}>
                  {items.length}
                </Badge>
              </div>
              
              <div className="space-y-2 ml-7">
                {items.map((item) => (
                  <div
                    key={item.id_}
                    className="p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{item.habit}</h4>
                      {item.frequency && (
                        <Badge variant="outline" className="text-xs">
                          {item.frequency}
                        </Badge>
                      )}
                    </div>
                    
                    {item.details && (
                      <p className="text-sm text-muted-foreground">{item.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
