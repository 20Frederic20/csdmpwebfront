"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  useInsuranceCompanies,
  useToggleInsuranceCompanyStatus,
  useDeleteInsuranceCompany,
  useRestoreInsuranceCompany,
  usePermanentlyDeleteInsuranceCompany
} from "@/features/insurance-companies/hooks/use-insurance-companies";
import { InsuranceCompany, ListInsuranceCompanyQueryParams } from "@/features/insurance-companies/types/insurance-companies.types";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import { usePermissionsContext } from "@/contexts/permissions-context";
import { useAuthToken } from "@/hooks/use-auth-token";
import Link from "next/link";
import { ViewInsuranceCompanyModal } from "@/features/insurance-companies/components/view-insurance-company-modal";
import { EditInsuranceCompanyModal } from "@/features/insurance-companies/components/edit-insurance-company-modal";
import { ConfirmModal } from "@/components/ui/modal";
import { DataTableWithFilters } from "@/components/ui/data-table-with-filters";
import { insuranceCompanyColumns } from "@/features/insurance-companies/components/insurance-company-columns";
import { InsuranceCompanyFiltersWrapper } from "@/features/insurance-companies/components/insurance-company-filters-wrapper";

export default function InsuranceCompaniesPage() {
  const { isLoading: authLoading } = useAuthRefresh();
  const { canAccess } = usePermissionsContext();
  const { token } = useAuthToken();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<InsuranceCompany | null>(null);

  const queryParams: ListInsuranceCompanyQueryParams = {
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    sort_by: 'name',
    sort_order: 'asc',
    name: filters.name || undefined,
    insurer_code: filters.insurer_code || undefined,
    is_active: filters.is_active !== undefined && filters.is_active !== null ? filters.is_active : undefined,
  };

  const { data: response, isLoading: loading, error: queryError } = useInsuranceCompanies(queryParams, token || undefined);
  const { mutateAsync: toggleStatus } = useToggleInsuranceCompanyStatus();
  const { mutateAsync: softDelete } = useDeleteInsuranceCompany();
  const { mutateAsync: restore } = useRestoreInsuranceCompany();
  const { mutateAsync: permanentlyDelete } = usePermanentlyDeleteInsuranceCompany();

  const insuranceCompanies = response?.data || [];
  const total = response?.total || 0;
  const error = queryError ? (queryError as any).message : null;

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  const handleFiltersChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleToggleStatus = async (company: InsuranceCompany) => {
    try {
      await toggleStatus({
        id: company.id_,
        isActive: !company.is_active
      });
    } catch (err) {
      // Handled by hook
    }
  };

  const handleDelete = (company: InsuranceCompany) => {
    setSelectedCompany(company);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCompany) return;
    try {
      await softDelete(selectedCompany.id_);
      setDeleteModalOpen(false);
      setSelectedCompany(null);
    } catch (err) {
      // Handled by hook
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restore(id);
    } catch (error) {
      // Handled by hook
    }
  };

  const handlePermanentlyDelete = async (id: string) => {
    try {
      await permanentlyDelete(id);
    } catch (error) {
      // Handled by hook
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

  const handleUpdate = () => {
    setEditModalOpen(false);
  };

  if (authLoading) {
    return (
      <div className="container mx-auto py-8 text-center text-lg">
        Chargement...
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

      <DataTableWithFilters
        title="Liste des compagnies"
        columns={insuranceCompanyColumns}
        data={insuranceCompanies}
        loading={loading}
        error={error}
        total={total}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        filterComponent={InsuranceCompanyFiltersWrapper}
        initialFilters={filters}
        onFiltersChange={handleFiltersChange}
        meta={{
          onToggleStatus: handleToggleStatus,
          onView: handleView,
          onEdit: handleEdit,
          onDelete: handleDelete,
          onRestore: handleRestore,
          onPermanentlyDelete: handlePermanentlyDelete,
          canAccess: canAccess,
        }}
      />

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
