export type InvoiceStatus = 'DRAFT' | 'PAID' | 'CANCELLED' | 'PENDING_CONFIRMATION';
export enum PaymentMethod {
  CASH = "CASH",
  MOMO = "MOMO",
  CARD = "CARD",
  INSURANCE = "INSURANCE",
  FREE_OF_CHARGE = "FREE_OF_CHARGE"
}

export interface MarkAsPaidPayload {
  payment_method: PaymentMethod;
  receipt_number?: string;
}

export interface SubmitPaymentPayload {
  payment_method: PaymentMethod;
  receipt_number?: string;
}

export interface InvoiceLine {
  id: string;
  invoice_id: string;
  service_code: string;
  service_name: string;
  unit_price: string;
  quantity: number;
  total_line: string;
  insurance_share: string;
  patient_share: string;
  source_id: string;
  source_type: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number?: string;
  patient_id: string;
  patient_full_name?: string;
  health_facility_id: string;
  health_facility_name?: string;
  status: InvoiceStatus;
  total_amount: string;
  insurance_amount: string;
  patient_amount: string;
  consultation_id: string;
  receipt_number?: string;
  paid_at?: string;
  lines?: InvoiceLine[];
  created_at: string;
  updated_at: string;
}

export interface ListInvoicesQueryParams {
  limit?: number;
  offset?: number;
  status?: InvoiceStatus;
  patient_id?: string;
  health_facility_id?: string;
  consultation_id?: string;
  sort_by?: 'created_at' | 'total_amount' | 'status' | 'health_facility_id';
  sort_order?: 'asc' | 'desc';
}

export interface ListInvoicesQM {
  data: Invoice[];
  total: number;
}
