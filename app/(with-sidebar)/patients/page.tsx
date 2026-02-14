'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'Aucun patient trouvé pour cette recherche.' : 'Aucun patient disponible.'}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('given_name')}
                    >
                      <div className="flex items-center gap-2">
                        Nom
                        {getSortIcon('given_name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('birth_date')}
                    >
                      <div className="flex items-center gap-2">
                        Date de naissance
                        {getSortIcon('birth_date')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('gender')}
                    >
                      <div className="flex items-center gap-2">
                        Genre
                        {getSortIcon('gender')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('location')}
                    >
                      <div className="flex items-center gap-2">
                        Localisation
                        {getSortIcon('location')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('is_active')}
                    >
                      <div className="flex items-center space-x-1">
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
                        <TableCell className="font-medium">{formatPatientName(patient)}</TableCell>
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
                                onClick={() => {
                                  // Ouvrir le modal manuellement
                                  const modal = document.querySelector(`[data-modal="view-patient-${patient.id_}"]`) as HTMLDialogElement;
                                  if (modal) modal.showModal();
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
                              </DropdownMenuItem>
                              {canAccess('patients', 'update') && (
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => {
                                    // Ouvrir le modal manuellement
                                    const modal = document.querySelector(`[data-modal="edit-patient-${patient.id_}"]`) as HTMLDialogElement;
                                    if (modal) modal.showModal();
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </DropdownMenuItem>
                              )}
                              {canAccess('patients', 'update') && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleToggleStatus(patient.id_)}
                                    className="cursor-pointer"
                                  >
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    {patient.is_active ? 'Désactiver' : 'Activer'}
                                  </DropdownMenuItem>
                                </>
                              )}
                              {canAccess('patients', 'delete') && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="cursor-pointer text-red-600"
                                    onClick={() => {
                                      // Ouvrir le modal manuellement
                                      const modal = document.querySelector(`[data-modal="delete-patient-${patient.id_}"]`) as HTMLDialogElement;
                                      if (modal) modal.showModal();
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          {/* Boutons cachés pour déclencher les modals */}
                          <div className="hidden">
                            <ViewPatientModal patient={patient} />
                            <EditPatientModal patient={patient} onPatientUpdated={loadPatients} />
                            <DeletePatientModal patient={patient} onPatientDeleted={loadPatients} />
                          </div>
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
    </div>
  );
}