import { InsuranceCompany } from '../types/insurance-companies.types';
import { InsuranceCompaniesService } from './insurance-companies.service';

export class InsuranceCompanySelectService {
  static async getInsuranceCompaniesForSelect(): Promise<InsuranceCompany[]> {
    console.log('Fetching insurance companies for select');
    const response = await InsuranceCompaniesService.getInsuranceCompanies({ 
      limit: 100,
      is_active: true 
    });
    return response.data;
  }

  static async getActiveInsuranceCompanies(): Promise<InsuranceCompany[]> {
    console.log('Fetching active insurance companies');
    const response = await InsuranceCompaniesService.getInsuranceCompanies({ 
      limit: 100,
      is_active: true 
    });
    return response.data;
  }
}
