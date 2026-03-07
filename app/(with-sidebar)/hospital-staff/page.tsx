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
      await HospitalStaffService.deleteHospitalStaff(id, token || undefined);

      const canViewDeleted = canAccess('hospital_staffs', 'delete');

      if (canViewDeleted) {
        setStaff(prevStaff => {
          const updated = prevStaff.map(member =>
            member.id_ === id ? {
              ...member,
              deleted_at: new Date().toISOString(),
              is_active: false
            } : member
          );
          return updated;
        });
        toast.success('Personnel supprimé avec succès');
      } else {
        setStaff(prevStaff => {
          const filtered = prevStaff.filter(member => member.id_ !== id);
          console.log('Staff après filtrage:', filtered);
          return filtered;
        });
        setTotal(prevTotal => prevTotal - 1);
        toast.success('Personnel supprimé avec succès');
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handleStaffPermanentlyDeleted = async (id: string) => {
    try {
      await HospitalStaffService.permanentlyDeleteHospitalStaff(id, token || undefined);

      // Retirer de la liste
      setStaff(prevStaff => prevStaff.filter(member => member.id_ !== id));
      setTotal(prevTotal => prevTotal - 1);

      toast.success('Personnel supprimé définitivement');
    } catch (error: any) {
      console.error('Error permanently deleting staff:', error);
      toast.error(error.message || "Erreur lors de la suppression définitive");
    }
  };

  const handleStaffRestored = async (id: string) => {
    try {
      const restoredStaff = await HospitalStaffService.restoreHospitalStaff(id, token || undefined);

      // Mettre à jour l'état localement sans recharger
      setStaff(prevStaff =>
        prevStaff.map(member =>
          member.id_ === id ? {
            ...member,
            ...restoredStaff,
            deleted_at: null,
            is_active: true
          } : member
        )
      );

      toast.success('Personnel restauré avec succès');
    } catch (error: any) {
      console.error('Error restoring staff:', error);
      toast.error(error.message || "Erreur lors de la restauration");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updatedStaff = await HospitalStaffService.toggleHospitalStaffStatus(id, token || undefined);

      if (updatedStaff && typeof updatedStaff.is_active === 'boolean') {
        // Mettre à jour l'état localement sans recharger toute la liste
        setStaff(prevStaff =>
          prevStaff.map(member =>
            member.id_ === id ? { ...updatedStaff, id_: member.id_ } : member
          )
        );

        toast.success(`Personnel ${updatedStaff.is_active ? 'activé' : 'désactivé'} avec succès`);
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error: any) {
      console.error('Error toggling staff status:', error);
      toast.error(error.message || "Erreur lors du changement de statut");
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
