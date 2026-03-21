'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import { LabResultFormValues } from "@/features/lab-results/schemas/lab-results.schema";
import { useCreateLabResult } from "@/features/lab-results/hooks/use-lab-results";
import { LabResultForm } from "@/features/lab-results/components/LabResultForm";
import { toast } from "sonner";
import { usePermissionsContext } from "@/contexts/permissions-context";

export default function AddLabResultPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuthRefresh();
  const { canAccess, loading: permissionsLoading } = usePermissionsContext();
  const createMutation = useCreateLabResult();

  const onSubmit = async (data: LabResultFormValues) => {
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

      const submitData = {
        ...data,
        date_performed: new Date(data.date_performed).toISOString(),
        date_reported: new Date(data.date_reported).toISOString(),
        extracted_values: processedExtractedValues,
      };

      await createMutation.mutateAsync(submitData);
      toast.success('Résultat de laboratoire créé avec succès');
      router.push('/lab-results');
    } catch (err) {
      console.error('Failed to create lab result:', err);
      toast.error('Erreur lors de la création du résultat de laboratoire');
    }
  };

  if (authLoading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!canAccess('lab_results', 'create')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Accès refusé</h2>
          <p className="text-muted-foreground">Vous n'avez pas la permission d'ajouter des résultats de laboratoire.</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <LabResultForm 
          onSubmit={onSubmit} 
          isSubmitting={createMutation.isPending} 
          title="Ajouter un résultat de laboratoire"
        />
      </CardContent>
    </Card>
  );
}
