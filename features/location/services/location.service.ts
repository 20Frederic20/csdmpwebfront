import { LocationData, Country, Department, City } from '../types/location.types';

class LocationService {
  private static BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  private static data: LocationData | null = null;

  static async fetchLocationData(countryCode: string = 'BJ'): Promise<LocationData> {
    try {
      const [countriesRes, departmentsRes, citiesRes] = await Promise.all([
        fetch(`${this.BASE_URL}/location/countries`),
        fetch(`${this.BASE_URL}/location/departments?country_code=${countryCode}`),
        fetch(`${this.BASE_URL}/location/cities?country_code=${countryCode}`)
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
    try {
      const response = await fetch(`${this.BASE_URL}/location/countries`);
      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }

  static async fetchDepartments(countryCode: string): Promise<Department[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/location/departments?country_code=${countryCode}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch departments: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }

  static async fetchCities(countryCode: string, stateCode?: string): Promise<City[]> {
    const url = stateCode 
      ? `${this.BASE_URL}/location/cities?country_code=${countryCode}&state_code=${stateCode}`
      : `${this.BASE_URL}/location/cities?country_code=${countryCode}`;
      
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch cities: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
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
