"use client";

import { useInvoice, useMarkInvoiceAsPaid } from "@/features/billing/hooks/use-billing";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Printer, CheckCircle, Clock, Check, XCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatAmount, getInvoiceStatusBadge } from "@/features/billing/components/billing-columns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: invoice, isLoading, isError } = useInvoice(id as string);
  const markAsPaid = useMarkInvoiceAsPaid();

  const handlePrint = () => {
    window.print();
  };

  const handleMarkAsPaid = async () => {
    if (!invoice) return;
    try {
      await markAsPaid.mutateAsync(invoice.id);
    } catch (err) {}
  };

  if (isLoading) return <div className="p-8 text-center">Chargement...</div>;
  if (isError || !invoice) return <div className="p-8 text-center text-red-500">Erreur lors du chargement de la facture.</div>;

  return (
    <div className="container mx-auto py-6 space-y-6 print:p-0">
      <div className="flex justify-between items-center print:hidden">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          {invoice.status !== 'PAID' && (
            <Button onClick={handleMarkAsPaid} disabled={markAsPaid.isPending}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Marquer comme payée
            </Button>
          )}
        </div>
      </div>

      <Card className="print:border-none print:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Facture #{invoice.id.substring(0, 8)}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Générée le {format(new Date(invoice.created_at), "PPP", { locale: fr })}
            </p>
          </div>
          <div>{getInvoiceStatusBadge(invoice.status)}</div>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Informations Patient</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">ID Patient:</span> {invoice.patient_id}</p>
                <p><span className="text-muted-foreground">ID Consultation:</span> {invoice.consultation_id}</p>
                {invoice.paid_at && (
                  <p><span className="text-muted-foreground">Payée le:</span> {format(new Date(invoice.paid_at), "PPP", { locale: fr })}</p>
                )}
                {invoice.receipt_number && (
                  <p><span className="text-muted-foreground">N° Reçu:</span> {invoice.receipt_number}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Récapitulatif Financier</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Montant Total:</span>
                  <span className="font-medium text-lg">{formatAmount(invoice.total_amount)}</span>
                </div>
                <div className="flex justify-between text-sm text-blue-600">
                  <span>Part Assurance:</span>
                  <span>{formatAmount(invoice.insurance_amount)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Part Patient:</span>
                  <span>{formatAmount(invoice.patient_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Détails des prestations</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">Prix Unitaire</TableHead>
                  <TableHead className="text-center">Quantité</TableHead>
                  <TableHead className="text-right">Part Assurance</TableHead>
                  <TableHead className="text-right">Part Patient</TableHead>
                  <TableHead className="text-right font-bold">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.lines?.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <div className="font-medium">{line.service_name}</div>
                      <div className="text-xs text-muted-foreground">{line.service_code}</div>
                    </TableCell>
                    <TableCell className="text-right">{formatAmount(line.unit_price)}</TableCell>
                    <TableCell className="text-center">{line.quantity}</TableCell>
                    <TableCell className="text-right text-blue-600">{formatAmount(line.insurance_share)}</TableCell>
                    <TableCell className="text-right text-green-600">{formatAmount(line.patient_share)}</TableCell>
                    <TableCell className="text-right font-bold">{formatAmount(line.total_line)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end pt-4">
            <div className="w-full md:w-1/3 space-y-2 border-t pt-4">
               <div className="flex justify-between font-bold text-xl">
                 <span>Total à payer:</span>
                 <span>{formatAmount(invoice.patient_amount)}</span>
               </div>
               <p className="text-xs text-muted-foreground text-right italic">
                 Le montant total de la facture est de {formatAmount(invoice.total_amount)}, dont {formatAmount(invoice.insurance_amount)} pris en charge par l'assurance.
               </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="hidden print:block fixed bottom-0 left-0 right-0 p-8 border-t text-xs text-center text-muted-foreground">
        <p>Document généré par CSDMP Dashboard le {format(new Date(), "PPP HH:mm", { locale: fr })}</p>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
          }
          .container {
            width: 100% !important;
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          nav, aside, header, footer, button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
