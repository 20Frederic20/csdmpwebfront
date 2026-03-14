"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Printer, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Invoice, InvoiceStatus } from "../types/billing.types";
import { 
  DataTableActions, 
  ActionConfig 
} from "@/components/ui/generic-columns";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function getInvoiceStatusBadge(status: InvoiceStatus) {
  switch (status) {
    case 'PAID':
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Payée</Badge>;
    case 'DRAFT':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Brouillon</Badge>;
    case 'CANCELLED':
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Annulée</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function formatAmount(amount: string) {
  // Simple check for extremely long strings or scientific notation from user example
  if (amount.length > 20) {
    // Attempt to parse a substring if it looks like a number, or just show first few digits
    const num = parseFloat(amount);
    if (!isNaN(num)) {
       return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(num);
    }
    return amount.substring(0, 10) + "...";
  }
  
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(num);
}

export function getInvoiceActions(invoice: Invoice, meta: any): ActionConfig[] {
  const actions: ActionConfig[] = [
    {
      label: "Voir",
      icon: <Eye className="h-4 w-4" />,
      href: `/billing/${invoice.id}`,
    },
    {
      label: "Imprimer",
      icon: <Printer className="h-4 w-4" />,
      onClick: () => meta?.onPrint?.(invoice),
    }
  ];

  if (invoice.status !== 'PAID' && meta?.canAccess?.('invoices', 'update')) {
    actions.push({
      label: "Marquer comme payée",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: () => meta?.onMarkAsPaid?.(invoice),
      variant: 'success',
    });
  }

  return actions;
}

export const billingColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    header: "N° Facture",
    cell: ({ row }) => {
      const id = row.original.id;
      return <span className="font-medium">#{id.substring(0, 8)}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      return format(new Date(row.original.created_at), "dd MMM yyyy", { locale: fr });
    },
  },
  {
    accessorKey: "total_amount",
    header: "Total",
    cell: ({ row }) => formatAmount(row.original.total_amount),
  },
  {
    accessorKey: "patient_amount",
    header: "Part Patient",
    cell: ({ row }) => formatAmount(row.original.patient_amount),
  },
  {
    accessorKey: "insurance_amount",
    header: "Part Assurance",
    cell: ({ row }) => formatAmount(row.original.insurance_amount),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => getInvoiceStatusBadge(row.original.status),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const invoice = row.original;
      const meta = table.options.meta as any;
      
      return (
        <DataTableActions
          row={row}
          actions={getInvoiceActions(invoice, meta)}
          canAccess={meta?.canAccess}
          resourceName="invoices"
        />
      );
    },
  },
];
