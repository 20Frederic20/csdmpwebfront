import { TestType } from './lab-results.types';

export interface ExamDefinition {
  id_: string;
  test_type: TestType;
  name: string;
  parameter_codes: string[];
  health_facility_id: string | null;
  description: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExamDefinitionQM {
  data: ExamDefinition[];
  total: number;
}

export interface ListExamDefinitionsQueryParams {
  test_type?: TestType;
  health_facility_id?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}

export interface CreateExamDefinitionRequest {
  test_type: TestType;
  name: string;
  parameter_codes: string[];
  health_facility_id?: string | null;
  description?: string | null;
  is_active?: boolean;
}

export interface UpdateExamDefinitionRequest {
  name?: string;
  parameter_codes?: string[];
  health_facility_id?: string | null;
  description?: string | null;
  is_active?: boolean;
}
