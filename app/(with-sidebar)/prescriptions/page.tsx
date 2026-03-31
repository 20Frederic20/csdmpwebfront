"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Prescription
} from "@/features/prescriptions/types/prescriptions.types";
import { PrescriptionService } from "@/features/prescriptions/services/prescriptions.service";
import { toast } from "sonner";
import { useAuthToken } from "@/hooks/use-auth-token";
import { usePermissionsContext } from "@/contexts/permissions-context";
import { DataTableWithFilters } from "@/components/ui/data-table-with-filters";
import { prescriptionsColumns } from "@/features/prescriptions/components/prescriptions-columns";
import { PrescriptionFiltersWrapper } from "@/features/prescriptions/components/prescriptions-filters-wrapper";

export default function PrescriptionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [sortingColumn, setSortingColumn] = useState<string>('created_at');
  const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    search: "",
    consultation_id: "",
    is_active: true,
  });
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuthToken();
  const { canAccess } = usePermissionsContext();

  const loadPrescriptions = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;

      const response = await PrescriptionService.getPrescriptions({
        search: filters.search || undefined,
        consultation_id: filters.consultation_id || undefined,
        is_active: filters.is_active,
        limit: itemsPerPage,
        offset,
        sort_by: sortingColumn,
        sort_order: sortingOrder,
      }, );

      setPrescriptions(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      toast.error('Erreur lors du chargement des prescriptions');
      setError('Failed to load prescriptions');
      setPrescriptions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters as typeof filters);
    setCurrentPage(1);
  };

  const handleRowSelectionChange = (selection: Record<string, boolean>) => {
    setSelectedRows(selection);
  };

  const handleCreatePrescription = () => {
    router.push('/prescriptions/add');
  };

  const params = useMemo(() => ({
    search: filters.search || undefined,
    consultation_id: filters.consultation_id || undefined,
    is_active: filters.is_active,
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    sort_by: sortingColumn,
    sort_order: sortingOrder,
  }), [currentPage, itemsPerPage, sortingColumn, sortingOrder, filters.search, filters.consultation_id, filters.is_active]);

  useEffect(() => {
    if (isAuthenticated) {
      loadPrescriptions();
    }
  }, [params, isAuthenticated]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground">
            Gérez les prescriptions médicales et traitements.
          </p>
        </div>
        {canAccess('prescriptions', 'create') && (
          <Button className="cursor-pointer" onClick={handleCreatePrescription}>
            Ajouter une prescription
          </Button>
        )}
      </div>

      {/* DataTable avec filtres intégrés */}
      <DataTableWithFilters
        columns={prescriptionsColumns}
        data={prescriptions}
        loading={loading}
        error={error}
        total={total}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        enableRowSelection={true}
        onRowSelectionChange={handleRowSelectionChange}
        filterComponent={PrescriptionFiltersWrapper}
        initialFilters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
}
