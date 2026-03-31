"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  usePatientInsurances,
  useTogglePatientInsuranceStatus,
  useDeletePatientInsurance,
  useRestorePatientInsurance,
  usePermanentlyDeletePatientInsurance
} from "@/features/patient-insurance/hooks/use-patient-insurances";
import { PatientInsurance, ListPatientInsuranceQueryParams } from "@/features/patient-insurance/types/patient-insurance.types";
import { useAuthToken } from "@/hooks/use-auth-token";
import { usePermissionsContext } from "@/contexts/permissions-context";
import { ViewPatientInsuranceModal } from "@/features/patient-insurance/components/view-patient-insurance-modal";
import { EditPatientInsuranceModal } from "@/features/patient-insurance/components/edit-patient-insurance-modal";
import { CreatePatientInsuranceModal } from "@/features/patient-insurance/components/create-patient-insurance-modal";
import { ConfirmModal } from "@/components/ui/modal";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import { DataTableWithFilters } from "@/components/ui/data-table-with-filters";
import { patientInsuranceColumns } from "@/features/patient-insurance/components/patient-insurance-columns";
import { PatientInsuranceFiltersWrapper } from "@/features/patient-insurance/components/patient-insurance-filters-wrapper";

export default function PatientInsurancePage() {
  const { isLoading: authLoading } = useAuthRefresh();
  const { canAccess } = usePermissionsContext();
  const { isAuthenticated } = useAuthToken();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Search and filter states
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPatientInsurance, setSelectedPatientInsurance] = useState<PatientInsurance | null>(null);

  const queryParams: ListPatientInsuranceQueryParams = {
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    sort_by: 'patient_full_name',
    sort_order: 'asc',
  };

  if (filters.search && filters.search.length >= 3) queryParams.search = filters.search;
  if (filters.policy_number && filters.policy_number.length >= 7) queryParams.policy_number = filters.policy_number;
  if (filters.priority) queryParams.priority = parseInt(filters.priority);
  if (filters.is_active !== undefined && filters.is_active !== null) queryParams.is_active = filters.is_active;

  const { data: response, isLoading: loading, error: queryError } = usePatientInsurances(queryParams);
  const { mutateAsync: toggleStatus } = useTogglePatientInsuranceStatus();
  const { mutateAsync: softDelete } = useDeletePatientInsurance();
  const { mutateAsync: restore } = useRestorePatientInsurance();
  const { mutateAsync: permanentlyDelete } = usePermanentlyDeletePatientInsurance();

  const patientInsurances = response?.data || [];
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

  const handleToggleStatus = async (patientInsurance: PatientInsurance) => {
    try {
      await toggleStatus({
        id: patientInsurance.id_,
        isActive: !patientInsurance.is_active
      });
    } catch (err) {
      // Handled by hook
    }
  };

  const handleDelete = (patientInsurance: PatientInsurance) => {
    setSelectedPatientInsurance(patientInsurance);
    setDeleteModalOpen(true);
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

  const confirmDelete = async () => {
    if (!selectedPatientInsurance) return;
    try {
      await softDelete(selectedPatientInsurance.id_);
      setDeleteModalOpen(false);
      setSelectedPatientInsurance(null);
    } catch (err) {
      // Handled by hook
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

  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
  };

  const handleUpdate = () => {
    setEditModalOpen(false);
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

      <DataTableWithFilters
        title="Liste des assurances"
        columns={patientInsuranceColumns}
        data={patientInsurances}
        loading={loading}
        error={error}
        total={total}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        filterComponent={PatientInsuranceFiltersWrapper}
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
