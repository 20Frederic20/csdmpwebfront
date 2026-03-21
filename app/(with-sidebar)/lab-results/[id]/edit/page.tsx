'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { LabResultsService } from "@/features/lab-results/services/lab-results.service";
import { LabResult } from "@/features/lab-results/types/lab-results.types";
import { LabResultFormValues } from "@/features/lab-results/schemas/lab-results.schema";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import { LabResultForm } from "@/features/lab-results/components/LabResultForm";
import { toast } from "sonner";
import { usePermissionsContext } from "@/contexts/permissions-context";

export default function LabResultEditPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoading: authLoading } = useAuthRefresh();
  const { canAccess, loading: permissionsLoading } = usePermissionsContext();
  const [labResult, setLabResult] = useState<LabResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    const loadLabResult = async () => {
      try {
        const data = await LabResultsService.getLabResultById(id);
        setLabResult(data);
      } catch (error) {
        console.error('Error loading lab result:', error);
        toast.error('Erreur lors du chargement du résultat de laboratoire');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadLabResult();
    }
  }, [id]);

  const onSubmit = async (data: LabResultFormValues) => {
    setSaving(true);
    try {
      // Post-traitement des valeurs : matcher la logique du backend (serialization JSON des objets)
      const processedExtractedValues: Record<string, any> = {};
      if (data.extracted_values) {
        Object.entries(data.extracted_values).forEach(([key, val]) => {
          if (typeof val === 'object' && val !== null) {
            processedExtractedValues[key] = JSON.stringify(val);
          } else if (val !== undefined && val !== null) {
            processedExtractedValues[key] = String(val);
          }
        });
      }

      await LabResultsService.updateLabResult(id, {
        ...data,
        date_performed: new Date(data.date_performed).toISOString(),
        date_reported: new Date(data.date_reported).toISOString(),
        extracted_values: processedExtractedValues,
      });

      toast.success('Résultat de laboratoire mis à jour avec succès');
      router.push('/lab-results');
    } catch (error) {
      console.error('Error updating lab result:', error);
      toast.error('Erreur lors de la mise à jour du résultat de laboratoire');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!canAccess('lab_results', 'update')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Accès refusé</h2>
          <p className="text-muted-foreground">Vous n'avez pas la permission de modifier les résultats de laboratoire.</p>
        </div>
      </div>
    );
  }

  if (!labResult) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Résultat non trouvé</h2>
          <p className="text-muted-foreground mb-4">Le résultat de laboratoire demandé n'existe pas.</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <LabResultForm 
          initialData={labResult}
          onSubmit={onSubmit} 
          isSubmitting={saving} 
          title="Modifier le résultat de laboratoire"
        />
      </CardContent>
    </Card>
  );
}
