'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  User, 
  Building2, 
  Eye, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Filter,
  RotateCcw,
  AlertTriangle,
  MoreHorizontal
} from "lucide-react";
import { PatientInsuranceService } from "@/features/patient-insurance/services/patient-insurance.service";
import { PatientInsurance, ListPatientInsuranceQueryParams } from "@/features/patient-insurance/types/patient-insurance.types";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuthToken } from "@/hooks/use-auth-token";
import Link from "next/link";
import { ViewPatientInsuranceModal } from "@/features/patient-insurance/components/view-patient-insurance-modal";
import { EditPatientInsuranceModal } from "@/features/patient-insurance/components/edit-patient-insurance-modal";
import { CreatePatientInsuranceModal } from "@/features/patient-insurance/components/create-patient-insurance-modal";
import { ConfirmModal } from "@/components/ui/modal";
import { DataPagination } from "@/components/ui/data-pagination";
import { toast } from "sonner";

export default function PatientInsurancePage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuthRefresh();
  const { canAccess } = usePermissions();
  const { token } = useAuthToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [patientInsurances, setPatientInsurances] = useState<PatientInsurance[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // Search and filter states
  const [search, setSearch] = useState('');
  const [searchPolicyNumber, setSearchPolicyNumber] = useState('');
  const [searchPriority, setSearchPriority] = useState('');
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPatientInsurance, setSelectedPatientInsurance] = useState<PatientInsurance | null>(null);
  
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchPatientInsurances = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params: ListPatientInsuranceQueryParams = {
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
        sort_by: 'patient_full_name',
        sort_order: 'asc'
      };

      if (search && search.length >= 3) params.search = search;
      if (searchPolicyNumber && searchPolicyNumber.length >= 7) params.policy_number = searchPolicyNumber;
      if (searchPriority) params.priority = parseInt(searchPriority);

      const response = await PatientInsuranceService.getPatientInsurances(params);
      setPatientInsurances(response.data);
      setTotal(response.total);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch patient insurances:', err);
      setError('Erreur lors du chargement des assurances patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPatientInsurances(currentPage);
    }
  }, [currentPage, itemsPerPage, token]);

  // Recherche dynamique pour le champ search (minimum 3 caractères)
  useEffect(() => {
    if (token) {
      fetchPatientInsurances(1);
    }
  }, [search, token]);

  // Recherche dynamique pour le numéro de police (minimum 7 caractères)
  useEffect(() => {
    if (token) {
      fetchPatientInsurances(1);
    }
  }, [searchPolicyNumber, token]);

  // Recherche dynamique pour la priorité
  useEffect(() => {
    if (token) {
      fetchPatientInsurances(1);
    }
  }, [searchPriority, token]);

  const handleClearFilters = () => {
    setSearch('');
    setSearchPolicyNumber('');
    setSearchPriority('');
    setCurrentPage(1);
    fetchPatientInsurances(1);
  };

  const handleToggleStatus = async (patientInsurance: PatientInsurance) => {
    try {
      const updatedPatientInsurance = await PatientInsuranceService.togglePatientInsuranceStatus(
        patientInsurance.id_, 
        !patientInsurance.is_active
      );
      
      // Mettre à jour l'état localement
      setPatientInsurances(prev => 
        prev.map(pi => 
          pi.id_ === updatedPatientInsurance.id_ ? updatedPatientInsurance : pi
        )
      );
    } catch (err) {
      console.error('Failed to toggle status:', err);
      setError('Erreur lors du changement de statut');
    }
  };

  const handleDelete = async (patientInsurance: PatientInsurance) => {
    setSelectedPatientInsurance(patientInsurance);
    setDeleteModalOpen(true);
  };

  const handleSoftDelete = async (id: string) => {
    try {
      await PatientInsuranceService.deletePatientInsurance(id);
      // Mettre à jour l'état localement (pas de réponse du backend)
      setPatientInsurances(prev => 
        prev.map(pi => 
          pi.id_ === id ? { ...pi, deleted_at: new Date().toISOString() } : pi
        )
      );
      toast.success('Assurance patient supprimée avec succès');
    } catch (error: any) {
      console.error('Error soft deleting patient insurance:', error);
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handlePermanentlyDelete = async (id: string) => {
    try {
      await PatientInsuranceService.permanentlyDeletePatientInsurance(id);
      // Retirer de la liste localement (pas de réponse du backend)
      setPatientInsurances(prev => prev.filter(pi => pi.id_ !== id));
      setTotal(prevTotal => prevTotal - 1);
      toast.success('Assurance patient supprimée définitivement');
    } catch (error: any) {
      console.error('Error permanently deleting patient insurance:', error);
      toast.error(error.message || "Erreur lors de la suppression définitive");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const restoredPatientInsurance = await PatientInsuranceService.restorePatientInsurance(id);
      // Mettre à jour l'état localement
      setPatientInsurances(prev => 
        prev.map(pi => 
          pi.id_ === id ? restoredPatientInsurance : pi
        )
      );
      toast.success('Assurance patient restaurée avec succès');
    } catch (error: any) {
      console.error('Error restoring patient insurance:', error);
      toast.error(error.message || "Erreur lors de la restauration");
    }
  };

  const confirmDelete = async () => {
    if (!selectedPatientInsurance) return;

    try {
      setLoading(true);
      setError(null);
      
      await PatientInsuranceService.deletePatientInsurance(selectedPatientInsurance.id_);
      setDeleteModalOpen(false);
      setSelectedPatientInsurance(null);
      await fetchPatientInsurances(currentPage);
    } catch (err) {
      console.error('Failed to delete patient insurance:', err);
      setError('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (patientInsurance: PatientInsurance) => {
    setSelectedPatientInsurance(patientInsurance);
    setViewModalOpen(true);
  };

  const handleEdit = (patientInsurance: PatientInsurance) => {
    setSelectedPatientInsurance(patientInsurance);
    setEditModalOpen(true);
  };

  // Handler for successful creation
  const handleCreateSuccess = (newPatientInsurance: any) => {
    console.log('Adding new patient insurance to list:', newPatientInsurance);
    
    // Add the new item to the beginning of the list
    setPatientInsurances(prev => {
      const newList = [newPatientInsurance, ...prev];
      console.log('Updated list after creation:', newList);
      return newList;
    });
    
    // Force table re-render
    setRefreshKey(prev => prev + 1);
  };

  const handleUpdate = (updatedPatientInsurance: PatientInsurance) => {
    console.log('Updating patient insurance in list:', updatedPatientInsurance); // Debug
    
    // Force re-render by creating new array and using spread operator
    setPatientInsurances(prev => {
      const updatedList = [...prev.map(pi => 
        pi.id_ === updatedPatientInsurance.id_ ? { ...updatedPatientInsurance } : { ...pi }
      )];
      console.log('Updated list:', updatedList); // Debug
      return updatedList;
    });
    
    // Force table re-render
    setRefreshKey(prev => prev + 1);
    
    // Update selected patient insurance too
    setSelectedPatientInsurance({ ...updatedPatientInsurance });
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  // Reset page 1 quand la recherche change
  const handleSearchChange = (field: 'search' | 'policy' | 'priority', value: string) => {
    if (field === 'search') setSearch(value);
    else if (field === 'policy') setSearchPolicyNumber(value);
    else if (field === 'priority') setSearchPriority(value);
    setCurrentPage(1);
  };

  // Reset page 1 quand le nombre d'éléments par page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assurances Patients</h1>
          <p className="text-gray-600 mt-2">Gérer les assurances des patients</p>
        </div>
        {canAccess('patient_insurances', 'create') && (
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une assurance
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Rechercher et filtrer les assurances patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="search">Rechercher</Label>
              <Input
                id="search"
                placeholder="Rechercher (min. 3 caractères)"
                value={search}
                onChange={(e) => handleSearchChange('search', e.target.value)}
              />
              {search && search.length < 3 && (
                <p className="text-xs text-gray-500">Minimum 3 caractères requis</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchPolicyNumber">Numéro de police</Label>
              <Input
                id="searchPolicyNumber"
                placeholder="Numéro de police (min. 7 caractères)"
                value={searchPolicyNumber}
                onChange={(e) => handleSearchChange('policy', e.target.value)}
              />
              {searchPolicyNumber && searchPolicyNumber.length < 7 && (
                <p className="text-xs text-gray-500">Minimum 7 caractères requis</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchPriority">Priorité</Label>
              <Input
                id="searchPriority"
                placeholder="Priorité (1-10)"
                value={searchPriority}
                onChange={(e) => handleSearchChange('priority', e.target.value)}
                type="number"
                min="1"
                max="10"
              />
            </div>
            <div className="space-y-2 flex items-end">
              <Button onClick={handleClearFilters} className="w-full">
                Effacer les filtres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des assurances ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : patientInsurances.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune assurance patient trouvée
            </div>
          ) : (
            <>
              <Table key={refreshKey}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Patient</TableHead>
                    <TableHead className="w-[200px]">Assurance</TableHead>
                    <TableHead className="w-[150px]">Police</TableHead>
                    <TableHead className="w-[100px]">Priorité</TableHead>
                    <TableHead className="w-[100px]">Statut</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientInsurances.map((patientInsurance) => (
                    <TableRow key={patientInsurance.id_} className={patientInsurance.deleted_at ? 'opacity-60' : ''}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-md font-medium ${
                            patientInsurance.deleted_at 
                              ? 'bg-gray-100 text-gray-500' 
                              : !patientInsurance.is_active 
                                ? 'bg-gray-100 text-gray-500' 
                                : 'bg-blue-100 text-blue-700'
                          }`}>
                            {patientInsurance.patient_full_name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {patientInsurance.patient_full_name || 'Nom inconnu'}
                              {patientInsurance.deleted_at && (
                                <Badge variant="secondary" className="text-xs">
                                  Supprimé
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">{patientInsurance.patient_id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{patientInsurance.insurance_name || 'Assurance inconnue'}</div>
                            <div className="text-sm text-gray-600">{patientInsurance.insurance_id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{patientInsurance.policy_number}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={patientInsurance.priority <= 3 ? "default" : "secondary"}>
                          {patientInsurance.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={patientInsurance.is_active && !patientInsurance.deleted_at}
                          onCheckedChange={() => handleToggleStatus(patientInsurance)}
                          disabled={!!patientInsurance.deleted_at || !canAccess('patient_insurances', 'update')}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canAccess('patient_insurances', 'read') && (
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => handleView(patientInsurance)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
                              </DropdownMenuItem>
                            )}
                            {canAccess('patient_insurances', 'update') && !patientInsurance.deleted_at && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => handleEdit(patientInsurance)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </DropdownMenuItem>
                              </>
                            )}
                            {canAccess('patient_insurances', 'soft_delete') && !patientInsurance.deleted_at && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer text-red-600"
                                  onClick={() => handleSoftDelete(patientInsurance.id_)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </>
                            )}
                            {patientInsurance.deleted_at && canAccess('patient_insurances', 'delete') && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer text-green-600"
                                  onClick={() => handleRestore(patientInsurance.id_)}
                                >
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  Restaurer
                                </DropdownMenuItem>
                              </>
                            )}
                            {patientInsurance.deleted_at && canAccess('patient_insurances', 'delete') && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer text-red-600"
                                  onClick={() => handlePermanentlyDelete(patientInsurance.id_)}
                                >
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Supprimer définitivement
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <DataPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedPatientInsurance && (
        <>
          <ViewPatientInsuranceModal
            isOpen={viewModalOpen}
            onClose={() => setViewModalOpen(false)}
            patientInsurance={selectedPatientInsurance}
          />
          <EditPatientInsuranceModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            patientInsurance={selectedPatientInsurance}
            onUpdate={handleUpdate}
          />
        </>
      )}
      
      <CreatePatientInsuranceModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'assurance patient"
        message={`Êtes-vous sûr de vouloir supprimer l'assurance "${selectedPatientInsurance?.patient_full_name || 'Nom inconnu'} - ${selectedPatientInsurance?.insurance_name || 'Assurance inconnue'}" ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        loading={loading}
      />
    </div>
  );
}
