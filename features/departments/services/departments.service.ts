import { 
  Department, 
  DepartmentFilterParams, 
  CreateDepartmentRequest, 
  UpdateDepartmentRequest, 
  ToggleDepartmentStatusRequest,
  DepartmentsResponse,
  DepartmentResponse 
} from '../types/departments.types';
import { FetchService } from '@/features/core/services/fetch.service';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface CacheEntry {
  data: DepartmentsResponse;
  timestamp: number;
}

export class DepartmentService {
  private static cache = new Map<string, CacheEntry>();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private static getCacheKey(params: DepartmentFilterParams): string {
    // Normaliser les paramètres pour ignorer les valeurs undefined
    const normalizedParams: any = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        normalizedParams[key] = value;
      }
    });
    return JSON.stringify(normalizedParams);
  }

  private static getCachedData(params: DepartmentFilterParams): DepartmentsResponse | null {
    const key = this.getCacheKey(params);
    const entry = this.cache.get(key);
    
    if (entry && Date.now() - entry.timestamp < this.CACHE_DURATION) {
      return entry.data;
    }
    
    return null;
  }

  private static setCachedData(params: DepartmentFilterParams, data: DepartmentsResponse): void {
    const key = this.getCacheKey(params);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private static invalidateCache(): void {
    this.cache.clear();
  }

  static async getDepartments(
    params: DepartmentFilterParams = {},
    token?: string
  ): Promise<DepartmentsResponse> {
    // Vérifier le cache en premier
    const cachedData = this.getCachedData(params);
    if (cachedData) {
      console.log('Using cached departments for params:', params);
      return cachedData;
    }
    
    console.log('Fetching departments with params:', params);
    
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `departments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await FetchService.get<DepartmentsResponse>(endpoint, 'Departments');
    
    // Mettre en cache la réponse
    this.setCachedData(params, response);
    
    return response;
  }

  static async getDepartmentById(id: string, token?: string): Promise<Department> {
    console.log('Fetching department by ID:', id);
    return FetchService.get<Department>(`departments/${id}`, 'Department');
  }

  static async createDepartment(
    departmentData: CreateDepartmentRequest, 
    token?: string
  ): Promise<DepartmentResponse> {
    console.log('Creating department:', departmentData);
    const response = await FetchService.post<DepartmentResponse>('departments', departmentData, 'Department');
    // Invalider le cache après création
    this.invalidateCache();
    return response;
  }

  static async updateDepartment(
    id: string, 
    departmentData: UpdateDepartmentRequest, 
    token?: string
  ): Promise<DepartmentResponse> {
    console.log('Updating department:', id, departmentData);
    const response = await FetchService.put<DepartmentResponse>(`departments/${id}`, departmentData, 'Department');
    // Invalider le cache après modification
    this.invalidateCache();
    return response;
  }

  static async deleteDepartment(id: string, token?: string): Promise<void> {
    console.log('Deleting department:', id);
    const response = await FetchService.delete<void>(`departments/${id}`, 'Department');
    // Invalider le cache après suppression
    this.invalidateCache();
    return response;
  }

  static async softDeleteDepartment(id: string, token?: string): Promise<void> {
    console.log('Soft deleting department:', id);
    const response = await FetchService.delete<void>(`departments/${id}/soft-delete`, 'Department');
    // Invalider le cache après suppression
    this.invalidateCache();
    return response;
  }

  static async permanentlyDeleteDepartment(id: string, token?: string): Promise<void> {
    console.log('Permanently deleting department:', id);
    const response = await FetchService.delete<void>(`departments/${id}/permanently-delete`, 'Department');
    // Invalider le cache après suppression
    this.invalidateCache();
    return response;
  }

  static async restoreDepartment(id: string, token?: string): Promise<DepartmentResponse> {
    console.log('Restoring department:', id);
    const response = await FetchService.patch<DepartmentResponse>(`departments/${id}/restore`, {}, 'Department');
    // Invalider le cache après restauration
    this.invalidateCache();
    return response;
  }

  static async toggleDepartmentActivation(
    id: string, 
    token?: string
  ): Promise<DepartmentResponse> {
    console.log('Toggling department activation:', id);
    const response = await FetchService.patch<DepartmentResponse>(`departments/${id}/toggle-activation`, {}, 'Department');
    // Invalider le cache après changement d'état
    this.invalidateCache();
    return response;
  }
}
