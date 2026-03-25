import { FetchService } from '@/features/core/services/fetch.service';
import {
  ExamDefinition,
  ExamDefinitionQM,
  ListExamDefinitionsQueryParams,
  CreateExamDefinitionRequest,
  UpdateExamDefinitionRequest,
} from '../types/lab-exam-definitions.types';

export class ExamDefinitionService {
  private static readonly ENDPOINT = 'exam-definitions';

  static async getAll(params?: ListExamDefinitionsQueryParams): Promise<ExamDefinitionQM> {
    const queryParams = new URLSearchParams();
    if (params?.test_type) queryParams.append('test_type', params.test_type);
    if (params?.health_facility_id) queryParams.append('health_facility_id', params.health_facility_id);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    return FetchService.get<ExamDefinitionQM>(
      `${this.ENDPOINT}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
      'ExamDefinitions'
    );
  }

  static async getById(id: string): Promise<ExamDefinition> {
    return FetchService.get<ExamDefinition>(`${this.ENDPOINT}/${id}`, 'ExamDefinition');
  }

  static async create(payload: CreateExamDefinitionRequest): Promise<ExamDefinition> {
    return FetchService.post<ExamDefinition>(this.ENDPOINT, payload, 'ExamDefinition');
  }

  static async update(id: string, payload: UpdateExamDefinitionRequest): Promise<ExamDefinition> {
    return FetchService.put<ExamDefinition>(`${this.ENDPOINT}/${id}`, payload, 'ExamDefinition');
  }

  static async delete(id: string): Promise<void> {
    return FetchService.delete<void>(`${this.ENDPOINT}/${id}`, 'ExamDefinition');
  }
}
