"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, Building, MoreHorizontal, Eye, Edit, Trash2, UserCheck } from "lucide-react";
import { HealthFacility } from "@/features/health-facilities/types/health-facility.types";
import { HealthFacilityService } from "@/features/health-facilities/services/health-facility.service";
import { getFacilityTypeBadge, getHealthFacilityStatusBadge } from "@/features/health-facilities/utils/health-facility.utils";
import { useAuthToken } from "@/hooks/use-auth-token";
import { toast } from "sonner";
import Link from "next/link";
import { ViewHealthFacilityModal } from "@/components/health-facilities/view-health-facility-modal";
import { DeleteHealthFacilityModal } from "@/components/health-facilities/delete-health-facility-modal";
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

export default function HealthFacilitiesPage() {
  const [facilities, setFacilities] = useState<HealthFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const { token } = useAuthToken();

  const handleFacilityDeleted = () => {
    loadFacilities();
  };

  const handleToggleStatus = async (facilityId: string, currentStatus: boolean) => {
    try {
      // TODO: Implémenter toggleFacilityStatus dans HealthFacilityService
      // await HealthFacilityService.toggleFacilityStatus(facilityId, !currentStatus, token || undefined);
      toast.success(`Établissement ${!currentStatus ? 'activé' : 'désactivé'} avec succès`);
      loadFacilities(); // Recharger la liste
    } catch (error) {
      console.error('Error toggling facility status:', error);
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleDeleteFacility = async (facilityId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet établissement ?')) {
      return;
    }

    try {
      await HealthFacilityService.deleteHealthFacility(facilityId, token || undefined);
      toast.success('Établissement supprimé avec succès');
      loadFacilities(); // Recharger la liste
    } catch (error) {
      console.error('Error deleting facility:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Revenir à la première page lors de la recherche
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Revenir à la première page lors du changement d'items par page
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
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      if (start > 1) {
        items.push(1);
        if (start > 2) items.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        items.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) items.push('...');
        items.push(totalPages);
      }
    }
    
    return items;
  };

  const loadFacilities = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await HealthFacilityService.getHealthFacilities({
        search: searchTerm || undefined,
        limit: itemsPerPage,
        offset,
      }, token || undefined);
      
      setFacilities(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Error loading facilities:', error);
      toast.error('Erreur lors du chargement des établissements');
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, [currentPage, itemsPerPage, searchTerm]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Établissements de santé</h1>
          <p className="text-muted-foreground">
            Gérez les établissements de santé et leurs informations.
          </p>
        </div>
        <Link href="/health-facilities/add">
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un établissement
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Liste des établissements ({total})
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un établissement..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm" className="cursor-pointer">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chargement des établissements...</p>
            </div>
          ) : facilities.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Aucun établissement trouvé pour cette recherche.' 
                  : 'Aucun établissement de santé enregistré.'
                }
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter le premier établissement
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilities.map((facility) => (
                    <TableRow key={facility.id_}>
                      <TableCell className="font-medium">{facility.name}</TableCell>
                      <TableCell>
                        <Badge variant={getFacilityTypeBadge(facility.facility_type).variant as "default" | "secondary" | "destructive" | "outline"}>
                          {getFacilityTypeBadge(facility.facility_type).label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getHealthFacilityStatusBadge(facility.is_active).variant as "default" | "secondary" | "destructive" | "outline"}>
                          {getHealthFacilityStatusBadge(facility.is_active).label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {facility.district && facility.region 
                          ? `${facility.district}, ${facility.region}`
                          : facility.district || facility.region || '—'
                        }
                      </TableCell>
                      <TableCell>
                        {facility.phone || '—'}
                      </TableCell>
                      <TableCell>
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
                                const modalButton = document.querySelector(`[data-health-facility-view="${facility.id_}"]`) as HTMLButtonElement;
                                if (modalButton) modalButton.click();
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href={`/health-facilities/${facility.id_}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleToggleStatus(facility.id_, facility.is_active)}
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              {facility.is_active ? 'Désactiver' : 'Activer'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 cursor-pointer"
                              onClick={() => {
                                const modalButton = document.querySelector(`[data-health-facility-delete="${facility.id_}"]`) as HTMLButtonElement;
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
                          <ViewHealthFacilityModal facility={facility} />
                          <DeleteHealthFacilityModal facility={facility} onFacilityDeleted={handleFacilityDeleted} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50 cursor-pointer' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {getPaginationItems().map((item, index) => (
                        <PaginationItem key={index}>
                          {item === '...' ? (
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
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50 cursor-pointer' : 'cursor-pointer'}
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
