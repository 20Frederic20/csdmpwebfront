import { LocationData, Country, Department, City } from '../types/location.types';
import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

class LocationService {
  private static readonly API_BASE = '/api/v1';
  private static data: LocationData | null = null;

  static async fetchLocationData(countryCode: string = 'BJ'): Promise<LocationData> {
    try {
      const [countriesRes, departmentsRes, citiesRes] = await Promise.all([
        AuthClientService.makeAuthenticatedRequest(`${this.API_BASE}/location/countries`),
        AuthClientService.makeAuthenticatedRequest(`${this.API_BASE}/location/departments?country_code=${countryCode}`),
        AuthClientService.makeAuthenticatedRequest(`${this.API_BASE}/location/cities?country_code=${countryCode}`)
      ]);

      if (!countriesRes.ok) {
        throw new Error(`Failed to fetch countries: ${countriesRes.statusText}`);
      }
      if (!departmentsRes.ok) {
        throw new Error(`Failed to fetch departments: ${departmentsRes.statusText}`);
      }
      if (!citiesRes.ok) {
        throw new Error(`Failed to fetch cities: ${citiesRes.statusText}`);
      }

      const countries = await countriesRes.json();
      const departments = await departmentsRes.json();
      const cities = await citiesRes.json();

      this.data = {
        countries,
        departments,
        cities
      };

      return this.data;
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  }

  static async fetchCountries(): Promise<Country[]> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${this.API_BASE}/location/countries`);
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.statusText}`);
    }
    return response.json();
  }

  static async fetchDepartments(countryCode: string): Promise<Department[]> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${this.API_BASE}/location/departments?country_code=${countryCode}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch departments: ${response.statusText}`);
    }
    return response.json();
  }

  static async fetchCities(countryCode: string, stateCode?: string): Promise<City[]> {
    const url = stateCode
      ? `${this.API_BASE}/location/cities?country_code=${countryCode}&state_code=${stateCode}`
      : `${this.API_BASE}/location/cities?country_code=${countryCode}`;

    const response = await AuthClientService.makeAuthenticatedRequest(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.statusText}`);
    }
    return response.json();
  }

  static getCountries(): Country[] {
    return this.data?.countries || [];
  }

  static getDepartments(): Department[] {
    return this.data?.departments || [];
  }

  static getCities(): City[] {
    return this.data?.cities || [];
  }

  static getCitiesByDepartment(stateCode: string): City[] {
    return this.data?.cities.filter(city => city.state_code === stateCode) || [];
  }

  static getDepartmentsByCountry(countryCode: string): Department[] {
    return this.data?.departments.filter(dept => dept.country_code === countryCode) || [];
  }

  static getCitiesByCountry(countryCode: string): City[] {
    return this.data?.cities.filter(city => city.country_code === countryCode) || [];
  }

  static getCountryByCode(countryCode: string): Country | null {
    return this.data?.countries.find(country => country.country_code === countryCode) || null;
  }

  static getDepartmentByCode(deptCode: string): Department | null {
    return this.data?.departments.find(dept => dept.code === deptCode) || null;
  }

  static getCityByCode(cityCode: string): City | null {
    return this.data?.cities.find(city => city.code === cityCode) || null;
  }
}

export default LocationService;
