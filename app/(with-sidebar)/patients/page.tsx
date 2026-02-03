'use client';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { PatientsService } from "@/features/patients/services/patients.service";
import { PatientsResponse } from "@/features/patients/types/patients.types";
import { formatPatientName, formatBirthDate, formatGender, getPatientStatusBadge } from "@/features/patients/utils/patients.utils";
import { useAuthToken } from "@/hooks/use-auth-token";
import { AddPatientModal } from "@/components/patients/add-patient-modal";
import { ViewPatientModal } from "@/components/patients/view-patient-modal";
import { EditPatientModal } from "@/components/patients/edit-patient-modal";
import { DeletePatientModal } from "@/components/patients/delete-patient-modal";

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [patientsData, setPatientsData] = useState<PatientsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortingField, setSortingField] = useState('id');
  const [sortingOrder, setSortingOrder] = useState<'ASC' | 'DESC'>('ASC');
  const { token } = useAuthToken();

  // Charger les données depuis l'API
  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const offset = (currentPage - 1) * itemsPerPage;
      const data = await PatientsService.getPatients({
        limit: itemsPerPage,
        offset,
        sorting_field: sortingField,
        sorting_order: sortingOrder,
        search: searchTerm || undefined,
      }, token || undefined);
      
      setPatientsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage et quand les paramètres changent
  useEffect(() => {
    if (token) {
      loadPatients();
    } else {
      setLoading(false);
      setError('Token d\'authentification manquant');
    }
  }, [currentPage, itemsPerPage, searchTerm, sortingField, sortingOrder, token]);

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

  // Reset page 1 quand le nombre d'éléments par page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Calcul des données paginées
  const totalPages = patientsData ? Math.ceil(patientsData.total / itemsPerPage) : 0;
  const patients = patientsData?.patients || [];

  // Générer les numéros de pages pour la pagination shadcn
  const generatePaginationItems = () => {
    const items = [];
    
    if (totalPages <= 7) {
      // Si 7 pages ou moins, afficher toutes
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Sinon, afficher avec ellipsis
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          items.push(i);
        }
        items.push('ellipsis');
        items.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        items.push(1);
        items.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          items.push(i);
        }
      } else {
        items.push(1);
        items.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i);
        }
        items.push('ellipsis');
        items.push(totalPages);
      }
    }
    
    return items;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Gérez la liste de vos patients
          </p>
        </div>
        <AddPatientModal onPatientAdded={loadPatients} />
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher un patient..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtres avancés
            </Button>
          </div>
        </CardContent>
      </Card>

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
                        <TableCell className="font-medium">{formatPatientName(patient)}</TableCell>
                        <TableCell>{formatBirthDate(patient.birth_date)}</TableCell>
                        <TableCell>{formatGender(patient.gender)}</TableCell>
                        <TableCell>{patient.location}</TableCell>
                        <TableCell>
                          <Badge variant={statusBadge.variant as "default" | "secondary" | "destructive" | "outline"}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
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
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">
                    Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, patientsData?.total || 0)} sur {patientsData?.total || 0} résultats
                  </p>
                  <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={itemsPerPage.toString()} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[10, 20, 30, 40, 50].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {generatePaginationItems().map((item, index) => (
                      <PaginationItem key={index}>
                        {item === 'ellipsis' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => setCurrentPage(item as number)}
                            isActive={currentPage === item}
                            className="cursor-pointer"
                          >
                            {item}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}