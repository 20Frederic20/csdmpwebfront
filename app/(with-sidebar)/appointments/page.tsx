'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import CustomSelect from "@/components/ui/custom-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal
} from "lucide-react";
import { AppointmentService } from "@/features/appointments/services/appointment.service";
import { Appointment, AppointmentStatus, ListAppointmentQueryParams, AppointmentStatusUpdate } from "@/features/appointments/types/appointment.types";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuthToken } from "@/hooks/use-auth-token";
import { ViewAppointmentModal } from "@/features/appointments/components/view-appointment-modal";
import { EditAppointmentModal } from "@/features/appointments/components/edit-appointment-modal";
import { CreateAppointmentModal } from "@/features/appointments/components/create-appointment-modal";
import { ConfirmModal } from "@/components/ui/modal";
import { DataPagination } from "@/components/ui/data-pagination";
import { toast } from "sonner";

export default function AppointmentsPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuthRefresh();
  const { canAccess } = usePermissions();
  const { token } = useAuthToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  const [search, setSearch] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | undefined>(undefined);
  
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchAppointments = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params: ListAppointmentQueryParams = {
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
        sort_by: 'scheduled_at',
        sort_order: 'asc'
      };

      if (search && search.length >= 3) params.search = search;
      if (filterStatus) params.status = filterStatus;
      if (searchDate) params.scheduled_at = `${searchDate}T00:00:00`;

      const response = await AppointmentService.getAppointments(params);
      setAppointments(response.data);
      setTotal(response.total);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Erreur lors du chargement des rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments(currentPage);
    }
  }, [currentPage, itemsPerPage, token]);

  useEffect(() => {
    if (token) {
      fetchAppointments(1);
    }
  }, [search, token]);

  useEffect(() => {
    if (token) {
      fetchAppointments(1);
    }
  }, [search, searchDate, filterStatus, token]);

  const handleCreateSuccess = (newAppointment: any) => {
    // Ajouter le nouveau rendez-vous localement
    setAppointments(prev => [newAppointment, ...prev]);
    setTotal(prev => prev + 1);
    setRefreshKey(prev => prev + 1);
  };

  const handleUpdate = (updatedAppointment: Appointment) => {
    // Mettre à jour le rendez-vous localement (conserver les infos originales)
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === updatedAppointment.id 
          ? { ...appointment, ...updatedAppointment } 
          : appointment
      )
    );
    setRefreshKey(prev => prev + 1);
    setSelectedAppointment({ ...updatedAppointment });
  };

  const handleDelete = async () => {
    if (!selectedAppointment?.id) return;
    
    try {
      await AppointmentService.deleteAppointment(selectedAppointment.id);
      
      // Mettre à jour l'état localement (conserver les infos originales)
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === selectedAppointment.id 
            ? { ...appointment, deleted_at: new Date().toISOString() } 
            : appointment
        )
      );
      
      toast.success('Rendez-vous supprimé avec succès');
      setDeleteModalOpen(false);
      setSelectedAppointment(null);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      toast.error('Erreur lors de la suppression du rendez-vous');
    }
  };

  const handlePermanentlyDelete = async (id: string) => {
    try {
      await AppointmentService.permanentlyDeleteAppointment(id);
      
      // Retirer de la liste principale
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
      setTotal(prev => prev - 1);
      setRefreshKey(prev => prev + 1);
      
      toast.success('Rendez-vous supprimé définitivement');
    } catch (error) {
      console.error('Failed to permanently delete appointment:', error);
      toast.error('Erreur lors de la suppression définitive');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const restoredAppointment = await AppointmentService.restoreAppointment(id);
      
      // Mettre à jour l'état localement (conserver les infos originales)
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id 
            ? { ...appointment, ...restoredAppointment, deleted_at: undefined } 
            : appointment
        )
      );
      
      setRefreshKey(prev => prev + 1);
      
      toast.success('Rendez-vous restauré avec succès');
    } catch (error) {
      console.error('Failed to restore appointment:', error);
      toast.error('Erreur lors de la restauration');
    }
  };

  const handleUpdateStatus = async (appointment: Appointment, newStatus: AppointmentStatusUpdate) => {
    try {
      const updatedAppointment = await AppointmentService.updateAppointmentStatus(appointment.id, newStatus);
      
      // Mettre à jour l'état localement (conserver les infos originales)
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointment.id 
            ? { ...apt, ...updatedAppointment } 
            : apt
        )
      );
      
      toast.success('Statut mis à jour avec succès');
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setSearchDate('');
    setFilterStatus(undefined);
    setCurrentPage(1);
    fetchAppointments(1);
  };

  // Reset page 1 quand la recherche change
  const handleSearchChange = (field: 'search' | 'date' | 'status', value: string) => {
    if (field === 'search') setSearch(value);
    else if (field === 'date') setSearchDate(value);
    else if (field === 'status') setFilterStatus(value as AppointmentStatus);
    setCurrentPage(1);
  };

  // Reset page 1 quand le nombre d'éléments par page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  // Filtrer les rendez-vous selon le filtre de suppression
  const filteredAppointments = appointments.filter((appointment: Appointment) => {
    return true; // 'all' - pas de filtre sur les supprimés
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    const statusConfig = {
      scheduled: { label: 'Programmé', className: 'bg-blue-100 text-blue-800' },
      confirmed: { label: 'Confirmé', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulé', className: 'bg-red-100 text-red-800' },
      completed: { label: 'Terminé', className: 'bg-gray-100 text-gray-800' },
      no_show: { label: 'Non présenté', className: 'bg-orange-100 text-orange-800' },
      rescheduled: { label: 'Reprogrammé', className: 'bg-purple-100 text-purple-800' }
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
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

  if (!canAccess('appointments', 'read')) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Accès non autorisé</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rendez-vous</h1>
          <p className="text-gray-600">Gérer les rendez-vous des patients</p>
        </div>
        {canAccess('appointments', 'create') && (
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau rendez-vous
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Rechercher et filtrer les rendez-vous</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <Input
                id="search"
                placeholder="Rechercher (min. 3 caractères)"
                value={search}
                onChange={(e) => handleSearchChange('search', e.target.value)}
              />
              {search && search.length < 3 && (
                <p className="text-xs text-gray-500">Minimum 3 caractères requis</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduled_at">Date</Label>
              <Input
                id="scheduled_at"
                type="date"
                value={searchDate}
                onChange={(e) => handleSearchChange('date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filterStatus">Statut</Label>
              <CustomSelect
                options={[
                  { value: '', label: 'Tous les statuts' },
                  { value: 'scheduled', label: 'Programmé' },
                  { value: 'confirmed', label: 'Confirmé' },
                  { value: 'cancelled', label: 'Annulé' },
                  { value: 'completed', label: 'Terminé' },
                  { value: 'no_show', label: 'Non présenté' },
                  { value: 'rescheduled', label: 'Reprogrammé' }
                ]}
                value={filterStatus || ''}
                onChange={(value) => handleSearchChange('status', value as AppointmentStatus)}
                placeholder="Sélectionner un statut"
                height="h-9"
              />
            </div>
            <div className="space-y-2 flex items-end">
              <Button onClick={handleClearFilters} className="w-full">
                Effacer les filtres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des rendez-vous ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-lg">Chargement...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-lg text-red-600">{error}</div>
            </div>
          ) : !loading && !error && filteredAppointments.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-lg text-gray-500">Aucun rendez-vous trouvé</div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Médecin</TableHead>
                    <TableHead>Date/Heure</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                      <div className={`flex items-center gap-3 ${appointment.deleted_at ? 'opacity-60' : ''}`}>
                        {appointment.patient_full_name || appointment.patient_id}
                        {appointment.deleted_at && (
                          <Badge variant="secondary" className="text-xs">
                            Supprimé
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                      <TableCell>{appointment.doctor_full_name || appointment.doctor_id || 'Non assigné'}</TableCell>
                      <TableCell>{appointment.scheduled_at}</TableCell>
                      <TableCell>{appointment.estimated_duration || 'N/A'} min</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canAccess('appointments', 'read') && (
                              <DropdownMenuItem onClick={() => {
                                setSelectedAppointment(appointment);
                                setViewModalOpen(true);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir
                              </DropdownMenuItem>
                            )}
                            {!appointment.deleted_at && canAccess('appointments', 'update') && (
                              <DropdownMenuItem onClick={() => {
                                setSelectedAppointment(appointment);
                                setEditModalOpen(true);
                              }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                            )}
                            {!appointment.deleted_at && canAccess('appointments', 'update') && (
                              <>
                                <DropdownMenuSeparator />
                                {appointment.status === 'scheduled' && (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(appointment, 'confirm')}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Confirmer
                                  </DropdownMenuItem>
                                )}
                                {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(appointment, 'cancel')}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Annuler
                                  </DropdownMenuItem>
                                )}
                                {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(appointment, 'complete')}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Terminer
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}
                            {!appointment.deleted_at && canAccess('appointments', 'delete') && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setDeleteModalOpen(true);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </>
                            )}
                            {appointment.deleted_at && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleRestore(appointment.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Restaurer
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handlePermanentlyDelete(appointment.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer définitivement
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <DataPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedAppointment && (
        <>
          <ViewAppointmentModal
            isOpen={viewModalOpen}
            onClose={() => {
              setViewModalOpen(false);
              setSelectedAppointment(null);
            }}
            appointment={selectedAppointment}
          />
          <EditAppointmentModal
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedAppointment(null);
            }}
            appointment={selectedAppointment}
            onUpdate={handleUpdate}
          />
        </>
      )}
      
      <CreateAppointmentModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
      
      {selectedAppointment && (
        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedAppointment(null);
          }}
          onConfirm={handleDelete}
          title="Supprimer le rendez-vous"
          message={`Êtes-vous sûr de vouloir supprimer le rendez-vous du ${selectedAppointment.scheduled_at} ?`}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      )}
    </div>
  );
}
