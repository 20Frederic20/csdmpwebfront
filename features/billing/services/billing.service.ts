import { ListInvoicesQM, ListInvoicesQueryParams, Invoice, MarkAsPaidPayload, SubmitPaymentPayload } from '../types/billing.types';
import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

const API_BASE = '/api/v1';

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

    const endpoint = `${API_BASE}/invoices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await AuthClientService.makeAuthenticatedRequest(endpoint, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }

    return response.json();
  }

  static async getInvoiceById(id: string): Promise<Invoice> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/invoices/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoice');
    }

    return response.json();
  }

  static async markAsPaid(id: string, payload: MarkAsPaidPayload): Promise<Invoice> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/invoices/${id}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to mark invoice as paid');
    }

    return response.json();
  }

  static async submitPayment(id: string, payload: SubmitPaymentPayload): Promise<Invoice> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/invoices/${id}/submit-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to submit payment');
    }

    return response.json();
  }
}
