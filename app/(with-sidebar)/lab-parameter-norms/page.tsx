"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Activity } from "lucide-react";
import { 
  useLabParameterNorms, 
  useDeleteLabParameterNorm 
} from "@/features/lab-parameter-norms/hooks/use-lab-parameter-norms";
import { LabParameterNormModal } from "@/features/lab-parameter-norms/components/lab-parameter-norm-modal";
import { labParameterNormColumns } from "@/features/lab-parameter-norms/components/lab-parameter-norm-columns";
import { LabParameterNormFilters } from "@/features/lab-parameter-norms/components/lab-parameter-norm-filters";
import { LabParameterNorm, ListLabParameterNormsQueryParams } from "@/features/lab-parameter-norms/types/lab-parameter-norms.types";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ui/modal";
import { usePermissionsContext } from "@/contexts/permissions-context";
import { DataTableWithFilters } from "@/components/ui/data-table-with-filters";

export default function LabParameterNormsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNorm, setSelectedNorm] = useState<LabParameterNorm | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [normToDelete, setNormToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    parameter_codes: "",
  });

  const { canAccess } = usePermissionsContext();
  
  const params = useMemo((): ListLabParameterNormsQueryParams => {
    return {
      parameter_codes: filters.parameter_codes || undefined,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    };
  }, [filters.parameter_codes, itemsPerPage, currentPage]);

  const { data, isLoading, error } = useLabParameterNorms(params);
  const deleteMutation = useDeleteLabParameterNorm();

  const handleCreate = () => {
    setSelectedNorm(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = useCallback((norm: LabParameterNorm) => {
    setSelectedNorm(norm);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setNormToDelete(id);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = async () => {
    if (normToDelete) {
      await deleteMutation.mutateAsync(normToDelete);
      setIsDeleteModalOpen(false);
      setNormToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
            Normes de <span className="text-primary">Laboratoire</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Configuration des plages de référence biologiques par âge, genre et état physiologique.
          </p>
        </div>
        {canAccess("lab_parameter_norms", "create") && (
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all active:scale-95 font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle norme
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white/50 backdrop-blur-sm border-slate-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Normes</p>
                <p className="text-2xl font-bold text-slate-900">{data?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with DataTable and Filters */}
      <DataTableWithFilters
        columns={labParameterNormColumns}
        data={data?.data || []}
        loading={isLoading}
        error={error ? (error as Error).message : null}
        total={data?.total || 0}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        filterComponent={LabParameterNormFilters}
        initialFilters={filters}
        onFiltersChange={(newFilters) => setFilters(newFilters as any)}
        meta={{
          onEdit: handleEdit,
          onDelete: handleDelete,
          canAccess: canAccess,
        }}
      />

      <LabParameterNormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        norm={selectedNorm}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer la norme"
        message="Êtes-vous sûr de vouloir supprimer cette norme de référence ? Cette opération impactera l'interprétation des résultats futurs pour ce paramètre."
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
