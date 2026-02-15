export interface CreateInsuranceCompanyRequest {
  name: string;
  insurer_code: string;
  contact_phone?: string | null;
  is_active?: boolean;
}

export interface InsuranceCompany {
  id_: string;
  name: string;
  insurer_code: string;
  contact_phone?: string | null;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface ListInsuranceCompanyQM {
  data: InsuranceCompany[];
  total: number;
}

export interface ListInsuranceCompanyQueryParams {
  name?: string;
  insurer_code?: string;
  is_active?: boolean;
  deleted_at?: string | null;
  limit?: number;
  offset?: number;
  sort_by?: 'name' | 'insurer_code' | 'created_at';
  sort_order?: 'asc' | 'desc';
}
