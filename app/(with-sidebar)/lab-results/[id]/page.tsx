'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  Building, 
  FileText, 
  Edit, 
  Trash2,
  ToggleLeft,
  ToggleRight,
  User,
  Activity
} from "lucide-react";
import { LabResultsService } from "@/features/lab-results/services/lab-results.service";
import { LabResult, TestType } from "@/features/lab-results/types/lab-results.types";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import Link from "next/link";

export default function LabResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoading: authLoading } = useAuthRefresh();
  const [labResult, setLabResult] = useState<LabResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id as string;

  const fetchLabResult = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await LabResultsService.getLabResultById(id);
      setLabResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch lab result');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchLabResult();
    }
  }, [id]);

  const handleToggleStatus = async () => {
    if (!labResult) return;
    
    try {
      await LabResultsService.toggleLabResultStatus(id, !labResult.is_active);
      fetchLabResult();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this lab result?')) {
      try {
        await LabResultsService.deleteLabResult(id);
        router.push('/lab-results');
      } catch (err: any) {
        setError(err.message || 'Failed to delete lab result');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTestTypeLabel = (testType: TestType) => {
    const labels: Record<TestType, string> = {
      [TestType.BLOOD_COUNT]: 'Numération sanguine',
      [TestType.CHEMISTRY]: 'Chimie',
      [TestType.HEMATOLOGY]: 'Hématologie',
      [TestType.MICROBIOLOGY]: 'Microbiologie',
      [TestType.PATHOLOGY]: 'Pathologie',
      [TestType.IMMUNOLOGY]: 'Immunologie',
      [TestType.GENETICS]: 'Génétique',
      [TestType.TOXICOLOGY]: 'Toxicologie',
      [TestType.ENDOCRINOLOGY]: 'Endocrinologie',
      [TestType.CARDIOLOGY]: 'Cardiologie',
      [TestType.URINALYSIS]: 'Analyse d\'urine',
      [TestType.STOOL_ANALYSIS]: 'Analyse de selles',
      [TestType.IMAGING]: 'Imagerie',
      [TestType.OTHER]: 'Autre'
    };
    return labels[testType] || testType;
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement du résultat...</div>
      </div>
    );
  }

  if (error || !labResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/lab-results">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
        </div>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive">
              {error || 'Résultat non trouvé'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/lab-results">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Détail du résultat</h1>
            <p className="text-muted-foreground">
              Informations complètes du résultat de laboratoire
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/lab-results/${labResult.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
          >
            {labResult.is_active ? (
              <ToggleRight className="mr-2 h-4 w-4" />
            ) : (
              <ToggleLeft className="mr-2 h-4 w-4" />
            )}
            {labResult.is_active ? 'Désactiver' : 'Activer'}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive">{error}</div>
          </CardContent>
        </Card>
      )}

      {/* Main Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informations du résultat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type de test</label>
                  <div className="mt-1">
                    <Badge variant="secondary">
                      {getTestTypeLabel(labResult.test_type)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Statut</label>
                  <div className="mt-1">
                    <Badge variant={labResult.is_active ? "default" : "destructive"}>
                      {labResult.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date du test
                  </label>
                  <div className="mt-1 text-sm">
                    {formatDate(labResult.date_performed)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date du rapport
                  </label>
                  <div className="mt-1 text-sm">
                    {formatDate(labResult.date_reported)}
                  </div>
                </div>
              </div>

              {labResult.issuing_facility && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Établissement émetteur
                  </label>
                  <div className="mt-1 text-sm">
                    {labResult.issuing_facility}
                  </div>
                </div>
              )}

              {labResult.document_id && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID Document</label>
                  <div className="mt-1 text-sm font-mono bg-muted p-2 rounded">
                    {labResult.document_id}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Extracted Values */}
          {labResult.extracted_values && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Valeurs extraites
                </CardTitle>
                <CardDescription>
                  Données structurées extraites du résultat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(labResult.extracted_values, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID Patient</label>
                <div className="mt-1 text-sm font-mono bg-muted p-2 rounded">
                  {labResult.patient_id}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/lab-results/${labResult.id}/edit`}>
                <Button className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleToggleStatus}
              >
                {labResult.is_active ? (
                  <>
                    <ToggleLeft className="mr-2 h-4 w-4" />
                    Désactiver
                  </>
                ) : (
                  <>
                    <ToggleRight className="mr-2 h-4 w-4" />
                    Activer
                  </>
                )}
              </Button>
              <Button
                className="w-full"
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
