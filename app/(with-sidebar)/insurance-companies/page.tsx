'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Filter
} from "lucide-react";
import { InsuranceCompaniesService } from "@/features/insurance-companies/services/insurance-companies.service";
import { InsuranceCompany, ListInsuranceCompanyQueryParams } from "@/features/insurance-companies/types/insurance-companies.types";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import Link from "next/link";
import { ViewInsuranceCompanyModal } from "@/features/insurance-companies/components/view-insurance-company-modal";
import { EditInsuranceCompanyModal } from "@/features/insurance-companies/components/edit-insurance-company-modal";
import { ConfirmModal } from "@/components/ui/modal";

export default function InsuranceCompaniesPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuthRefresh();
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
      await InsuranceCompaniesService.toggleInsuranceCompanyStatus(company.id_, !company.is_active);
      await fetchInsuranceCompanies(currentPage);
    } catch (err) {
      console.error('Failed to toggle status:', err);
      setError('Erreur lors du changement de statut');
    }
  };

  const handleDelete = async (company: InsuranceCompany) => {
    setSelectedCompany(company);
    setDeleteModalOpen(true);
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
    // Update the company in the list
    setInsuranceCompanies(prev => 
      prev.map(company => 
        company.id_ === updatedCompany.id_ ? updatedCompany : company
      )
    );
    // Update the selected company too
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
        <Link href="/insurance-companies/add">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une compagnie
          </Button>
        </Link>
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
            <div className="space-y-4">
              {insuranceCompanies.map((company) => (
                <div key={company.id_} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{company.name}</h3>
                        <Badge variant={company.is_active ? "default" : "secondary"}>
                          {company.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span>Code: {company.insurer_code}</span>
                        </div>
                        {company.contact_phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <span>{company.contact_phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(company)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(company)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(company)}
                      >
                        {company.is_active ? (
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(company)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
