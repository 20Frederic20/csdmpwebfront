'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Plus,
  MoreHorizontal,
  Eye,
  UserCheck,
  Trash2,
  Edit,
  Users,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { PatientsResponse } from "@/features/patients";
import { PatientService } from "@/features/patients";
import { useAuthToken } from "@/hooks/use-auth-token";
import { usePermissions } from "@/hooks/use-permissions";
import Link from "next/link";
import { DataPagination } from "@/components/ui/data-pagination";
import { PatientFilters } from "@/components/patients/patient-filters";
import { formatPatientName, formatBirthDate, formatGender, getPatientStatusBadge } from "@/features/patients/utils/patients.utils";
import { ViewPatientModal } from "@/components/patients/view-patient-modal";
import { EditPatientModal } from "@/components/patients/edit-patient-modal";
import { DeletePatientModal } from "@/components/patients/delete-patient-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [patientsData, setPatientsData] = useState<PatientsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortingField, setSortingField] = useState('id');
  const [sortingOrder, setSortingOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [filters, setFilters] = useState({
    search: "",
    birth_date_from: "",
    genders: "all" as 'male' | 'female' | 'other' | 'unknown' | 'all',
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { token } = useAuthToken();
  const { canAccess } = usePermissions();

  // États pour les modals
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenViewModal = (patient: any) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const handleOpenEditModal = (patient: any) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (patient: any) => {
    setSelectedPatient(patient);
    setIsDeleteModalOpen(true);
  };

  const handlePatientUpdated = (updatedPatient: any) => {
    if (patientsData) {
      setPatientsData({
        ...patientsData,
        data: patientsData.data.map(p =>
          p.id_ === updatedPatient.id_ ? updatedPatient : p
        )
      });
    }
  };

  const handleToggleStatus = async (patientId: string) => {
    try {
      const updatedPatient = await PatientService.togglePatientActivation(patientId, token || undefined);

      if (updatedPatient && typeof updatedPatient.is_active === 'boolean') {
        if (patientsData) {
          setPatientsData({
            ...patientsData,
            data: patientsData.data.map(patient =>
              patient.id_ === patientId ? updatedPatient : patient
            )
          });
        }


        toast.success(`Patient ${updatedPatient.is_active ? 'activé' : 'désactivé'} avec succès`);
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error: any) {
      console.error('Error toggling patient activation:', error);
      toast.error(error.message || "Erreur lors du changement de statut");
    }
  };

  const handlePatientSoftDeleted = async (id: string) => {
    try {
      await PatientService.softDeletePatient(id, token || undefined);

      // Mettre à jour l'état localement
      toast.success('Patient supprimé avec succès');
    } catch (error: any) {
      console.error('Error soft deleting patient:', error);
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handlePatientSoftDeletedStateUpdate = (id: string) => {
    setPatientsData(prevData =>
      prevData ? {
        ...prevData,
        data: prevData.data.map(patient =>
          patient.id_ === id ? { ...patient, deleted_at: new Date().toISOString() } : patient
        )
      } : null
    );
  };

  const handlePatientPermanentlyDeleted = async (id: string) => {
    try {
      await PatientService.permanentlyDeletePatient(id, token || undefined);

      // Retirer de la liste
      setPatientsData(prevPatients => prevPatients ? {
        ...prevPatients,
        data: prevPatients.data.filter(patient => patient.id_ !== id),
        total: prevPatients.total - 1
      } : null);

      toast.success('Patient supprimé définitivement');
    } catch (error: any) {
      console.error('Error permanently deleting patient:', error);
      toast.error(error.message || "Erreur lors de la suppression définitive");
    }
  };

  const handlePatientRestored = async (id: string) => {
    try {
      const restoredPatient = await PatientService.restorePatient(id, token || undefined);

      // Mettre à jour l'état localement
      setPatientsData(prevData =>
        prevData ? {
          ...prevData,
          data: prevData.data.map(patient =>
            patient.id_ === id ? restoredPatient : patient
          )
        } : null
      );

      toast.success('Patient restauré avec succès');
    } catch (error: any) {
      console.error('Error restoring patient:', error);
      toast.error(error.message || "Erreur lors de la restauration");
    }
  };

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const offset = (currentPage - 1) * itemsPerPage;

      // Construire les paramètres de requête avec les filtres
      const params: any = {
        limit: itemsPerPage,
        offset,
        sorting_field: sortingField,
        sorting_order: sortingOrder,
      };

      // Ajouter les filtres de recherche
      if (filters.search) params.search = filters.search;
      if (filters.birth_date_from) params.birth_date_from = filters.birth_date_from;
      if (filters.genders && filters.genders !== 'all') params.genders = filters.genders;

      const data = await PatientService.getPatients(params, token || undefined);

      setPatientsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadPatients();
    } else {
      setLoading(false);
      setError('Token d\'authentification manquant');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadPatients();
    }
  }, [currentPage, itemsPerPage, filters, token]);

  // Gestion du tri
  const handleSort = (field: string) => {
    if (sortingField === field) {
      // Même champ : inverser l'ordre
      setSortingOrder(sortingOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // Nouveau champ : réinitialiser à ASC
      setSortingField(field);
      setSortingOrder('ASC');
    }
    setCurrentPage(1); // Revenir à la première page
  };

  // Obtenir l'icône de tri pour un champ
  const getSortIcon = (field: string) => {
    if (sortingField !== field) {
      return <ChevronsUpDown className="h-4 w-4" />;
    }
    return sortingOrder === 'ASC'
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  // Reset page 1 quand la recherche change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handlers pour les filtres avancés
  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleFiltersReset = () => {
    setFilters({
      search: "",
      birth_date_from: "",
      genders: "all",
    });
    setCurrentPage(1);
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  // Reset page 1 quand le nombre d'éléments par page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Calcul des données paginées
  const totalPages = patientsData ? Math.ceil(patientsData.total / itemsPerPage) : 0;
  const patients = patientsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Gérez les informations des patients et leurs dossiers médicaux.
          </p>
        </div>
        {canAccess('patients', 'create') && (
          <Link href="/patients/add">
            <Button className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un patient
            </Button>
          </Link>
        )}
      </div>

      {/* Filtres et recherche */}
      <PatientFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleFiltersReset}
        isOpen={showAdvancedFilters}
        onToggle={toggleAdvancedFilters}
      />

      {/* Tableau des patients */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des patients ({patientsData?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chargement des patients...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive">Erreur: {error}</p>
              <Button onClick={loadPatients} className="mt-2">
                Réessayer
              </Button>
            </div>
          ) : patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm || filters.search || filters.birth_date_from || filters.genders
                      ? 'Aucun patient trouvé pour cette recherche.'
                      : 'Aucun patient enregistré.'
                    }
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filters.search || filters.birth_date_from || filters.genders
                      ? 'Essayez de modifier vos critères de recherche.'
                      : 'Commencez par ajouter le premier patient.'
                    }
                  </p>
                  {canAccess('patients', 'create') && (
                    <Link href="/patients/add">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter le premier patient
                      </Button>
                    </Link>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('given_name')}
                    >
                      <div className="flex items-center gap-2">
                        Patient
                        {getSortIcon('given_name')}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('birth_date')}
                    >
                      <div className="flex items-center gap-2">
                        Date de naissance
                        {getSortIcon('birth_date')}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('gender')}
                    >
                      <div className="flex items-center gap-2">
                        Genre
                        {getSortIcon('gender')}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('location')}
                    >
                      <div className="flex items-center gap-2">
                        Localisation
                        {getSortIcon('location')}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('is_active')}
                    >
                      <div className="flex items-center gap-2">
                        Statut
                        {getSortIcon('is_active')}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => {
                    const statusBadge = getPatientStatusBadge(patient);
                    return (
                      <TableRow key={patient.id_}>
                        <TableCell className="font-medium">
                          <div className={`flex items-center gap-3 ${patient.deleted_at ? 'opacity-60' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-md font-medium ${patient.deleted_at
                              ? 'bg-gray-100 text-gray-500'
                              : !patient.is_active
                                ? 'bg-gray-100 text-gray-500'
                                : 'bg-blue-100 text-blue-700'
                              }`}>
                              {formatPatientName(patient).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {formatPatientName(patient)}
                                {patient.deleted_at && (
                                  <Badge variant="secondary" className="text-xs">
                                    Supprimé
                                  </Badge>
                                )}
                                {!patient.is_active && !patient.deleted_at && (
                                  <Badge variant="secondary" className="text-xs">
                                    Inactif
                                  </Badge>
                                )}
                              </div>
                              <div className="text-md text-muted-foreground">ID: {patient.id_?.substring(0, 8) || 'N/A'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatBirthDate(patient.birth_date)}</TableCell>
                        <TableCell>{formatGender(patient.gender)}</TableCell>
                        <TableCell>{patient.location}</TableCell>
                        <TableCell>
                          <Switch
                            checked={patient.is_active}
                            onCheckedChange={() => handleToggleStatus(patient.id_)}
                            className="data-[state=checked]:bg-green-500"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="cursor-pointer">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleOpenViewModal(patient)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
                              </DropdownMenuItem>
                              {canAccess('patients', 'update') && (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleOpenEditModal(patient)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </DropdownMenuItem>
                              )}
                              {canAccess('patients', 'soft_delete') && !patient.deleted_at && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="cursor-pointer text-red-600"
                                    onClick={() => handleOpenDeleteModal(patient)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </>
                              )}
                              {patient.deleted_at && canAccess('patients', 'delete') && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="cursor-pointer text-green-600"
                                    onClick={() => handlePatientRestored(patient.id_)}
                                  >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Restaurer
                                  </DropdownMenuItem>
                                </>
                              )}
                              {patient.deleted_at && canAccess('patients', 'delete') && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="cursor-pointer text-red-600"
                                    onClick={() => handlePatientPermanentlyDeleted(patient.id_)}
                                  >
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Supprimer définitivement
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {/* Actions groupées dans DropdownMenu */}
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
                totalItems={patientsData?.total || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedPatient && (
        <>
          <ViewPatientModal
            patient={selectedPatient}
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
          />
          <EditPatientModal
            patient={selectedPatient}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onPatientUpdated={handlePatientUpdated}
          />
          <DeletePatientModal
            patient={selectedPatient}
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onPatientDeleted={() => handlePatientSoftDeletedStateUpdate(selectedPatient.id_)}
          />
        </>
      )}
    </div>
  );
}