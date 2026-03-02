"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DepartmentsResponse, Department, DepartmentFilterParams } from "@/features/departments/types/departments.types";
import { DepartmentService } from "@/features/departments/services/departments.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { usePermissions } from "@/hooks/use-permissions";
import Link from "next/link";
import { DataTableWithFilters } from "@/components/ui/data-table-with-filters";
import { DeleteDepartmentModal } from "@/features/departments/components/delete-department-modal";
import { AddDepartmentModal } from "@/features/departments/components/add-department-modal";
import { departmentColumns } from "@/features/departments/components/department-columns";
import { DepartmentFiltersWrapper } from "@/features/departments/components/department-filters-wrapper";

export default function DepartmentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [departmentsData, setDepartmentsData] = useState<DepartmentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DepartmentFilterParams>({
    search: "",
    health_facility_id: null,
    code: null,
    is_active: null,
  });
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const { token } = useAuthToken();
  const { canAccess } = usePermissions();

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
      const updatedDepartment = await DepartmentService.toggleDepartmentActivation(departmentId, token || undefined);

      if (updatedDepartment && typeof updatedDepartment.is_active === 'boolean') {
        if (departmentsData) {
          setDepartmentsData({
            ...departmentsData,
            data: departmentsData.data.map(department =>
              department.id_ === departmentId ? updatedDepartment : department
            ),
          });
        }
        toast.success(`Département ${updatedDepartment.is_active ? 'activé' : 'désactivé'} avec succès`);
      }
    } catch (error: any) {
      console.error('Error toggling department status:', error);
      toast.error(error.message || "Erreur lors de la modification du statut");
    }
  };

  const handleDepartmentRestored = (departmentId: string) => {
    // TODO: Implement restore functionality
    toast.info("Fonctionnalité de restauration à venir");
  };

  const handleDepartmentCreated = (newDepartment: any) => {
    // Recharger les données après création
    setDepartmentsData(prev => prev ? {
      ...prev,
      data: [newDepartment, ...prev.data],
      total: prev.total + 1
    } : null);
    toast.success("Département créé avec succès");
  };

  // Charger les départements
  useEffect(() => {
    const loadDepartments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
          search: filters.search || undefined,
          health_facility_id: filters.health_facility_id || undefined,
          code: filters.code || undefined,
          is_active: filters.is_active !== null ? filters.is_active : undefined,
        };

        const response = await DepartmentService.getDepartments(params, token || undefined);
        setDepartmentsData(response);
      } catch (error: any) {
        console.error('Error loading departments:', error);
        setError(error.message || "Erreur lors du chargement des départements");
        toast.error(error.message || "Erreur lors du chargement des départements");
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, [currentPage, itemsPerPage, filters, token]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters({
      search: newFilters.search || "",
      health_facility_id: newFilters.health_facility_id || null,
      code: newFilters.code || null,
      is_active: newFilters.is_active || null,
    });
  };

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
      />

      {/* Modal de suppression */}
      {selectedDepartment && (
        <DeleteDepartmentModal
          department={selectedDepartment}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDepartmentDeleted={() => {
            // Recharger les données après suppression
            setDepartmentsData(prev => prev ? {
              ...prev,
              data: prev.data.filter(d => d.id_ !== selectedDepartment.id_),
              total: prev.total - 1
            } : null);
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
