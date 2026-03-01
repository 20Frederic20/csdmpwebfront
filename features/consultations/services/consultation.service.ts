import { 
  Consultation, 
  ConsultationQM,
  CreateConsultationRequest, 
  UpdateConsultationRequest,
  CompleteConsultationRequest,
  ListConsultationsQM, 
  ConsultationQueryParams,
  ConsultationStatus
} from '../types/consultations.types';
import { FetchService } from '@/features/core/services/fetch.service';

export class ConsultationService {
  // Récupérer toutes les consultations
  static async getConsultations(
    params?: ConsultationQueryParams
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
  ): Promise<Consultation> {
    console.log('Fetching consultation by ID:', id);
    return FetchService.get<Consultation>(`consultations/${id}`, 'Consultation');
  }

  // Créer une consultation
  static async createConsultation(
    data: CreateConsultationRequest
  ): Promise<Consultation> {
    console.log('Creating consultation:', data);
    return FetchService.post<Consultation>('consultations', data, 'Consultation');
  }

  // Mettre à jour une consultation
  static async updateConsultation(
    id: string,
    data: UpdateConsultationRequest
  ): Promise<Consultation> {
    console.log('Updating consultation:', id, data);
    return FetchService.put<Consultation>(`consultations/${id}`, data, 'Consultation');
  }

  // Compléter une consultation
  static async completeConsultation(
    id: string,
    data: CompleteConsultationRequest
  ): Promise<Consultation> {
    console.log('Completing consultation:', id, data);
    return FetchService.put<Consultation>(`consultations/${id}/complete`, data, 'Consultation');
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
  ): Promise<Consultation> {
    console.log('Restoring consultation:', id);
    return FetchService.patch<Consultation>(`consultations/${id}/restore`, {}, 'Consultation');
  }

  // Supprimer définitivement une consultation
  static async permanentlyDeleteConsultation(
    id: string
  ): Promise<void> {
    console.log('Permanently deleting consultation:', id);
    return FetchService.delete<void>(`consultations/${id}`, 'Consultation');
  }

  // Toggle le statut actif d'une consultation
  static async toggleConsultationStatus(
    id: string,
    token?: string
  ): Promise<Consultation> {
    console.log('Toggling consultation status:', id);
    return FetchService.patch<Consultation>(`consultations/${id}/toggle-status`, {}, 'Consultation');
  }
}
