import { 
  PatientInsurance, 
  CreatePatientInsuranceRequest, 
  CreatePatientInsuranceResponse,
  ListPatientInsuranceQueryParams, 
  ListPatientInsuranceQM 
} from '../types/patient-insurance.types';
import { FetchService } from '@/features/core/services/fetch.service';

export class PatientInsuranceService {
  
  static async getPatientInsurances(params?: ListPatientInsuranceQueryParams): Promise<ListPatientInsuranceQM> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.patient_id) queryParams.append('patient_id', params.patient_id);
    if (params?.insurance_id) queryParams.append('insurance_id', params.insurance_id);
    if (params?.patient_full_name) queryParams.append('patient_full_name', params.patient_full_name);
    if (params?.insurance_name) queryParams.append('insurance_name', params.insurance_name);
    if (params?.policy_number) queryParams.append('policy_number', params.policy_number);
    if (params?.priority) queryParams.append('priority', params.priority.toString());
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params?.deleted_at) queryParams.append('deleted_at', params.deleted_at);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const endpoint = `patient-insurances${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('Fetching patient insurances from:', endpoint);
    
    return FetchService.get<ListPatientInsuranceQM>(endpoint, 'Patient insurances');
  }

  static async getPatientInsuranceById(id: string): Promise<PatientInsurance> {
    console.log('Fetching patient insurance by ID:', id);
    return FetchService.get<PatientInsurance>(`patient-insurances/${id}`, 'Patient insurance');
  }

  static async createPatientInsurance(data: CreatePatientInsuranceRequest): Promise<CreatePatientInsuranceResponse> {
    console.log('Creating patient insurance:', data);
    return FetchService.post<CreatePatientInsuranceResponse>('patient-insurances', data, 'Patient insurance');
  }

  static async updatePatientInsurance(id: string, data: Partial<CreatePatientInsuranceRequest>): Promise<PatientInsurance> {
    console.log('Updating patient insurance:', id, data);
    return FetchService.put<PatientInsurance>(`patient-insurances/${id}`, data, 'Patient insurance');
  }

  static async deletePatientInsurance(id: string): Promise<void> {
    console.log('Soft deleting patient insurance:', id);
    return FetchService.delete<void>(`patient-insurances/${id}/soft-delete`, 'Patient insurance');
  }

  static async permanentlyDeletePatientInsurance(id: string): Promise<void> {
    console.log('Permanently deleting patient insurance:', id);
    return FetchService.delete<void>(`patient-insurances/${id}`, 'Patient insurance');
  }

  static async restorePatientInsurance(id: string): Promise<PatientInsurance> {
    console.log('Restoring patient insurance:', id);
    return FetchService.patch<PatientInsurance>(`patient-insurances/${id}/restore`, {}, 'Patient insurance');
  }

  static async togglePatientInsuranceStatus(id: string, isActive: boolean): Promise<PatientInsurance> {
    console.log('Toggling patient insurance status:', id, isActive);
    return FetchService.patch<PatientInsurance>(`patient-insurances/${id}/toggle-status`, { is_active: isActive }, 'Patient insurance');
  }

  // Helper methods
  static async getPatientInsurancesByPatientId(patientId: string, params?: Omit<ListPatientInsuranceQueryParams, 'patient_id'>): Promise<ListPatientInsuranceQM> {
    return this.getPatientInsurances({ ...params, patient_id: patientId });
  }

  static async getPatientInsurancesByInsuranceId(insuranceId: string, params?: Omit<ListPatientInsuranceQueryParams, 'insurance_id'>): Promise<ListPatientInsuranceQM> {
    return this.getPatientInsurances({ ...params, insurance_id: insuranceId });
  }

  static async getActivePatientInsurances(params?: Omit<ListPatientInsuranceQueryParams, 'is_active'>): Promise<ListPatientInsuranceQM> {
    return this.getPatientInsurances({ ...params, is_active: true });
  }

  static async getInactivePatientInsurances(params?: Omit<ListPatientInsuranceQueryParams, 'is_active'>): Promise<ListPatientInsuranceQM> {
    return this.getPatientInsurances({ ...params, is_active: false });
  }
}
