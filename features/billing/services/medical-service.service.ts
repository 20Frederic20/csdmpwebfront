import { FetchService } from '@/features/core/services/fetch.service';
import {
  CreateMedicalServiceDTO,
  ListMedicalServicesQM,
  ListMedicalServicesQueryParams,
  MedicalService,
  UpdateMedicalServiceDTO,
} from '../types/medical-service.types';

export class MedicalServiceService {
  private static readonly ENDPOINT = 'medical-services';

  static async getMedicalServices(params?: ListMedicalServicesQueryParams): Promise<ListMedicalServicesQM> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.health_facility_id) queryParams.append('health_facility_id', params.health_facility_id);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.include_deleted !== undefined) queryParams.append('include_deleted', params.include_deleted.toString());

    const endpoint = `${this.ENDPOINT}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return FetchService.get<ListMedicalServicesQM>(endpoint, 'Medical Services');
  }

  static async getMedicalServiceById(id: string): Promise<MedicalService> {
    return FetchService.get<MedicalService>(`${this.ENDPOINT}/${id}`, 'Medical Service');
  }

  static async createMedicalService(data: CreateMedicalServiceDTO): Promise<MedicalService> {
    return FetchService.post<MedicalService>(this.ENDPOINT, data, 'Medical Service');
  }

  static async updateMedicalService(id: string, data: UpdateMedicalServiceDTO): Promise<MedicalService> {
    return FetchService.put<MedicalService>(`${this.ENDPOINT}/${id}`, data, 'Medical Service');
  }

  static async deleteMedicalService(id: string): Promise<void> {
    return FetchService.delete(`${this.ENDPOINT}/${id}/soft-delete`, 'Medical Service');
  }

  static async permanentlyDeleteMedicalService(id: string): Promise<void> {
    return FetchService.delete(`${this.ENDPOINT}/${id}`, 'Medical Service');
  }

  static async restoreMedicalService(id: string): Promise<MedicalService> {
    return FetchService.patch<MedicalService>(`${this.ENDPOINT}/${id}/restore`, {}, 'Medical Service');
  }

  static async toggleMedicalServiceStatus(id: string): Promise<MedicalService> {
    return FetchService.patch<MedicalService>(`${this.ENDPOINT}/${id}/toggle-status`, {}, 'Medical Service');
  }
}
