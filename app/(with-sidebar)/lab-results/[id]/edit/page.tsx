'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  Building, 
  FileText, 
  User,
  Activity
} from "lucide-react";
import { LabResultsService } from "@/features/lab-results/services/lab-results.service";
import { LabResult, TestType } from "@/features/lab-results/types/lab-results.types";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import { getTestTypeOptions } from "@/features/lab-results/utils/lab-results.utils";
import { toast } from "sonner";
import Link from "next/link";

export default function LabResultEditPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoading: authLoading } = useAuthRefresh();
  const [labResult, setLabResult] = useState<LabResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    test_type: '' as TestType,
    date_performed: '',
    date_reported: '',
    issuing_facility: '',
    is_active: true
  });

  const id = params.id as string;

  useEffect(() => {
    const loadLabResult = async () => {
      try {
        const data = await LabResultsService.getLabResultById(id);
        setLabResult(data);
        setFormData({
          test_type: data.test_type,
          date_performed: data.date_performed.split('T')[0],
          date_reported: data.date_reported.split('T')[0],
          issuing_facility: data.issuing_facility || '',
          is_active: data.is_active
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await LabResultsService.updateLabResult(id, {
        test_type: formData.test_type,
        date_performed: new Date(formData.date_performed).toISOString(),
        date_reported: new Date(formData.date_reported).toISOString(),
        issuing_facility: formData.issuing_facility || null,
        is_active: formData.is_active
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Chargement...</p>
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
          <Link href="/lab-results">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/lab-results">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modifier le résultat</h1>
          <p className="text-muted-foreground">
            Modifier les informations du résultat de laboratoire.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du résultat</CardTitle>
          <CardDescription>
            Modifiez les détails du résultat de laboratoire ci-dessous.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="test_type">Type d'analyse</Label>
                <select
                  id="test_type"
                  value={formData.test_type}
                  onChange={(e) => handleInputChange('test_type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  {getTestTypeOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuing_facility">Établissement</Label>
                <Input
                  id="issuing_facility"
                  value={formData.issuing_facility}
                  onChange={(e) => handleInputChange('issuing_facility', e.target.value)}
                  placeholder="Nom de l'établissement"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_performed">Date de l'analyse</Label>
                <Input
                  id="date_performed"
                  type="date"
                  value={formData.date_performed}
                  onChange={(e) => handleInputChange('date_performed', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_reported">Date du rapport</Label>
                <Input
                  id="date_reported"
                  type="date"
                  value={formData.date_reported}
                  onChange={(e) => handleInputChange('date_reported', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="is_active">Actif</Label>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
              <Link href="/lab-results">
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
