import {
  Department,
  DepartmentFilterParams,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentsResponse,
  DepartmentResponse
} from '../types/departments.types';
import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

// Utiliser le proxy Next.js pour que les cookies soient correctement envoyés
const API_BASE = '/api/v1';

interface CacheEntry {
  data: DepartmentsResponse;
  timestamp: number;
}

export class DepartmentService {
  private static cache = new Map<string, CacheEntry>();
  private static pendingRequests = new Map<string, Promise<DepartmentsResponse>>();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private static getCacheKey(params: DepartmentFilterParams): string {
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
    this.pendingRequests.clear();
  }

  static async getDepartments(
    params: DepartmentFilterParams = {}
  ): Promise<DepartmentsResponse> {
    const cacheKey = this.getCacheKey(params);

    const cachedData = this.getCachedData(params);
    if (cachedData) {
      return cachedData;
    }

    const pending = this.pendingRequests.get(cacheKey);
    if (pending) {
      console.log('Deduplicating concurrent request for:', cacheKey);
      return pending;
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

    const endpoint = `${API_BASE}/departments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const fetchPromise = (async () => {
      try {
        const response = await AuthClientService.makeAuthenticatedRequest(endpoint, {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }

        const data = await response.json();
        this.setCachedData(params, data);
        return data;
      } finally {
        this.pendingRequests.delete(cacheKey);
      }
    })();

    this.pendingRequests.set(cacheKey, fetchPromise);
    return fetchPromise;
  }

  static async getDepartmentById(id: string): Promise<Department> {
    console.log('Fetching department by ID:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/departments/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch department');
    }

    return response.json();
  }

  static async createDepartment(
    departmentData: CreateDepartmentRequest
  ): Promise<DepartmentResponse> {
    console.log('Creating department:', departmentData);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/departments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(departmentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create department');
    }

    this.invalidateCache();
    return response.json();
  }

  static async updateDepartment(
    id: string,
    departmentData: UpdateDepartmentRequest
  ): Promise<DepartmentResponse> {
    console.log('Updating department:', id, departmentData);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/departments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(departmentData),
    });

    if (!response.ok) {
      throw new Error('Failed to update department');
    }

    this.invalidateCache();
    return response.json();
  }

  static async deleteDepartment(id: string): Promise<void> {
    console.log('Deleting department:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/departments/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete department');
    }

    this.invalidateCache();
  }

  static async softDeleteDepartment(id: string): Promise<void> {
    console.log('Soft deleting department:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/departments/${id}/soft-delete`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to soft delete department');
    }

    this.invalidateCache();
  }

  static async permanentlyDeleteDepartment(id: string): Promise<void> {
    console.log('Permanently deleting department:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/departments/${id}/permanently-delete`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to permanently delete department');
    }

    this.invalidateCache();
  }

  static async restoreDepartment(id: string): Promise<DepartmentResponse> {
    console.log('Restoring department:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/departments/${id}/restore`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to restore department');
    }

    this.invalidateCache();
    return response.json();
  }

  static async toggleDepartmentActivation(
    id: string
  ): Promise<DepartmentResponse> {
    console.log('Toggling department activation:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/departments/${id}/toggle-activation`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to toggle department activation');
    }

    this.invalidateCache();
    return response.json();
  }
}
