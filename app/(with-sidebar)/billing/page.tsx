"use client";

import { useState } from "react";
import { DataTableWithFilters } from "@/components/ui/data-table-with-filters";
import { billingColumns } from "@/features/billing/components/billing-columns";
import { BillingFilters } from "@/features/billing/components/billing-filters";
import { useInvoices, useMarkInvoiceAsPaid } from "@/features/billing/hooks/use-billing";
import { Invoice, PaymentMethod } from "@/features/billing/types/billing.types";
import { usePermissionsContext } from "@/contexts/permissions-context";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import { toast } from "sonner";

export default function BillingPage() {
  const { isLoading: authLoading } = useAuthRefresh();
  const { canAccess, user } = usePermissionsContext();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const { data, isLoading, isError, error } = useInvoices({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    sort_by: 'health_facility_id',
    health_facility_id: user?.health_facility_id,
    ...filters,
  });

  const markAsPaid = useMarkInvoiceAsPaid();

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

  const handlePrint = (invoice: Invoice) => {
    toast.info(`Impression de la facture #${invoice.id.substring(0, 8)}...`);
    // Logic for printing will be implemented later in detail page or here
  };

  const handleMarkAsPaid = async (invoice: Invoice) => {
    try {
      await markAsPaid.mutateAsync({ 
        id: invoice.id, 
        payload: { payment_method: PaymentMethod.CASH } 
      });
    } catch (err) {
      // Error handled by hook
    }
  };

  if (authLoading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!canAccess("invoices", "list")) {
    return <div className="p-8 text-center text-red-500">Vous n'avez pas accès à cette page.</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facturation</h1>
          <p className="text-muted-foreground">
            Gérez les factures des patients et les paiements.
          </p>
        </div>
      </div>

      <DataTableWithFilters
        columns={billingColumns}
        data={data?.data || []}
        loading={isLoading}
        error={isError ? (error as any)?.message : null}
        total={data?.total || 0}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        filterComponent={BillingFilters as any}
        initialFilters={{}}
        onFiltersChange={handleFiltersChange}
        meta={{
          canAccess: canAccess,
          onPrint: handlePrint,
          onMarkAsPaid: handleMarkAsPaid,
        }}
      />
    </div>
  );
}
