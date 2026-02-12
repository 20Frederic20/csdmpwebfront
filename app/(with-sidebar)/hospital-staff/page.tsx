"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus, 
  Filter, 
  Users, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  UserCheck,
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown 
} from "lucide-react";
import { toast } from "sonner";
import { 
  HospitalStaff, 
  ListHospitalStaffQueryParams, 
  HospitalStaffSpecialty, 
  HospitalStaffDepartment 
} from "@/features/hospital-staff";
import { HospitalStaffService } from "@/features/hospital-staff";
import { useAuthToken } from "@/hooks/use-auth-token";
import { 
  getSpecialtyLabel, 
  getDepartmentLabel, 
  getSpecialtyOptions, 
  getDepartmentOptions 
} from "@/features/hospital-staff";
import Link from "next/link";
import { ViewHospitalStaffModal } from "@/components/hospital-staff/view-hospital-staff-modal";
import { EditHospitalStaffModal } from "@/components/hospital-staff/edit-hospital-staff-modal";
import { DeleteHospitalStaffModal } from "@/components/hospital-staff/delete-hospital-staff-modal";
import { HospitalStaffFilters } from "@/components/hospital-staff/hospital-staff-filters";

export default function HospitalStaffPage() {
  const [staff, setStaff] = useState<HospitalStaff[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [sortingField, setSortingField] = useState('given_name');
  const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc'>('asc');
  const { token } = useAuthToken();

  // États pour les filtres
  const [filters, setFilters] = useState({
    search: "",
    specialty: "" as HospitalStaffSpecialty | "",
    department: "" as HospitalStaffDepartment | "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const loadStaff = async () => {
    console.log('loadStaff appelé');
    setLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      
      const response = await HospitalStaffService.getHospitalStaff(params, token || undefined);
      setStaff(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      toast.error('Erreur lors du chargement du personnel');
      setStaff([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Mémoriser les paramètres pour éviter les rechargements multiples
  const params = useMemo((): ListHospitalStaffQueryParams => {
    const offset = (currentPage - 1) * itemsPerPage;
    return {
      search: searchTerm || filters.search || undefined,
      limit: itemsPerPage,
      offset,
      sort_by: sortingField,
      sort_order: sortingOrder,
      specialty: filters.specialty as HospitalStaffSpecialty || undefined,
      department: filters.department as HospitalStaffDepartment || undefined,
    };
  }, [currentPage, itemsPerPage, searchTerm, sortingField, sortingOrder, filters.search, filters.specialty, filters.department]);

  useEffect(() => {
    if (token) {
      loadStaff();
    }
  }, [params, token]);

  const getStaffDisplayName = (member: HospitalStaff) => {
    if (member.given_name && member.family_name) {
      return `${member.given_name} ${member.family_name}`;
    }
    return member.matricule || 'Personnel non identifié';
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Handlers pour les filtres avancés (comme dans patients)
  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleFiltersReset = () => {
    setFilters({
      search: "",
      specialty: "" as HospitalStaffSpecialty | "",
      department: "" as HospitalStaffDepartment | "",
    });
    setCurrentPage(1);
  };

  // Gérer le tri
  const handleSort = (field: string) => {
    if (sortingField === field) {
      setSortingOrder(sortingOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortingField(field);
      setSortingOrder('asc');
    }
    setCurrentPage(1);
  };

  // Obtenir l'icône de tri pour un champ
  const getSortIcon = (field: string) => {
    if (sortingField !== field) {
      return <ChevronsUpDown className="h-4 w-4" />;
    }
    return sortingOrder === 'asc' 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  const handleStaffUpdated = () => {
    loadStaff();
  };

  const handleStaffDeleted = () => {
    loadStaff();
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updatedStaff = await HospitalStaffService.toggleHospitalStaffStatus(id, token || undefined);
      
      // Debug: voir ce que le serveur retourne
      console.log('Réponse du serveur pour staff:', updatedStaff);
      console.log('Type de is_active:', typeof updatedStaff?.is_active);
      console.log('Valeur de is_active:', updatedStaff?.is_active);
      
      if (updatedStaff && typeof updatedStaff.is_active === 'boolean') {
        // Mettre à jour l'état localement sans recharger toute la liste
        setStaff(prevStaff => 
          prevStaff.map(member => 
            member.id_ === id ? updatedStaff : member
          )
        );
        
        toast.success(`Personnel ${updatedStaff.is_active ? 'activé' : 'désactivé'} avec succès`);
      } else {
        console.error('updatedStaff invalide:', {
          updatedStaff,
          hasIsActive: updatedStaff && 'is_active' in updatedStaff,
          isActiveType: typeof updatedStaff?.is_active
        });
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error: any) {
      console.error('Error toggling staff status:', error);
      toast.error(error.message || "Erreur lors du changement de statut");
    }
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);
      
      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          items.push(i);
        }
        items.push('...');
        items.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(i);
        }
      } else {
        items.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i);
        }
        items.push('...');
        items.push(totalPages);
      }
    }
    
    return items;
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              className={currentPage === i ? "cursor-pointer" : "cursor-pointer"}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            className={currentPage === 1 ? "cursor-pointer" : "cursor-pointer"}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i)}
                className={currentPage === i ? "cursor-pointer" : "cursor-pointer"}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => setCurrentPage(totalPages)}
              className={currentPage === totalPages ? "cursor-pointer" : "cursor-pointer"}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (currentPage >= totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i)}
                className={currentPage === i ? "cursor-pointer" : "cursor-pointer"}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } else {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i)}
                className={currentPage === i ? "cursor-pointer" : "cursor-pointer"}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => setCurrentPage(totalPages)}
              className={currentPage === totalPages ? "cursor-pointer" : "cursor-pointer"}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    return items;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personnel Hospitalier</h1>
          <p className="text-muted-foreground">
            Gérez le personnel médical et administratif des établissements de santé.
          </p>
        </div>
        <Link href="/hospital-staff/add">
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un membre
          </Button>
        </Link>
      </div>

      {/* Filtres et recherche */}
      <HospitalStaffFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleFiltersReset}
        isOpen={showAdvancedFilters}
        onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
      />

      {/* Tableau du personnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Liste du personnel ({total})
          </CardTitle>
          {/* Debug info */}
          <div className="text-xs text-muted-foreground mt-2">
            Debug: Loading: {loading ? 'true' : 'false'}, Staff count: {staff.length}, Total: {total}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Chargement du personnel...</p>
              </div>
            </div>
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
                        Personnel
                        {getSortIcon('given_name')}
                      </div>
                    </TableHead>
                    <TableHead>Spécialité</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('department')}
                    >
                      <div className="flex items-center gap-2">
                        Département
                        {getSortIcon('department')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('health_facility_id')}
                    >
                      <div className="flex items-center gap-2">
                        Établissement
                        {getSortIcon('health_facility_id')}
                      </div>
                    </TableHead>
                    <TableHead>Expérience</TableHead>
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
                  {staff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-center">
                          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            {searchTerm || filters.search || filters.specialty || filters.department
                              ? 'Aucun membre du personnel trouvé pour cette recherche.' 
                              : 'Aucun membre du personnel enregistré.'
                            }
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {searchTerm || filters.search || filters.specialty || filters.department
                              ? 'Essayez de modifier vos critères de recherche.'
                              : 'Commencez par ajouter le premier membre du personnel.'
                            }
                          </p>
                          <Link href="/hospital-staff/add">
                            <Button>
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter le premier membre
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    staff.map((member) => (
                      <TableRow key={member.id_}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-md font-medium">
                              {getStaffDisplayName(member).substring(0, 2).toUpperCase() || 'ST'}
                            </div>
                            <div>
                              <div className="font-medium">{getStaffDisplayName(member)}</div>
                              <div className="text-md text-muted-foreground">Matricule: {member.matricule}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {getSpecialtyLabel(member.specialty)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getDepartmentLabel(member.department)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-md">
                            {member.year_of_exp} an{member.year_of_exp > 1 ? 's' : ''}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Switch 
                            checked={member.is_active}
                            onCheckedChange={() => handleToggleStatus(member.id_)}
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
                                  const modalButton = document.querySelector(`[data-hospital-staff-view="${member.id_}"]`) as HTMLButtonElement;
                                  if (modalButton) modalButton.click();
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => {
                                  const modalButton = document.querySelector(`[data-hospital-staff-edit="${member.id_}"]`) as HTMLButtonElement;
                                  if (modalButton) modalButton.click();
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="cursor-pointer text-red-600"
                                onClick={() => {
                                  const modalButton = document.querySelector(`[data-hospital-staff-delete="${member.id_}"]`) as HTMLButtonElement;
                                  if (modalButton) modalButton.click();
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          {/* Boutons cachés pour déclencher les modals */}
                          <div className="hidden">
                            <ViewHospitalStaffModal staff={member} />
                            <EditHospitalStaffModal staff={member} onStaffUpdated={handleStaffUpdated} />
                            <DeleteHospitalStaffModal staff={member} onStaffDeleted={handleStaffDeleted} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <p className="text-md text-muted-foreground">
                    Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, total)} sur {total} résultats
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
                <div className="flex-1 flex justify-end">
                  <Pagination className="justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {generatePaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
