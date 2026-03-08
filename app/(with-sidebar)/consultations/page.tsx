"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  useConsultations,
  useDeleteConsultation,
  useRestoreConsultation,
  usePermanentlyDeleteConsultation,
  useToggleConsultationStatus,
} from "@/features/consultations/hooks/use-consultations";
import { consultationColumns } from "@/features/consultations/components/consultation-columns";
import { ConsultationFiltersWrapper } from "@/features/consultations/components/consultation-filters-wrapper";
import { DataTableWithFilters } from "@/components/ui/data-table-with-filters";
import { usePermissionsContext } from "@/contexts/permissions-context";
import { UserRole } from "@/features/auth/types/roles.types";
import { ConsultationQueryParams, ConsultationQM } from "@/features/consultations";
import Link from "next/link";

const INITIAL_FILTERS = {
  search: "",
  status: "",
};

export default function ConsultationsPage() {
  const { canAccess, user: currentUser, hasRole } = usePermissionsContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Filtrage par health_facility selon le rôle
  const isSuperAdmin = hasRole(UserRole.SUPER_ADMIN);
  const userFacilityId = currentUser?.health_facility_id;

  const queryParams: ConsultationQueryParams = {
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    ...(filters.search && { search: filters.search }),
    ...(filters.status && { status: filters.status }),
    ...(!isSuperAdmin && userFacilityId && { health_facility_id: userFacilityId }),
  };

  const { data: consultationsData, isLoading: loading, error: queryError } = useConsultations(queryParams);
  const { mutateAsync: deleteConsultation } = useDeleteConsultation();
  const { mutateAsync: restoreConsultation } = useRestoreConsultation();
  const { mutateAsync: permanentlyDeleteConsultation } = usePermanentlyDeleteConsultation();
  const { mutateAsync: toggleStatus } = useToggleConsultationStatus();

  const error = queryError instanceof Error ? queryError.message : (queryError ? String(queryError) : null);

  const consultations = consultationsData?.data || [];
  const total = consultationsData?.total || 0;

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters as typeof INITIAL_FILTERS);
    setCurrentPage(1);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id);
    } catch {
      // Handled by hook
    }
  };

  const handleDeleteConsultation = async (consultation: ConsultationQM) => {
    try {
      await deleteConsultation(consultation.id_);
    } catch {
      // Handled by hook
    }
  };

  const handleRestoreConsultation = async (consultation: ConsultationQM) => {
    try {
      await restoreConsultation(consultation.id_);
    } catch {
      // Handled by hook
    }
  };

  const handlePermanentlyDeleteConsultation = async (consultation: ConsultationQM) => {
    try {
      await permanentlyDeleteConsultation(consultation.id_);
    } catch {
      // Handled by hook
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
          <p className="text-muted-foreground">
            Gérer les consultations médicales et les dossiers patients.
          </p>
        </div>
        {canAccess("consultations", "create") && (
          <Link href="/consultations/add">
            <Button className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle consultation
            </Button>
          </Link>
        )}
      </div>

      {/* DataTable avec filtres */}
      <DataTableWithFilters
        columns={consultationColumns}
        data={consultations}
        loading={loading}
        error={error}
        total={total}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        filterComponent={ConsultationFiltersWrapper}
        initialFilters={INITIAL_FILTERS}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
        onFiltersChange={handleFiltersChange}
        meta={{
          canAccess,
          onToggleStatus: handleToggleStatus,
          onDeleteConsultation: handleDeleteConsultation,
          onRestoreConsultation: handleRestoreConsultation,
          onPermanentlyDeleteConsultation: handlePermanentlyDeleteConsultation,
        }}
      />
    </div>
  );
}
