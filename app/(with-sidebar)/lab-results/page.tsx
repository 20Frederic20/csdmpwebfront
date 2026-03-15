'use client';

import { useState } from "react";
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
import { LabResult, ListLabResultQueryParams, TestType } from "@/features/lab-results/types/lab-results.types";
import { usePermissionsContext } from "@/contexts/permissions-context";
import {
  getTestTypeOptions,
  canDeleteLabResult,
  canRestoreLabResult,
  formatTestType,
  formatDate
} from "@/features/lab-results/utils/lab-results.utils";
import Link from "next/link";
import { 
  useLabResults, 
  useDeleteLabResult, 
  useRestoreLabResult, 
  usePermanentlyDeleteLabResult,
  useToggleLabResultStatus
} from "@/features/lab-results/hooks/use-lab-results";
import { EditLabResultModal } from "@/features/lab-results/components/edit-lab-result-modal";

export default function LabResultsPage() {
  const [search, setSearch] = useState('');
  const [filterTestType, setFilterTestType] = useState<TestType | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const { canAccess } = usePermissionsContext();

  const [selectedLabResult, setSelectedLabResult] = useState<LabResult | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const queryParams: ListLabResultQueryParams = {
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    search: search.length >= 3 ? search : undefined,
    test_type: filterTestType || undefined,
    sort_by: 'date_performed',
    sort_order: 'desc'
  };

  const { data: labResultsData, isLoading, error } = useLabResults(queryParams);
  const deleteMutation = useDeleteLabResult();
  const restoreMutation = useRestoreLabResult();
  const permanentDeleteMutation = usePermanentlyDeleteLabResult();
  const toggleStatusMutation = useToggleLabResultStatus();

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleLabResultRestored = async (labResult: LabResult) => {
    try {
      await restoreMutation.mutateAsync(labResult.id_);
    } catch (error) {
      console.error('Error restoring lab result:', error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleStatusMutation.mutateAsync({ id, isActive: !currentStatus });
    } catch (error) {
      console.error('Error toggling lab result status:', error);
    }
  };

  const handlePermanentlyDeleted = async (labResult: LabResult) => {
    try {
      await permanentDeleteMutation.mutateAsync(labResult.id_);
    } catch (error) {
      console.error('Error permanently deleting lab result:', error);
    }
  };

  const handleLabResultDeleted = async (labResult: LabResult) => {
    try {
      await deleteMutation.mutateAsync(labResult.id_);
    } catch (error) {
      console.error('Error deleting lab result:', error);
    }
  };

  const handleEditClick = (labResult: LabResult) => {
    setSelectedLabResult(labResult);
    setIsEditModalOpen(true);
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
            <Search className="h-5 w-5" />
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Chargement des résultats de laboratoire...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-lg text-red-600">{(error as Error).message}</div>
            </div>
          ) : !isLoading && labResults.length === 0 ? (
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
                              onCheckedChange={() => handleToggleStatus(labResult.id_, labResult.is_active)}
                              className="data-[state=checked]:bg-green-500"
                              disabled={toggleStatusMutation.isPending}
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
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => handleEditClick(labResult)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {!isDeleted && canDeleteLabResult(labResult) && (
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600"
                                  onClick={() => handleLabResultDeleted(labResult)}
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              )}
                              {isDeleted && canRestoreLabResult(labResult) && (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleLabResultRestored(labResult)}
                                  disabled={restoreMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Restaurer
                                </DropdownMenuItem>
                              )}
                              {isDeleted && (
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600"
                                  onClick={() => handlePermanentlyDeleted(labResult)}
                                  disabled={permanentDeleteMutation.isPending}
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

      {selectedLabResult && (
        <EditLabResultModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedLabResult(null);
          }}
          labResult={selectedLabResult}
        />
      )}
    </div>
  );
}
