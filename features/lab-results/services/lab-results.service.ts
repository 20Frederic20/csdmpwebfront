import { 
  LabResult, 
  CreateLabResultRequest, 
  ListLabResultQueryParams, 
  ListLabResultQM,
  TestType 
} from '../types/lab-results.types';
import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

export class LabResultsService {
  private static readonly BASE_URL = process.env.NODE_ENV === 'development' 
    ? (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1')
    : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1');
  private static readonly API_URL = `${this.BASE_URL}`;

  static async getLabResults(params?: ListLabResultQueryParams): Promise<ListLabResultQM> {
    const queryParams = new URLSearchParams();
    
    if (params?.patient_id) queryParams.append('patient_id', params.patient_id);
    if (params?.performer_id) queryParams.append('performer_id', params.performer_id);
    if (params?.test_type) queryParams.append('test_type', params.test_type);
    if (params?.date_performed_from) queryParams.append('date_performed_from', params.date_performed_from);
    if (params?.date_performed_to) queryParams.append('date_performed_to', params.date_performed_to);
    if (params?.date_reported_from) queryParams.append('date_reported_from', params.date_reported_from);
    if (params?.date_reported_to) queryParams.append('date_reported_to', params.date_reported_to);
    if (params?.issuing_facility) queryParams.append('issuing_facility', params.issuing_facility);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = `${this.API_URL}/lab-results${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('Fetching lab results from:', url);
    
    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lab results: ${response.statusText} (${response.status})`);
    }

    return response.json();
  }

  static async getLabResultById(id: string): Promise<LabResult> {
    const url = `${this.API_URL}/lab-results/${id}`;
    
    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lab result: ${response.statusText}`);
    }

    return response.json();
  }

  static async createLabResult(labResultData: CreateLabResultRequest): Promise<LabResult> {
    const url = `${this.API_URL}/lab-results`;
    
    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'POST',
      body: JSON.stringify(labResultData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create lab result: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateLabResult(id: string, labResultData: Partial<CreateLabResultRequest>): Promise<LabResult> {
    const url = `${this.API_URL}/lab-results/${id}`;
    
    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'PUT',
      body: JSON.stringify(labResultData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update lab result: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteLabResult(id: string): Promise<void> {
    console.log('Soft deleting lab result:', id);
    return FetchService.delete<void>(`lab-results/${id}/soft-delete`, 'Lab result');
  }

  static async toggleLabResultStatus(id: string, isActive: boolean): Promise<LabResult> {
    return this.updateLabResult(id, { is_active: isActive });
  }

  static async getLabResultsByPatientId(patientId: string, params?: Omit<ListLabResultQueryParams, 'patient_id'>): Promise<ListLabResultQM> {
    return this.getLabResults({ ...params, patient_id: patientId });
  }

  static async getLabResultsByTestType(testType: TestType, params?: Omit<ListLabResultQueryParams, 'test_type'>): Promise<ListLabResultQM> {
    return this.getLabResults({ ...params, test_type: testType });
  }

  static async getLabResultsByPerformerId(performerId: string, params?: Omit<ListLabResultQueryParams, 'performer_id'>): Promise<ListLabResultQM> {
    return this.getLabResults({ ...params, performer_id: performerId });
  }
}
