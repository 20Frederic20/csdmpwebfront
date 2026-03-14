"use client";

import { useState, useMemo } from "react";
import { DataTableWithFilters } from "@/components/ui/data-table-with-filters";
import { getMedicalServiceColumns } from "@/features/billing/components/medical-service-columns";
import { useMedicalServices, useDeleteMedicalService } from "@/features/billing/hooks/use-medical-services";
import { MedicalService } from "@/features/billing/types/medical-service.types";
import { usePermissionsContext } from "@/contexts/permissions-context";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MedicalServiceModal } from "@/features/billing/components/medical-service-modal";
import { MedicalServiceFilters } from "@/features/billing/components/medical-service-filters";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MedicalServicesPage() {
  const { isLoading: authLoading } = useAuthRefresh();
  const { canAccess } = usePermissionsContext();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState<Record<string, any>>({});
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<MedicalService | null>(null);

  const { data, isLoading, isError, error } = useMedicalServices({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    ...filters,
  });

  const deleteService = useDeleteMedicalService();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setSelectedService(null);
    setModalOpen(true);
  };

  const handleEdit = (service: MedicalService) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleDeleteClick = (service: MedicalService) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (serviceToDelete) {
      try {
        await deleteService.mutateAsync(serviceToDelete.id);
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
      } catch (err) {
        // Handled by hook
      }
    }
  };

  const columns = useMemo(() => getMedicalServiceColumns(handleEdit, handleDeleteClick), []);

  if (authLoading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  // Assuming permissions for invoices also apply or there's a medical_services resource
  // For now, let's use invoices:list or if we want to be strict, we'd need to know the backend resource name
  // Based on other pages, it seems consistent with the entity name
  if (!canAccess("medical_services", "list") && !canAccess("invoices", "list")) {
    return <div className="p-8 text-center text-red-500">Vous n'avez pas accès à cette page.</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services Médicaux</h1>
          <p className="text-muted-foreground">
            Gérez le catalogue des services médicaux et leurs tarifs.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un service
        </Button>
      </div>

      <DataTableWithFilters
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        error={isError ? (error as any)?.message : null}
        total={data?.total || 0}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        onFiltersChange={handleFiltersChange}
        filterComponent={MedicalServiceFilters as any}
        initialFilters={{}}
      />

      <MedicalServiceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        service={selectedService}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement le service médical{" "}
              <strong>{serviceToDelete?.label}</strong> ({serviceToDelete?.code}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
