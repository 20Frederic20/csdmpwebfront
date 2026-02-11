'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  Eye, 
  Edit, 
  Trash2,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { LabResultsService } from "@/features/lab-results/services/lab-results.service";
import { LabResult, TestType, ListLabResultQueryParams } from "@/features/lab-results/types/lab-results.types";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import Link from "next/link";

export default function LabResultsPage() {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestType, setSelectedTestType] = useState<TestType | ''>('');
  const [showInactive, setShowInactive] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, limit: 20, offset: 0 });
  const { isLoading: authLoading } = useAuthRefresh();

  const testTypeOptions = Object.values(TestType);

  const fetchLabResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: ListLabResultQueryParams = {
        limit: pagination.limit,
        offset: pagination.offset,
        is_active: showInactive ? undefined : true,
        sort_by: 'date_performed',
        sort_order: 'desc'
      };

      if (searchTerm) {
        // Search by issuing facility or document_id
        params.issuing_facility = searchTerm;
      }

      if (selectedTestType) {
        params.test_type = selectedTestType;
      }

      const response = await LabResultsService.getLabResults(params);
      setLabResults(response.data);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch lab results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabResults();
  }, [searchTerm, selectedTestType, showInactive, pagination.offset]);

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await LabResultsService.toggleLabResultStatus(id, !isActive);
      fetchLabResults();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lab result?')) {
      try {
        await LabResultsService.deleteLabResult(id);
        fetchLabResults();
      } catch (err: any) {
        setError(err.message || 'Failed to delete lab result');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Résultats de laboratoire</h1>
          <p className="text-muted-foreground">
            Gérez les résultats de laboratoire des patients
          </p>
        </div>
        <Link href="/lab-results/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un résultat
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Établissement, document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="test-type">Type de test</Label>
              <select
                id="test-type"
                value={selectedTestType}
                onChange={(e) => setSelectedTestType(e.target.value as TestType | '')}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Tous les types</option>
                {testTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {getTestTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Afficher les inactifs</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive">{error}</div>
          </CardContent>
        </Card>
      )}

      {/* Lab Results List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Résultats ({pagination.total})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : labResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun résultat trouvé
            </div>
          ) : (
            <div className="space-y-4">
              {labResults.map((labResult) => (
                <div
                  key={labResult.id_}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary">
                        {getTestTypeLabel(labResult.test_type)}
                      </Badge>
                      <Badge variant={labResult.is_active ? "default" : "destructive"}>
                        {labResult.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {labResult.issuing_facility && (
                        <div>Établissement: {labResult.issuing_facility}</div>
                      )}
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Effectué: {formatDate(labResult.date_performed)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Rapport: {formatDate(labResult.date_reported)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/lab-results/${labResult.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/lab-results/${labResult.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(labResult.id, labResult.is_active)}
                    >
                      {labResult.is_active ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(labResult.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-muted-foreground">
                Affichage de {pagination.offset + 1} à{' '}
                {Math.min(pagination.offset + pagination.limit, pagination.total)} sur{' '}
                {pagination.total} résultats
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
                  disabled={pagination.offset === 0}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
                  disabled={pagination.offset + pagination.limit >= pagination.total}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
