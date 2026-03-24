import { FetchService } from '@/features/core/services/fetch.service';
import { 
  LabParameterNorm, 
  CreateLabParameterNormRequest, 
  UpdateLabParameterNormRequest, 
  ListLabParameterNormsQueryParams,
  ListLabParameterNormsResponse
} from '../types/lab-parameter-norms.types';

export class LabParameterNormService {
  private static readonly ENDPOINT = 'lab-norms';

  static async getAll(params?: ListLabParameterNormsQueryParams): Promise<ListLabParameterNormsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.parameter_codes) queryParams.append('parameter_codes', params.parameter_codes);
    if (params?.gender) queryParams.append('gender', params.gender);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    return FetchService.get<ListLabParameterNormsResponse>(
      `${this.ENDPOINT}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
      'LabParameterNorms'
    );
  }

  static async getById(id: string): Promise<LabParameterNorm> {
    return FetchService.get<LabParameterNorm>(`${this.ENDPOINT}/${id}`, 'LabParameterNorm');
  }

  static async create(payload: CreateLabParameterNormRequest): Promise<LabParameterNorm> {
    return FetchService.post<LabParameterNorm>(this.ENDPOINT, payload, 'LabParameterNorm');
  }

  static async update(id: string, payload: UpdateLabParameterNormRequest): Promise<LabParameterNorm> {
    return FetchService.put<LabParameterNorm>(`${this.ENDPOINT}/${id}`, payload, 'LabParameterNorm');
  }

  static async delete(id: string): Promise<void> {
    return FetchService.delete<void>(`${this.ENDPOINT}/${id}`, 'LabParameterNorm');
  }
}
