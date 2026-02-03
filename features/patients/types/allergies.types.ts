export interface PatientAllergy {
  id: string;
  patient_id: string;
  allergen: string;
  allergen_type: 'food' | 'medication' | 'environmental' | 'other';
  severity: 'mild' | 'moderate' | 'severe' | 'absolutely_contraindicated';
  reaction: string;
  notes?: string;
  source: 'manual' | 'ocr' | 'prev_cons';
  created_at?: string;
  updated_at?: string;
}

export interface CreateAllergyRequest {
  allergen: string;
  allergen_type: 'food' | 'medication' | 'environmental' | 'other';
  severity: 'mild' | 'moderate' | 'severe' | 'absolutely_contraindicated';
  reaction: string;
  notes?: string;
  onset_date?: string;
  source?: 'manual' | 'ocr' | 'prev_cons';
}

export interface UpdateAllergyRequest {
  patient_id?: string;
  allergen?: string;
  allergen_type?: 'food' | 'medication' | 'environmental' | 'other';
  severity?: 'mild' | 'moderate' | 'severe' | 'absolutely_contraindicated';
  reaction?: string;
  notes?: string;
  onset_date?: string;
  source?: 'manual' | 'ocr' | 'prev_cons';
}

export interface PatientAllergiesResponse {
  allergies: PatientAllergy[];
  total: number;
}

export interface AllergiesQueryParams {
  patient_id: string;
  limit?: number;
  offset?: number;
  sorting_field?: string;
  sorting_order?: 'ASC' | 'DESC';
  search?: string;
}
