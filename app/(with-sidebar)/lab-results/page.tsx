'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import CustomSelect from "@/components/ui/custom-select";
import { DataPagination } from "@/components/ui/data-pagination";
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  Search,
  Activity,
  FileText
} from "lucide-react";
import { LabResult, ListLabResultQM, ListLabResultQueryParams, TestType } from "@/features/lab-results/types/lab-results.types";
import { LabResultsService } from "@/features/lab-results/services/lab-results.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { usePermissions } from "@/hooks/use-permissions";
import { 
  getTestTypeOptions,
  canDeleteLabResult,
  canRestoreLabResult,
  formatTestType,
  formatDate
} from "@/features/lab-results/utils/lab-results.utils";
import { toast } from "sonner";
import Link from "next/link";

export default function LabResultsPage() {
  const [labResultsData, setLabResultsData] = useState<ListLabResultQM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterTestType, setFilterTestType] = useState<TestType | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const { token } = useAuthToken();
  const { canAccess } = usePermissions();

  const loadLabResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: ListLabResultQueryParams = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        search: search.length >= 3 ? search : undefined,
        test_type: filterTestType || undefined,
        sort_by: 'date_performed',
        sort_order: 'desc'
      };

      const data = await LabResultsService.getLabResults(params);
      setLabResultsData(data);
    } catch (error) {
      console.error('Error loading lab results:', error);
      setError('Erreur lors du chargement des résultats de laboratoire');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabResults();
  }, [currentPage, itemsPerPage, search, filterTestType]);

  // Reset page 1 quand le nombre d'éléments par page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleLabResultRestored = async (labResult: LabResult) => {
    try {
      const restoredLabResult = await LabResultsService.restoreLabResult(labResult.id_);
      
      if (labResultsData) {
        setLabResultsData({
          ...labResultsData,
          data: labResultsData.data.map(lr =>
            lr.id_ === labResult.id_ ? { 
              ...lr, // Conserve toutes les données existantes
              deleted_at: undefined, // Met à jour seulement deleted_at
              is_active: true // Met à jour seulement is_active
            } : lr
          )
        });
      }
      
      toast.success('Résultat de laboratoire restauré avec succès');
    } catch (error) {
      console.error('Error restoring lab result:', error);
      toast.error('Erreur lors de la restauration du résultat de laboratoire');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const labResult = labResultsData?.data.find(lr => lr.id_ === id);
      if (!labResult) return;

      const updatedLabResult = await LabResultsService.updateLabResult(id, { 
        is_active: !labResult.is_active 
      });
      
      if (labResultsData) {
        setLabResultsData({
          ...labResultsData,
          data: labResultsData.data.map(lr =>
            lr.id_ === id ? { 
              ...lr, // Conserve toutes les données existantes
              is_active: updatedLabResult.is_active // Met à jour seulement le statut
            } : lr
          )
        });
      }
      
      toast.success(`Résultat de laboratoire ${updatedLabResult.is_active ? 'activé' : 'désactivé'} avec succès`);
    } catch (error) {
      console.error('Error toggling lab result status:', error);
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handlePermanentlyDeleted = async (labResult: LabResult) => {
    try {
      await LabResultsService.permanentlyDeleteLabResult(labResult.id_);
      
      if (labResultsData) {
        setLabResultsData({
          ...labResultsData,
          data: labResultsData.data.filter(lr => lr.id_ !== labResult.id_),
          total: labResultsData.total - 1
        });
      }
      
      toast.success('Résultat de laboratoire supprimé définitivement');
    } catch (error) {
      console.error('Error permanently deleting lab result:', error);
      toast.error('Erreur lors de la suppression définitive du résultat de laboratoire');
    }
  };

  const handleLabResultDeleted = async (labResult: LabResult) => {
    try {
      await LabResultsService.deleteLabResult(labResult.id_);
      
      if (labResultsData) {
        setLabResultsData({
          ...labResultsData,
          data: labResultsData.data.map(lr =>
            lr.id_ === labResult.id_ ? { 
              ...lr, 
              deleted_at: new Date().toISOString(),
              is_active: false
            } : lr
          )
        });
      }
      
      toast.success('Résultat de laboratoire supprimé avec succès');
    } catch (error) {
      console.error('Error deleting lab result:', error);
      toast.error('Erreur lors de la suppression du résultat de laboratoire');
    }
  };

  const totalPages = labResultsData ? Math.ceil(labResultsData.total / itemsPerPage) : 0;
  const labResults = labResultsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Résultats de laboratoire</h1>
          <p className="text-muted-foreground">
            Gérer les résultats d'analyses de laboratoire.
          </p>
        </div>
        {canAccess('lab_results', 'create') && (
          <Link href="/lab-results/add">
            <Button className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau résultat
            </Button>
          </Link>
        )}
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" /> {/* Icône de recherche pour les filtres */}
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche (patient)</label>
              <input
                type="text"
                placeholder="Rechercher un patient (min. 3 caractères)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type d'analyse</label>
              <CustomSelect
                value={filterTestType}
                onChange={(value: string | string[] | null) => setFilterTestType(value as TestType | '')}
                options={[
                  { value: '', label: 'Tous les types' },
                  ...getTestTypeOptions()
                ]}
                placeholder="Sélectionner un type"
                className="w-full"
              />
            </div>
            <div className="space-y-2 flex items-end">
              <Button onClick={() => {
                setSearch('');
                setFilterTestType('');
                setCurrentPage(1);
              }} className="w-full">
                Effacer les filtres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des résultats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Liste des résultats ({labResultsData?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Chargement des résultats de laboratoire...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-lg text-red-600">{error}</div>
            </div>
          ) : !loading && !error && labResults.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Aucun résultat de laboratoire trouvé.
                </h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par créer le premier résultat de laboratoire.
                </p>
                <Link href="/lab-results/add">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer le premier résultat
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type d'analyse</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actif</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labResults.map((labResult) => {
                    const isDeleted = labResult.deleted_at != null && labResult.deleted_at !== undefined && labResult.deleted_at !== '';
                    return (
                      <TableRow key={labResult.id_} className={isDeleted ? 'opacity-60' : ''}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="max-w-xs truncate" title={labResult.patient_full_name || labResult.patient_id}>
                              {labResult.patient_full_name || labResult.patient_id}
                            </div>
                            {isDeleted && (
                              <Badge variant="secondary" className="text-xs">
                                Supprimé
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {formatTestType(labResult.test_type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(labResult.date_performed)}
                        </TableCell>
                        <TableCell>
                        {canAccess('lab_results', 'toggle') && !isDeleted ? (
                          <Switch 
                            checked={labResult.is_active}
                            onCheckedChange={() => handleToggleStatus(labResult.id_)}
                            className="data-[state=checked]:bg-green-500"
                          />
                        ) : (
                          <Badge variant={labResult.is_active ? "default" : "secondary"}>
                            {labResult.is_active ? 'Oui' : 'Non'}
                          </Badge>
                        )}
                      </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="cursor-pointer">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/lab-results/${labResult.id_}`} className="cursor-pointer">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir
                                </Link>
                              </DropdownMenuItem>
                              {!isDeleted && (
                                <DropdownMenuItem asChild>
                                  <Link href={`/lab-results/${labResult.id_}/edit`} className="cursor-pointer">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {!isDeleted && canDeleteLabResult(labResult) && (
                                <DropdownMenuItem 
                                  className="cursor-pointer text-red-600"
                                  onClick={() => handleLabResultDeleted(labResult)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              )}
                              {isDeleted && canRestoreLabResult(labResult) && (
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => handleLabResultRestored(labResult)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Restaurer
                                </DropdownMenuItem>
                              )}
                              {isDeleted && (
                                <DropdownMenuItem 
                                  className="cursor-pointer text-red-600"
                                  onClick={() => handlePermanentlyDeleted(labResult)}
                                >
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Supprimer définitivement
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              <DataPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={labResultsData?.total || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
