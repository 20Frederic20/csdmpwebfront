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
  Building2, 
  Phone, 
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
import { InsuranceCompaniesService } from "@/features/insurance-companies/services/insurance-companies.service";
import { InsuranceCompany, ListInsuranceCompanyQueryParams } from "@/features/insurance-companies/types/insurance-companies.types";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuthToken } from "@/hooks/use-auth-token";
import Link from "next/link";
import { ViewInsuranceCompanyModal } from "@/features/insurance-companies/components/view-insurance-company-modal";
import { EditInsuranceCompanyModal } from "@/features/insurance-companies/components/edit-insurance-company-modal";
import { ConfirmModal } from "@/components/ui/modal";
import { toast } from "sonner";

export default function InsuranceCompaniesPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuthRefresh();
  const { canAccess } = usePermissions();
  const { token } = useAuthToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompany[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Filtres
  const [searchName, setSearchName] = useState('');
  const [searchInsurerCode, setSearchInsurerCode] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<InsuranceCompany | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const fetchInsuranceCompanies = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params: ListInsuranceCompanyQueryParams = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        sort_by: 'name',
        sort_order: 'asc'
      };

      if (searchName) params.name = searchName;
      if (searchInsurerCode) params.insurer_code = searchInsurerCode;
      if (filterActive !== undefined) params.is_active = filterActive;

      const response = await InsuranceCompaniesService.getInsuranceCompanies(params);
      setInsuranceCompanies(response.data);
      setTotal(response.total);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch insurance companies:', err);
      setError('Erreur lors du chargement des compagnies d\'assurance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchInsuranceCompanies();
    }
  }, [authLoading]);

  const handleSearch = () => {
    fetchInsuranceCompanies(1);
  };

  const handleClearFilters = () => {
    setSearchName('');
    setSearchInsurerCode('');
    setFilterActive(undefined);
    fetchInsuranceCompanies(1);
  };

  const handleToggleStatus = async (company: InsuranceCompany) => {
    try {
      const updatedCompany = await InsuranceCompaniesService.toggleInsuranceCompanyStatus(company.id_, !company.is_active);
      
      setInsuranceCompanies(prevCompanies => 
        prevCompanies.map(c => 
          c.id_ === company.id_ ? updatedCompany : c
        )
      );
    } catch (err) {
      console.error('Failed to toggle status:', err);
      setError('Erreur lors du changement de statut');
    }
  };

  const handleDelete = async (company: InsuranceCompany) => {
    setSelectedCompany(company);
    setDeleteModalOpen(true);
  };

  const handleSoftDelete = async (id: string) => {
    try {
      await InsuranceCompaniesService.deleteInsuranceCompany(id);
      setInsuranceCompanies(prevCompanies => 
        prevCompanies.map(company => 
          company.id_ === id ? { ...company, deleted_at: new Date().toISOString() } : company
        )
      );
      toast.success('Compagnie supprimée avec succès');
    } catch (error: any) {
      console.error('Error soft deleting company:', error);
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handlePermanentlyDelete = async (id: string) => {
    try {
      await InsuranceCompaniesService.permanentlyDeleteInsuranceCompany(id);
      setInsuranceCompanies(prevCompanies => prevCompanies.filter(company => company.id_ !== id));
      setTotal(prevTotal => prevTotal - 1);
      toast.success('Compagnie supprimée définitivement');
    } catch (error: any) {
      console.error('Error permanently deleting company:', error);
      toast.error(error.message || "Erreur lors de la suppression définitive");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const restoredCompany = await InsuranceCompaniesService.restoreInsuranceCompany(id);
      setInsuranceCompanies(prevCompanies => 
        prevCompanies.map(company => 
          company.id_ === id ? restoredCompany : company
        )
      );
      toast.success('Compagnie restaurée avec succès');
    } catch (error: any) {
      console.error('Error restoring company:', error);
      toast.error(error.message || "Erreur lors de la restauration");
    }
  };

  const confirmDelete = async () => {
    if (!selectedCompany) return;

    try {
      setLoading(true);
      setError(null);
      
      await InsuranceCompaniesService.deleteInsuranceCompany(selectedCompany.id_);
      setDeleteModalOpen(false);
      setSelectedCompany(null);
      await fetchInsuranceCompanies(currentPage);
    } catch (err) {
      console.error('Failed to delete insurance company:', err);
      setError('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (company: InsuranceCompany) => {
    setSelectedCompany(company);
    setViewModalOpen(true);
  };

  const handleEdit = (company: InsuranceCompany) => {
    setSelectedCompany(company);
    setEditModalOpen(true);
  };

  const handleUpdate = (updatedCompany: InsuranceCompany) => {
    
    setInsuranceCompanies(prev => {
      const updatedList = prev.map(company => 
        company.id_ === updatedCompany.id_ ? updatedCompany : company
      );
      return updatedList;
    });
    
    setSelectedCompany(updatedCompany);
  };

  const totalPages = Math.ceil(total / pageSize);

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
          <h1 className="text-3xl font-bold text-gray-900">Compagnies d'Assurance</h1>
          <p className="text-gray-600 mt-2">Gérer les compagnies d'assurance</p>
        </div>
        {canAccess('insurance_companies', 'create') && (
          <Link href="/insurance-companies/add">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une compagnie
            </Button>
          </Link>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
          {error}
        </div>
      )}

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
            <div className="space-y-2">
              <Label htmlFor="searchName">Nom</Label>
              <Input
                id="searchName"
                placeholder="Rechercher par nom..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchInsurerCode">Code assureur</Label>
              <Input
                id="searchInsurerCode"
                placeholder="Rechercher par code..."
                value={searchInsurerCode}
                onChange={(e) => setSearchInsurerCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filterActive">Statut</Label>
              <select
                id="filterActive"
                value={filterActive === undefined ? '' : filterActive.toString()}
                onChange={(e) => setFilterActive(e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Tous</option>
                <option value="true">Actifs</option>
                <option value="false">Inactifs</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Effacer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des compagnies ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : insuranceCompanies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune compagnie d'assurance trouvée
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Nom</TableHead>
                    <TableHead className="w-[150px]">Code assureur</TableHead>
                    <TableHead className="w-[150px]">Téléphone</TableHead>
                    <TableHead className="w-[100px]">Statut</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {insuranceCompanies.map((company) => (
                    <TableRow key={company.id_} className={company.deleted_at ? 'opacity-60' : ''}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-md font-medium ${
                            company.deleted_at 
                              ? 'bg-gray-100 text-gray-500' 
                              : !company.is_active 
                                ? 'bg-gray-100 text-gray-500' 
                                : 'bg-blue-100 text-blue-700'
                          }`}>
                            {company.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {company.name}
                              {company.deleted_at && (
                                <Badge variant="secondary" className="text-xs">
                                  Supprimé
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">{company.insurer_code}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{company.insurer_code}</TableCell>
                      <TableCell>
                        {company.contact_phone ? (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <span>{company.contact_phone}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={company.is_active && !company.deleted_at}
                          onCheckedChange={() => handleToggleStatus(company)}
                          disabled={!!company.deleted_at || !canAccess('insurance_companies', 'update')}
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
                            {canAccess('insurance_companies', 'read') && (
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => handleView(company)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
                              </DropdownMenuItem>
                            )}
                            {canAccess('insurance_companies', 'update') && !company.deleted_at && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => handleEdit(company)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </DropdownMenuItem>
                              </>
                            )}
                            {canAccess('insurance_companies', 'soft_delete') && !company.deleted_at && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer text-red-600"
                                  onClick={() => handleSoftDelete(company.id_)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </>
                            )}
                            {company.deleted_at && canAccess('insurance_companies', 'delete') && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer text-green-600"
                                  onClick={() => handleRestore(company.id_)}
                                >
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  Restaurer
                                </DropdownMenuItem>
                              </>
                            )}
                            {company.deleted_at && canAccess('insurance_companies', 'delete') && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer text-red-600"
                                  onClick={() => handlePermanentlyDelete(company.id_)}
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
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => fetchInsuranceCompanies(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => fetchInsuranceCompanies(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedCompany && (
        <>
          <ViewInsuranceCompanyModal
            isOpen={viewModalOpen}
            onClose={() => setViewModalOpen(false)}
            company={selectedCompany}
          />
          
          <EditInsuranceCompanyModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            company={selectedCompany}
            onUpdate={handleUpdate}
          />
          
          <ConfirmModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title="Supprimer la compagnie d'assurance"
            message={`Êtes-vous sûr de vouloir supprimer la compagnie d'assurance "${selectedCompany.name}" ? Cette action est irréversible.`}
            confirmText="Supprimer"
            loading={loading}
          />
        </>
      )}
    </div>
  );
}
