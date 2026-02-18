import { 
  Consultation, 
  CreateConsultationRequest, 
  UpdateConsultationRequest, 
  ConsultationResponse,
  ListConsultationsQM, 
  ListConsultationsQueryParams 
} from '../types/consultation.types';
import { FetchService } from '../../core/services/fetch.service';

export class ConsultationService {
  // Récupérer toutes les consultations
  static async getConsultations(
    params?: ListConsultationsQueryParams
  ): Promise<ListConsultationsQM> {
    console.log('Fetching consultations with params:', params);
    
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `consultations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return FetchService.get<ListConsultationsQM>(endpoint, 'Consultations');
  }

  // Récupérer une consultation par ID
  static async getConsultationById(
    id: string
  ): Promise<ConsultationResponse> {
    console.log('Fetching consultation by ID:', id);
    return FetchService.get<ConsultationResponse>(`consultations/${id}`, 'Consultation');
  }

  // Créer une consultation
  static async createConsultation(
    data: CreateConsultationRequest
  ): Promise<ConsultationResponse> {
    console.log('Creating consultation:', data);
    return FetchService.post<ConsultationResponse>('consultations', data, 'Consultation');
  }

  // Mettre à jour une consultation
  static async updateConsultation(
    id: string,
    data: UpdateConsultationRequest
  ): Promise<ConsultationResponse> {
    console.log('Updating consultation:', id, data);
    return FetchService.put<ConsultationResponse>(`consultations/${id}`, data, 'Consultation');
  }

  // Supprimer (soft delete) une consultation
  static async deleteConsultation(
    id: string
  ): Promise<void> {
    console.log('Soft deleting consultation:', id);
    return FetchService.delete<void>(`consultations/${id}/soft-delete`, 'Consultation');
  }

  // Restaurer une consultation
  static async restoreConsultation(
    id: string
  ): Promise<ConsultationResponse> {
    console.log('Restoring consultation:', id);
    return FetchService.patch<ConsultationResponse>(`consultations/${id}/restore`, {}, 'Consultation');
  }

  // Supprimer définitivement une consultation
  static async permanentlyDeleteConsultation(
    id: string
  ): Promise<void> {
    console.log('Permanently deleting consultation:', id);
    return FetchService.delete<void>(`consultations/${id}`, 'Consultation');
  }
}
