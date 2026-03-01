'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AppointmentService } from "@/features/appointments/services/appointment.service";
import { Appointment, AppointmentFilterParams } from "@/features/appointments/types/appointments.types";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuthToken } from "@/hooks/use-auth-token";
import { ViewAppointmentModal } from "@/features/appointments/components/view-appointment-modal";
import { EditAppointmentModal } from "@/features/appointments/components/edit-appointment-modal";
import { AddAppointmentModal } from "@/components/appointments/add-appointment-modal";
import { ConfirmModal } from "@/components/ui/modal";
import { DataTableWithFilters } from "@/components/ui/data-table-with-filters";
import { appointmentColumns } from "@/components/appointments/appointment-columns";
import { AppointmentFiltersWrapper } from "@/components/appointments/appointment-filters-wrapper";
import { toast } from "sonner";

export default function AppointmentsPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuthRefresh();
  const { canAccess } = usePermissions();
  const { token } = useAuthToken();
  
  const [appointmentsData, setAppointmentsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState<AppointmentFilterParams>({
    search: "",
    status: null,
    appointment_type: null,
    payment_method: null,
    scheduled_from: null,
    scheduled_to: null,
  });
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  // États pour les modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleOpenViewModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleOpenEditModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteModalOpen(true);
  };

  const handleRowSelectionChange = (selection: Record<string, boolean>) => {
    setSelectedRows(selection);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: AppointmentFilterParams) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleToggleStatus = async (appointmentId: string) => {
    try {
      // TODO: Implement toggle status functionality
      toast.info("Fonctionnalité de changement de statut à venir");
    } catch (error: any) {
      console.error('Error toggling appointment status:', error);
      toast.error(error.message || "Erreur lors de la modification du statut");
    }
  };

  const handleAppointmentUpdated = (updatedAppointment: any) => {
    // Recharger les données après mise à jour
    setAppointmentsData((prev: any) => prev ? {
      ...prev,
      data: prev.data.map((apt: any) => 
        apt.id_ === updatedAppointment.id_ ? updatedAppointment : apt
      )
    } : null);
    toast.success("Rendez-vous mis à jour avec succès");
  };

  const handleAppointmentCreated = (newAppointment: any) => {
    // Recharger les données après création
    setAppointmentsData((prev: any) => prev ? {
      ...prev,
      data: [newAppointment, ...prev.data],
      total: prev.total + 1
    } : null);
    toast.success("Rendez-vous créé avec succès");
  };

  const handleAppointmentDeleted = () => {
    // Recharger les données après suppression
    if (selectedAppointment) {
      setAppointmentsData((prev: any) => prev ? {
        ...prev,
        data: prev.data.filter((apt: any) => apt.id_ !== selectedAppointment.id_),
        total: prev.total - 1
      } : null);
      setIsDeleteModalOpen(false);
      toast.success("Rendez-vous supprimé avec succès");
    }
  };

  // Charger les rendez-vous
  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
          ...filters,
        };
        
        const response = await AppointmentService.getAppointments(params);
        setAppointmentsData(response);
      } catch (error: any) {
        console.error('Error loading appointments:', error);
        setError(error.message || "Erreur lors du chargement des rendez-vous");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadAppointments();
    }
  }, [currentPage, itemsPerPage, filters, token]);

  if (authLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  if (!canAccess('appointments', 'list')) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-muted-foreground">
          Vous n'avez pas les permissions nécessaires pour voir les rendez-vous.
        </div>
      </div>
    );
  }

  const appointments = appointmentsData?.data || [];
  const total = appointmentsData?.total || 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rendez-vous</h1>
          <p className="text-muted-foreground">
            Gérez les rendez-vous du système
          </p>
        </div>
        {canAccess('appointments', 'create') && (
          <Button 
            className="cursor-pointer"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un rendez-vous
          </Button>
        )}
      </div>

      {/* DataTable avec filtres intégrés */}
      <DataTableWithFilters
        title="Liste des rendez-vous"
        columns={appointmentColumns}
        data={appointments}
        loading={loading}
        error={error}
        total={total}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        filterComponent={AppointmentFiltersWrapper}
        initialFilters={filters}
        onFiltersChange={handleFiltersChange}
        meta={{
          onToggleStatus: handleToggleStatus,
          onOpenViewModal: handleOpenViewModal,
          onOpenEditModal: handleOpenEditModal,
          onOpenDeleteModal: handleOpenDeleteModal,
          canAccess: canAccess,
        }}
      />

      {/* Modal d'ajout */}
      <AddAppointmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAppointmentCreated={handleAppointmentCreated}
      />

      {/* Modal de visualisation */}
      {selectedAppointment && (
        <ViewAppointmentModal
          appointment={selectedAppointment}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onAppointmentUpdated={handleAppointmentUpdated}
        />
      )}

      {/* Modal d'édition */}
      {selectedAppointment && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onAppointmentUpdated={handleAppointmentUpdated}
        />
      )}

      {/* Modal de suppression */}
      {selectedAppointment && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleAppointmentDeleted}
          title="Supprimer le rendez-vous"
          message={`Êtes-vous sûr de vouloir supprimer le rendez-vous du ${new Date(selectedAppointment.scheduled_at).toLocaleDateString('fr-FR')} ? Cette action est réversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      )}
    </div>
  );
}