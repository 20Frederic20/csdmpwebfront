import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BillingService } from '../services/billing.service';
import { ListInvoicesQueryParams, MarkAsPaidPayload } from '../types/billing.types';
import { toast } from 'sonner';

export const BILLING_KEY = 'billing';

export function useInvoices(params?: ListInvoicesQueryParams) {
    return useQuery({
        queryKey: [BILLING_KEY, params],
        queryFn: () => BillingService.getInvoices(params),
        placeholderData: (previousData) => previousData,
    });
}

export function useInvoice(id: string) {
    return useQuery({
        queryKey: [BILLING_KEY, id],
        queryFn: () => BillingService.getInvoiceById(id),
        enabled: !!id,
    });
}

export function useMarkInvoiceAsPaid() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string, payload: MarkAsPaidPayload }) => BillingService.markAsPaid(id, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [BILLING_KEY] });
            queryClient.invalidateQueries({ queryKey: [BILLING_KEY, data.id] });
            toast.success('Facture marquée comme payée avec succès');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erreur lors de la mise à jour de la facture');
        }
    });
}
