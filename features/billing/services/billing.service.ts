import { ListInvoicesQM, ListInvoicesQueryParams, Invoice } from '../types/billing.types';
import { FetchService } from '@/features/core/services/fetch.service';

export class BillingService {
  static async getInvoices(params?: ListInvoicesQueryParams): Promise<ListInvoicesQM> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.patient_id) queryParams.append('patient_id', params.patient_id);
    if (params?.health_facility_id) queryParams.append('health_facility_id', params.health_facility_id);
    if (params?.consultation_id) queryParams.append('consultation_id', params.consultation_id);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const endpoint = `invoices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return FetchService.get<ListInvoicesQM>(endpoint, 'Invoices');
  }

  static async getInvoiceById(id: string): Promise<Invoice> {
    return FetchService.get<Invoice>(`invoices/${id}`, 'Invoice');
  }

  static async markAsPaid(id: string): Promise<Invoice> {
    return FetchService.post<Invoice>(`invoices/${id}/pay`, {}, 'Invoice');
  }
}
