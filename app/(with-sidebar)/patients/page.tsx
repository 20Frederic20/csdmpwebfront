'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PatientsResponse, Patient, usePatients, useTogglePatientActivation } from "@/features/patients";
import { usePermissionsContext } from "@/contexts/permissions-context";
import Link from "next/link";
import { DeletePatientModal } from "@/features/patients/components/delete-patient-modal";
import { RestorePatientModal } from "@/features/patients/components/restore-patient-modal";
import { PermanentlyDeletePatientModal } from "@/features/patients/components/permanently-delete-patient-modal";
import { DataTableWithFilters } from "@/components/ui/data-table-with-filters";
import { patientColumns } from "@/features/patients/components/patient-columns";
import { PatientFiltersWrapper } from "@/features/patients/components/patient-filters-wrapper";

export default function PatientsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    search: "",
    birth_date_from: "",
    genders: "all" as 'male' | 'female' | 'other' | 'unknown' | 'all',
  });
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const { canAccess } = usePermissionsContext();

  // États pour les modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isPermanentlyDeleteModalOpen, setIsPermanentlyDeleteModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Queries and Mutations
  const {
    data: patientsData,
    isLoading: loading,
    error: queryError
  } = usePatients({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    search: filters.search || undefined,
    birth_date_from: filters.birth_date_from || undefined,
    genders: filters.genders !== 'all' ? filters.genders : undefined,
  });

  const { mutateAsync: toggleStatus } = useTogglePatientActivation();

  const error = queryError instanceof Error ? queryError.message : (queryError ? String(queryError) : null);

  const handleOpenDeleteModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDeleteModalOpen(true);
  };

  const handleOpenRestoreModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsRestoreModalOpen(true);
  };

  const handleOpenPermanentlyDeleteModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPermanentlyDeleteModalOpen(true);
  };

  const handleRowSelectionChange = (selection: Record<string, boolean>) => {
    setSelectedRows(selection);
  };

  const handleToggleStatus = async (patientId: string) => {
    try {
      await toggleStatus(patientId);
    } catch (err) {
      // Erreur déjà gérée par le hook via toast
    }
  };

  const handlePatientRestored = () => {
    setIsRestoreModalOpen(false);
    setSelectedPatient(null);
  };

  const handlePatientDeleted = () => {
    setSelectedPatient(null);
    setIsDeleteModalOpen(false);
  };

  const handlePatientPermanentlyDeleted = () => {
    setSelectedPatient(null);
    setIsPermanentlyDeleteModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters({
      search: newFilters.search || "",
      birth_date_from: newFilters.birth_date_from || "",
      genders: newFilters.genders || "all",
    });
    setCurrentPage(1); // Retour à la page 1 lors du changement de filtre
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const patients = patientsData?.data || [];
  const total = patientsData?.total || 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Gérez les patients du système
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

      {/* DataTable avec filtres intégrés */}
      <DataTableWithFilters
        columns={patientColumns}
        data={patients}
        loading={loading}
        error={error}
        total={total}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        enableRowSelection={true}
        onRowSelectionChange={handleRowSelectionChange}
        filterComponent={PatientFiltersWrapper}
        initialFilters={filters}
        onFiltersChange={handleFiltersChange}
        meta={{
          onToggleStatus: handleToggleStatus,
          onOpenDeleteModal: handleOpenDeleteModal,
          onRestorePatient: handleOpenRestoreModal,
          onPermanentlyDeletePatient: handleOpenPermanentlyDeleteModal,
          canAccess: canAccess,
        }}
      />

      {/* Modal de suppression */}
      {selectedPatient && (
        <DeletePatientModal
          patient={selectedPatient}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onPatientDeleted={handlePatientDeleted}
        />
      )}

      {/* Modal de restauration */}
      {selectedPatient && (
        <RestorePatientModal
          patient={selectedPatient}
          isOpen={isRestoreModalOpen}
          onClose={() => setIsRestoreModalOpen(false)}
          onPatientRestored={handlePatientRestored}
        />
      )}

      {/* Modal de suppression définitive */}
      {selectedPatient && (
        <PermanentlyDeletePatientModal
          patient={selectedPatient}
          isOpen={isPermanentlyDeleteModalOpen}
          onClose={() => setIsPermanentlyDeleteModalOpen(false)}
          onPatientDeleted={handlePatientPermanentlyDeleted}
        />
      )}
    </div>
  );
}

