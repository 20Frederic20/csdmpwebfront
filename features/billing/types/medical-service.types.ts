export enum ServiceCategory {
  CONSULTATION = "CONSULTATION",
  LAB = "LAB",
  HOSPITALIZATION = "HOSPITALIZATION",
  PHARMACY = "PHARMACY",
  IMAGING = "IMAGING",
  OTHER = "OTHER",
}

export interface MedicalService {
  id: string;
  health_facility_id: string;
  code: string;
  label: string;
  base_price: string; // Decimal is usually handled as string in JSON
  category: ServiceCategory;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMedicalServiceDTO {
  health_facility_id: string;
  code: string;
  label: string;
  base_price: number;
  category: ServiceCategory;
}

export interface UpdateMedicalServiceDTO extends Partial<CreateMedicalServiceDTO> {
  is_active?: boolean;
}

export interface ListMedicalServicesQueryParams {
  limit?: number;
  offset?: number;
  category?: ServiceCategory;
  health_facility_id?: string;
  search?: string;
}

export interface ListMedicalServicesQM {
  data: MedicalService[];
  total: number;
}
