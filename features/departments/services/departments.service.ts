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

export class DepartmentService {
  static async getDepartments(
    params: DepartmentFilterParams = {},
    token?: string
  ): Promise<DepartmentsResponse> {
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
    return FetchService.get<DepartmentsResponse>(endpoint, 'Departments');
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
    return FetchService.post<DepartmentResponse>('departments', departmentData, 'Department');
  }

  static async updateDepartment(
    id: string, 
    departmentData: UpdateDepartmentRequest, 
    token?: string
  ): Promise<DepartmentResponse> {
    console.log('Updating department:', id, departmentData);
    return FetchService.put<DepartmentResponse>(`departments/${id}`, departmentData, 'Department');
  }

  static async deleteDepartment(id: string, token?: string): Promise<void> {
    console.log('Deleting department:', id);
    return FetchService.delete<void>(`departments/${id}`, 'Department');
  }

  static async softDeleteDepartment(id: string, token?: string): Promise<void> {
    console.log('Soft deleting department:', id);
    return FetchService.delete<void>(`departments/${id}/soft-delete`, 'Department');
  }

  static async permanentlyDeleteDepartment(id: string, token?: string): Promise<void> {
    console.log('Permanently deleting department:', id);
    return FetchService.delete<void>(`departments/${id}/permanently-delete`, 'Department');
  }

  static async restoreDepartment(id: string, token?: string): Promise<DepartmentResponse> {
    console.log('Restoring department:', id);
    return FetchService.patch<DepartmentResponse>(`departments/${id}/restore`, {}, 'Department');
  }

  static async toggleDepartmentActivation(
    id: string, 
    token?: string
  ): Promise<DepartmentResponse> {
    console.log('Toggling department activation:', id);
    return FetchService.patch<DepartmentResponse>(`departments/${id}/toggle-activation`, {}, 'Department');
  }
}
