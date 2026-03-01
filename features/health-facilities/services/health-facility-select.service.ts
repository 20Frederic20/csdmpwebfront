import { HealthFacility } from '@/features/health-facilities/types/health-facility.types';
import { FetchService } from '@/features/core/services/fetch.service';

export class HealthFacilitySelectService {
  static async getHealthFacilitiesForSelect(): Promise<HealthFacility[]> {
    console.log('Fetching health facilities for select');
    
    const response = await FetchService.get<{ data: HealthFacility[]; total: number }>('health-facilities', 'HealthFacilities');
    return response.data || [];
  }

  static async getActiveHealthFacilities(): Promise<HealthFacility[]> {
    console.log('Fetching active health facilities');
    
    const response = await FetchService.get<{ data: HealthFacility[]; total: number }>('health-facilities?is_active=true', 'HealthFacilities');
    return response.data || [];
  }
}
