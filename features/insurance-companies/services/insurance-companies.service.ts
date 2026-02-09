import { 
  InsuranceCompany, 
  CreateInsuranceCompanyRequest, 
  ListInsuranceCompanyQueryParams, 
  ListInsuranceCompanyQM 
} from '../types/insurance-companies.types';
import { FetchService } from '@/features/core/services/fetch.service';

export class InsuranceCompaniesService {
  
  static async getInsuranceCompanies(params?: ListInsuranceCompanyQueryParams): Promise<ListInsuranceCompanyQM> {
    const queryParams = new URLSearchParams();
    
    if (params?.name) queryParams.append('name', params.name);
    if (params?.insurer_code) queryParams.append('insurer_code', params.insurer_code);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const endpoint = `insurance-companies${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('Fetching insurance companies from:', endpoint);
    
    return FetchService.get<ListInsuranceCompanyQM>(endpoint, 'Insurance companies');
  }

  static async getInsuranceCompanyById(id: string): Promise<InsuranceCompany> {
    console.log('Fetching insurance company by ID:', id);
    return FetchService.get<InsuranceCompany>(`insurance-companies/${id}`, 'Insurance company');
  }

  static async createInsuranceCompany(data: CreateInsuranceCompanyRequest): Promise<InsuranceCompany> {
    console.log('Creating insurance company:', data);
    return FetchService.post<InsuranceCompany>('insurance-companies', data, 'Insurance company');
  }

  static async updateInsuranceCompany(id: string, data: Partial<CreateInsuranceCompanyRequest>): Promise<InsuranceCompany> {
    console.log('Updating insurance company:', id, data);
    return FetchService.put<InsuranceCompany>(`insurance-companies/${id}`, data, 'Insurance company');
  }

  static async deleteInsuranceCompany(id: string): Promise<void> {
    console.log('Soft deleting insurance company:', id);
    return FetchService.delete<void>(`insurance-companies/${id}/soft-delete`, 'Insurance company');
  }

  static async toggleInsuranceCompanyStatus(id: string, isActive: boolean): Promise<InsuranceCompany> {
    console.log('Toggling insurance company status:', id, isActive);
    return FetchService.patch<InsuranceCompany>(`insurance-companies/${id}/toggle-status`, { is_active: isActive }, 'Insurance company');
  }

  static async getInsuranceCompaniesByName(name: string, params?: Omit<ListInsuranceCompanyQueryParams, 'name'>): Promise<ListInsuranceCompanyQM> {
    return this.getInsuranceCompanies({ ...params, name });
  }

  static async getInsuranceCompaniesByInsurerCode(insurerCode: string, params?: Omit<ListInsuranceCompanyQueryParams, 'insurer_code'>): Promise<ListInsuranceCompanyQM> {
    return this.getInsuranceCompanies({ ...params, insurer_code: insurerCode });
  }

  static async getActiveInsuranceCompanies(params?: Omit<ListInsuranceCompanyQueryParams, 'is_active'>): Promise<ListInsuranceCompanyQM> {
    return this.getInsuranceCompanies({ ...params, is_active: true });
  }

  static async getInactiveInsuranceCompanies(params?: Omit<ListInsuranceCompanyQueryParams, 'is_active'>): Promise<ListInsuranceCompanyQM> {
    return this.getInsuranceCompanies({ ...params, is_active: false });
  }
}
