export interface Country {
  country_code: string;
  country_name: string;
  phone_prefix: string;
  national_length: number;
  notes: string;
  index: number;
}

export interface Department {
  code: string;
  name: string;
  country_code: string;
  index: number;
}

export interface City {
  code: string;
  name: string;
  state_code: string;
  country_code: string;
  index: number;
}

export interface LocationData {
  countries: Country[];
  departments: Department[];
  cities: City[];
}
