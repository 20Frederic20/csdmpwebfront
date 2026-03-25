'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardList } from 'lucide-react';
import { useExamDefinitions, useDeleteExamDefinition } from '@/features/lab-results/hooks/use-lab-exam-definitions';
import { ExamDefinitionModal } from '@/features/lab-results/components/ExamDefinitionModal';
import { examDefinitionColumns } from '@/features/lab-results/components/exam-definition-columns';
import { ExamDefinition, ListExamDefinitionsQueryParams } from '@/features/lab-results/types/lab-exam-definitions.types';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/modal';
import { usePermissionsContext } from '@/contexts/permissions-context';
import { DataTableWithFilters } from '@/components/ui/data-table-with-filters';
import { ExamDefinitionFilters } from '@/features/lab-results/components/exam-definition-filters';
import { TestType } from '@/features/lab-results/types/lab-results.types';

export default function ExamDefinitionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDefinition, setSelectedDefinition] = useState<ExamDefinition | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [definitionToDelete, setDefinitionToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ test_type?: TestType }>({});

  const { canAccess } = usePermissionsContext();

  const params = useMemo((): ListExamDefinitionsQueryParams => ({
    test_type: filters.test_type,
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  }), [filters.test_type, itemsPerPage, currentPage]);

  const { data, isLoading, error } = useExamDefinitions(params);
  const deleteMutation = useDeleteExamDefinition();

  const handleCreate = () => {
    setSelectedDefinition(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = useCallback((definition: ExamDefinition) => {
    setSelectedDefinition(definition);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setDefinitionToDelete(id);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = async () => {
    if (definitionToDelete) {
      await deleteMutation.mutateAsync(definitionToDelete);
      setIsDeleteModalOpen(false);
      setDefinitionToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
            Définitions d&apos;<span className="text-primary">Examens</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Configuration des types d&apos;examens biologiques et de leurs paramètres associés.
          </p>
        </div>
        {canAccess('exam_definitions', 'create') && (
          <Button
            onClick={handleCreate}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all active:scale-95 font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle définition
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white/50 backdrop-blur-sm border-slate-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Définitions</p>
                <p className="text-2xl font-bold text-slate-900">{data?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <DataTableWithFilters
        columns={examDefinitionColumns}
        data={data?.data || []}
        loading={isLoading}
        error={error ? (error as Error).message : null}
        total={data?.total || 0}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        filterComponent={ExamDefinitionFilters}
        initialFilters={filters}
        onFiltersChange={(newFilters) => setFilters(newFilters as any)}
        meta={{
          onEdit: handleEdit,
          onDelete: handleDelete,
          canAccess,
        }}
      />

      <ExamDefinitionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        definition={selectedDefinition}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer la définition"
        message="Êtes-vous sûr de vouloir supprimer cette définition d'examen ? Les résultats existants ne seront pas affectés mais les nouveaux formulaires ne pourront plus charger cette configuration."
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
