import { Country, Department, City } from '../types/location.types';

export function getCountryOptions(countries: Country[]): { value: string; label: string; phonePrefix: string }[] {
  return countries.map(country => ({
    value: country.country_code,
    label: country.country_name,
    phonePrefix: country.phone_prefix
  }));
}

export function getDepartmentOptions(departments: Department[]): { value: string; label: string }[] {
  return departments.map(dept => ({
    value: dept.name,
    label: dept.name
  }));
}

export function getCityOptions(cities: City[]): { value: string; label: string }[] {
  return cities.map(city => ({
    value: city.name,
    label: city.name
  }));
}

export function formatPhoneNumber(phone: string, phonePrefix: string): string {
  if (!phone) return '';
  
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Remove the prefix if it exists
  const cleanPhone = digitsOnly.startsWith(phonePrefix.replace('+', '')) 
    ? digitsOnly.substring(phonePrefix.length - 1)
    : digitsOnly;
  
  return cleanPhone;
}

export function addPhonePrefix(phone: string, phonePrefix: string): string {
  if (!phone) return '';
  
  const cleanPhone = formatPhoneNumber(phone, phonePrefix);
  
  // If phone already has prefix, return as is
  if (phone.startsWith(phonePrefix)) {
    return phone;
  }
  
  return phonePrefix + cleanPhone;
}

export function validatePhoneNumber(phone: string, country: Country): { isValid: boolean; message: string } {
  if (!phone) {
    return { isValid: false, message: 'Le numéro de téléphone est requis' };
  }

  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length !== country.national_length) {
    return { 
      isValid: false, 
      message: `Le numéro doit contenir ${country.national_length} chiffres pour ${country.country_name}` 
    };
  }

  return { isValid: true, message: '' };
}
