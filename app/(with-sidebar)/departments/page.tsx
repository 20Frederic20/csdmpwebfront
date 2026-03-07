"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  DepartmentsResponse,
  Department,
  DepartmentFilterParams,
  useDepartments,
  useDepartmentMutations
} from "@/features/departments";
import { DepartmentService } from "@/features/departments/services/departments.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { usePermissionsContext } from "@/contexts/permissions-context";
import Link from "next/link";
import { DataTableWithFilters } from "@/components/ui/data-table-with-filters";
import { DeleteDepartmentModal } from "@/features/departments/components/delete-department-modal";
import { AddDepartmentModal } from "@/features/departments/components/add-department-modal";
import { departmentColumns } from "@/features/departments/components/department-columns";
import { DepartmentFiltersWrapper } from "@/features/departments/components/department-filters-wrapper";

export default function DepartmentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState<DepartmentFilterParams>({
    search: "",
    health_facility_id: null,
    code: null,
    is_active: null,
  });
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const { token } = useAuthToken();
  const { user, loading: permissionsLoading, canAccess } = usePermissionsContext();

  const { data: departmentsData, isLoading: loading, error: queryError, refetch } = useDepartments({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    search: filters.search || undefined,
    health_facility_id: user?.health_facility_id || filters.health_facility_id || undefined,
    code: filters.code || undefined,
    is_active: filters.is_active !== null ? filters.is_active : undefined,
  });

  const { toggleStatus, deleteDepartment } = useDepartmentMutations();

  // États pour les modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const handleOpenDeleteModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleRowSelectionChange = (selection: Record<string, boolean>) => {
    setSelectedRows(selection);
  };

  const handleToggleStatus = async (departmentId: string) => {
    try {
      await toggleStatus(departmentId);
    } catch (error: any) {
      console.error('Error toggling department status:', error);
    }
  };

  const handleDepartmentRestored = (departmentId: string) => {
    // TODO: Implement restore functionality if needed in mutations hook
    toast.info("Fonctionnalité de restauration à venir");
  };

  const handleDepartmentCreated = () => {
    // Le refresh est géré par l'invalidation automatique dans le hook de mutation
    setIsAddModalOpen(false);
  };

  const error = queryError ? (queryError as any).message : null;

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  const handleFiltersChange = useCallback((newFilters: Record<string, any>) => {
    setFilters({
      search: newFilters.search || "",
      health_facility_id: newFilters.health_facility_id || null,
      code: newFilters.code || null,
      is_active: newFilters.is_active || null,
    });
  }, []);

  const departments = departmentsData?.data || [];
  const total = departmentsData?.total || 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Départements</h1>
          <p className="text-muted-foreground">
            Gérez les départements du système
          </p>
        </div>
        {canAccess('departments', 'create') && (
          <Button
            className="cursor-pointer"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un département
          </Button>
        )}
      </div>

      {/* DataTable avec filtres intégrés */}
      <DataTableWithFilters
        title="Liste des départements"
        columns={departmentColumns}
        data={departments}
        loading={loading}
        error={error}
        total={total}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        enableRowSelection={true}
        onRowSelectionChange={handleRowSelectionChange}
        filterComponent={DepartmentFiltersWrapper}
        initialFilters={filters}
        onFiltersChange={handleFiltersChange}
        meta={{
          onToggleStatus: handleToggleStatus,
          onOpenDeleteModal: handleOpenDeleteModal,
          onDepartmentRestored: handleDepartmentRestored,
          canAccess: canAccess,
        }}
      />

      {/* Modal d'ajout */}
      <AddDepartmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onDepartmentCreated={handleDepartmentCreated}
        defaultHealthFacilityId={user?.health_facility_id}
      />

      {/* Modal de suppression */}
      {selectedDepartment && (
        <DeleteDepartmentModal
          department={selectedDepartment}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDepartmentDeleted={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}
