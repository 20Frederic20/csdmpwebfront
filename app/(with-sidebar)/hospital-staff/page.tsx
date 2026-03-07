"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { HospitalStaff, MedicalSpecialty, HospitalStaffQueryParams } from "@/features/hospital-staff";
import { HospitalStaffService } from "@/features/hospital-staff/services/hospital-staff.service";
import { toast } from "sonner";
import Link from "next/link";
import { useAuthToken } from "@/hooks/use-auth-token";
import { usePermissionsContext } from "@/contexts/permissions-context";
import { useHospitalStaffs } from "@/features/hospital-staff/hooks/use-hospital-staffs";
import { useHospitalStaffMutations } from "@/features/hospital-staff/hooks/use-hospital-staff-mutations";
import { DeleteHospitalStaffModal } from "@/features/hospital-staff/components/delete-hospital-staff-modal";
import { PermanentDeleteHospitalStaffModal } from "@/features/hospital-staff/components/permanent-delete-hospital-staff-modal";
import { DataTableWithFilters } from "@/components/ui/data-table-with-filters";
import { hospitalStaffColumns } from "@/features/hospital-staff/components/hospital-staff-columns";
import { HospitalStaffFiltersWrapper } from "@/features/hospital-staff/components/hospital-staff-filters-wrapper";

export default function HospitalStaffPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortingColumn, setSortingColumn] = useState<string>('user_given_name');
  const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc'>('asc');
  const { token } = useAuthToken();
  const { canAccess } = usePermissionsContext();

  // Mémoriser les permissions pour éviter les rechargements infinis
  const canDeleteStaff = useMemo(() => canAccess('hospital_staffs', 'delete'), [canAccess]);

  // États pour les filtres
  const [filters, setFilters] = useState({
    search: "",
    specialty: "" as MedicalSpecialty | "",
    department_id: "" as string | "",
  });
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  // États pour les modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPermanentDeleteModalOpen, setIsPermanentDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<HospitalStaff | null>(null);

  // Mémoriser les paramètres pour éviter les rechargements multiples
  const params = useMemo((): HospitalStaffQueryParams => {
    const offset = (currentPage - 1) * itemsPerPage;
    return {
      search: filters.search || undefined,
      limit: itemsPerPage,
      offset,
      sort_by: sortingColumn,
      sort_order: sortingOrder,
      specialty: filters.specialty as MedicalSpecialty || undefined,
      department_id: filters.department_id || undefined,
      // Inclure les éléments supprimés si on a le droit de restaurer
      include_deleted: canDeleteStaff,
    };
  }, [currentPage, itemsPerPage, sortingColumn, sortingOrder, filters.search, filters.specialty, filters.department_id, canDeleteStaff]);

  // Utiliser le nouveau hook TanStack Query
  const {
    data: staffData,
    isLoading,
    error: fetchError,
    refetch
  } = useHospitalStaffs(params);

  const {
    deleteStaff,
    permanentDeleteStaff,
    restoreStaff,
    toggleStatus
  } = useHospitalStaffMutations();

  const staff = staffData?.data || [];

  const total = staffData?.total || 0;
  const error = fetchError ? (fetchError as Error).message : null;


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
      specialty: newFilters.specialty || "",
      department_id: newFilters.department_id || "",
    });
  }, []);

  const handleRowSelectionChange = (selection: Record<string, boolean>) => {
    setSelectedRows(selection);
  };

  const handleOpenDeleteModal = (staff: HospitalStaff) => {
    setSelectedStaff(staff);
    setIsDeleteModalOpen(true);
  };

  const handleOpenPermanentDeleteModal = (staff: HospitalStaff) => {
    setSelectedStaff(staff);
    setIsPermanentDeleteModalOpen(true);
  };

  const getStaffDisplayName = (member: HospitalStaff) => {
    if (member.user_given_name && member.user_family_name) {
      return `${member.user_given_name} ${member.user_family_name}`;
    }
    return member.matricule || 'Personnel non identifié';
  };

  const handleFiltersReset = () => {
    setFilters({
      search: "",
      specialty: "" as MedicalSpecialty | "",
      department_id: "" as string | "",
    });
    setCurrentPage(1);
  };

  // Gérer le tri
  const handleSort = (field: string) => {
    if (sortingColumn === field) {
      setSortingOrder(sortingOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortingColumn(field);
      setSortingOrder('asc');
    }
    setCurrentPage(1);
  };

  // Obtenir l'icône de tri pour un champ
  const getSortIcon = (field: string) => {
    if (sortingColumn !== field) {
      return <ChevronsUpDown className="h-4 w-4" />;
    }
    return sortingOrder === 'asc'
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  const handleStaffDeleted = () => {
    refetch();
  };

  const handleStaffSoftDeleted = async (id: string) => {
    try {
      await deleteStaff(id);
    } catch (error) {
      // Les toasts sont gérés dans le hook
    }
  };

  const handleStaffPermanentlyDeleted = async (id: string) => {
    try {
      await permanentDeleteStaff(id);
    } catch (error) {
      // Les toasts sont gérés dans le hook
    }
  };

  const handleStaffRestored = async (id: string) => {
    try {
      await restoreStaff(id);
    } catch (error) {
      // Les toasts sont gérés dans le hook
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id);
    } catch (error) {
      // Les toasts sont gérés dans le hook
    }
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
        {canAccess('hospital_staffs', 'create') && (
          <Link href="/hospital-staff/add">
            <Button className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un membre
            </Button>
          </Link>
        )}
      </div>

      {/* DataTable avec filtres intégrés */}
      <DataTableWithFilters
        columns={hospitalStaffColumns}
        data={staff}
        loading={isLoading}
        error={error}
        total={total}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        enableRowSelection={true}
        onRowSelectionChange={handleRowSelectionChange}
        filterComponent={HospitalStaffFiltersWrapper}
        initialFilters={filters}
        onFiltersChange={handleFiltersChange}
        meta={{
          onToggleStatus: handleToggleStatus,
          onOpenDeleteModal: handleOpenDeleteModal,
          onOpenPermanentDeleteModal: handleOpenPermanentDeleteModal,
          onStaffRestored: handleStaffRestored,
          canAccess: canAccess,
        }}
      />

      {/* Modal de suppression */}
      {selectedStaff && (
        <DeleteHospitalStaffModal
          staff={selectedStaff}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onStaffDeleted={() => {
            // Recharger les données après suppression
            refetch();
            setIsDeleteModalOpen(false);
          }}
        />
      )}

      {/* Modal de suppression définitive */}
      {selectedStaff && (
        <PermanentDeleteHospitalStaffModal
          staff={selectedStaff}
          isOpen={isPermanentDeleteModalOpen}
          onClose={() => setIsPermanentDeleteModalOpen(false)}
          onStaffDeleted={() => {
            // Recharger les données après suppression définitive
            refetch();
            setIsPermanentDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
