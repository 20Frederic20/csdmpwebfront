'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PatientsResponse, Patient } from "@/features/patients";
import { PatientService } from "@/features/patients";
import { useAuthToken } from "@/hooks/use-auth-token";
import { usePermissions } from "@/hooks/use-permissions";
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
  const [patientsData, setPatientsData] = useState<PatientsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    birth_date_from: "",
    genders: "all" as 'male' | 'female' | 'other' | 'unknown' | 'all',
  });
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const { token } = useAuthToken();
  const { canAccess } = usePermissions();

  // États pour les modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isPermanentlyDeleteModalOpen, setIsPermanentlyDeleteModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

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
      const updatedPatient = await PatientService.togglePatientActivation(patientId, token || undefined);

      // Mettre à jour localement sans recharger
      if (updatedPatient && typeof updatedPatient.is_active === 'boolean') {
        setPatientsData(prev => prev ? {
          ...prev,
          data: prev.data.map(p => 
            p.id_ === patientId 
              ? { ...p, is_active: updatedPatient.is_active }
              : p
          ),
        } : null);
        
        toast.success(`Patient ${updatedPatient.is_active ? 'activé' : 'désactivé'} avec succès`);
      }
    } catch (error: any) {
      console.error('Error toggling patient status:', error);
      toast.error(error.message || "Erreur lors de la modification du statut");
      // En cas d'erreur, recharger la liste
      const reloadPatients = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const params = {
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
            search: filters.search || undefined,
            birth_date_from: filters.birth_date_from || undefined,
            genders: filters.genders !== 'all' ? filters.genders : undefined,
          };

          const response = await PatientService.getPatients(params, token || undefined);
          setPatientsData(response);
        } catch (error: any) {
          console.error('Error loading patients:', error);
          setError(error.message || "Erreur lors du chargement des patients");
          toast.error(error.message || "Erreur lors du chargement des patients");
        } finally {
          setLoading(false);
        }
      };
      
      reloadPatients();
    }
  };

  const handlePatientRestored = async () => {
    // Tenter de restaurer via le backend
    if (!selectedPatient?.id_ || !token) return;
    
    try {
      const restoredPatient = await PatientService.restorePatient(selectedPatient.id_, token);
      
      // Si le backend confirme, mettre à jour localement
      setPatientsData(prev => prev ? {
        ...prev,
        data: prev.data.map(p => 
          p.id_ === selectedPatient.id_ 
            ? { ...restoredPatient, deleted_at: undefined, is_active: true }
            : p
        ),
      } : null);
      
      toast.success(`Patient ${selectedPatient.given_name} ${selectedPatient.family_name} restauré avec succès`);
    } catch (error: any) {
      console.error('Error restoring patient:', error);
      toast.error(error.message || 'Erreur lors de la restauration du patient');
      // En cas d'erreur, recharger la liste
      const reloadPatients = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const params = {
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
            search: filters.search || undefined,
            birth_date_from: filters.birth_date_from || undefined,
            genders: filters.genders !== 'all' ? filters.genders : undefined,
          };

          const response = await PatientService.getPatients(params, token || undefined);
          setPatientsData(response);
        } catch (error: any) {
          console.error('Error loading patients:', error);
          setError(error.message || "Erreur lors du chargement des patients");
          toast.error(error.message || "Erreur lors du chargement des patients");
        } finally {
          setLoading(false);
        }
      };
      
      reloadPatients();
    } finally {
      setIsRestoreModalOpen(false);
      setSelectedPatient(null);
    }
  };

  const handlePatientDeleted = () => {
    // Mettre à jour localement pour éviter un rechargement
    setPatientsData(prev => prev ? {
      ...prev,
      data: prev.data.map(p => 
        p.id_ === selectedPatient?.id_ 
          ? { ...p, deleted_at: new Date().toISOString(), is_active: false }
          : p
      ),
      total: prev.total - 1
    } : null);
    setSelectedPatient(null);
    setIsDeleteModalOpen(false);
    toast.success(`Patient ${selectedPatient?.given_name} ${selectedPatient?.family_name} supprimé avec succès`);
  };

  const handlePatientPermanentlyDeleted = () => {
    // Retirer localement de la liste (pas de rechargement nécessaire)
    setPatientsData(prev => prev ? {
      ...prev,
      data: prev.data.filter(p => p.id_ !== selectedPatient?.id_),
      total: prev.total - 1
    } : null);
    setSelectedPatient(null);
    setIsPermanentlyDeleteModalOpen(false);
    toast.success(`Patient ${selectedPatient?.given_name} ${selectedPatient?.family_name} supprimé définitivement avec succès`);
  };

  // Charger les patients
  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
          search: filters.search || undefined,
          birth_date_from: filters.birth_date_from || undefined,
          genders: filters.genders !== 'all' ? filters.genders : undefined,
        };

        const response = await PatientService.getPatients(params, token || undefined);
        setPatientsData(response);
      } catch (error: any) {
        console.error('Error loading patients:', error);
        setError(error.message || "Erreur lors du chargement des patients");
        toast.error(error.message || "Erreur lors du chargement des patients");
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, [currentPage, itemsPerPage, filters, token]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters({
      search: newFilters.search || "",
      birth_date_from: newFilters.birth_date_from || "",
      genders: newFilters.genders || "all",
    });
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
