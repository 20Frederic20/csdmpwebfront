export interface PatientLifestyle {
  id_: string;
  patient_id: string;
  smoking_status: 'never' | 'former' | 'current';
  alcohol_consumption: 'none' | 'occasional' | 'regular' | 'heavy';
  physical_activity: 'sedentary' | 'light' | 'moderate' | 'intense';
  diet_type: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'gluten_free' | 'other';
  sleep_hours: number;
  stress_level: 'low' | 'moderate' | 'high';
  notes?: string;
  source: 'manual' | 'ocr' | 'prev_cons';
  created_at?: string;
  updated_at?: string;
}

export interface CreateLifestyleRequest {
  smoking_status: 'never' | 'former' | 'current';
  alcohol_consumption: 'none' | 'occasional' | 'regular' | 'heavy';
  physical_activity: 'sedentary' | 'light' | 'moderate' | 'intense';
  diet_type: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'gluten_free' | 'other';
  sleep_hours: number;
  stress_level: 'low' | 'moderate' | 'high';
  notes?: string;
  source?: 'manual' | 'ocr' | 'prev_cons';
}

export interface UpdateLifestyleRequest {
  patient_id?: string;
  smoking_status?: 'never' | 'former' | 'current';
  alcohol_consumption?: 'none' | 'occasional' | 'regular' | 'heavy';
  physical_activity?: 'sedentary' | 'light' | 'moderate' | 'intense';
  diet_type?: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'gluten_free' | 'other';
  sleep_hours?: number;
  stress_level?: 'low' | 'moderate' | 'high';
  notes?: string;
  source?: 'manual' | 'ocr' | 'prev_cons';
}

export interface PatientLifestyleResponse {
  data: PatientLifestyle[];
  total: number;
}

export interface LifestyleQueryParams {
  patient_id: string;
  limit?: number;
  offset?: number;
}
