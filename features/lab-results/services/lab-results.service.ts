import {
  LabResult,
  CreateLabResultRequest,
  ListLabResultQueryParams,
  ListLabResultQM,
  TestType
} from '../types/lab-results.types';
import { FetchService } from '@/features/core/services/fetch.service';

export class LabResultsService {
  private static readonly ENDPOINT = 'lab-results';

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

    const endpoint = `${this.ENDPOINT}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return FetchService.get<ListLabResultQM>(endpoint, 'Lab results');
  }

  static async getLabResultById(id: string): Promise<LabResult> {
    return FetchService.get<LabResult>(`${this.ENDPOINT}/${id}`, 'Lab result');
  }

  static async createLabResult(labResultData: CreateLabResultRequest): Promise<LabResult> {
    return FetchService.post<LabResult>(this.ENDPOINT, labResultData, 'Lab result');
  }

  static async updateLabResult(id: string, labResultData: Partial<CreateLabResultRequest>): Promise<LabResult> {
    return FetchService.put<LabResult>(`${this.ENDPOINT}/${id}`, labResultData, 'Lab result');
  }

  static async deleteLabResult(id: string): Promise<void> {
    return FetchService.delete<void>(`${this.ENDPOINT}/${id}/soft-delete`, 'Lab result');
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

  static async restoreLabResult(id: string): Promise<LabResult> {
    return FetchService.patch<LabResult>(`${this.ENDPOINT}/${id}/restore`, {}, 'Lab result');
  }

  static async permanentlyDeleteLabResult(id: string): Promise<void> {
    return FetchService.delete<void>(`${this.ENDPOINT}/${id}`, 'Lab result');
  }
}
