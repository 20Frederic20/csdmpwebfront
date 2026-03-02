import { 
  CreateHospitalStaffRequest, 
  UpdateHospitalStaffRequest, 
  HospitalStaff, 
  HospitalStaffQueryParams,
  MedicalSpecialty,
  EmploymentStatus,
  UUID 
} from '../types/hospital-staff.types';

describe('HospitalStaff Types', () => {
  describe('CreateHospitalStaffRequest', () => {
    it('should create valid request with required fields', () => {
      const request: CreateHospitalStaffRequest = {
        health_facility_id: '123e4567-e89b-12d3-a456-426614174000',
        matricule: 'EMP001',
        year_of_exp: 5,
        specialty: MedicalSpecialty.GENERAL_PRACTITIONER,
        department_id: '123e4567-e89b-12d3-a456-426614174000',
        is_active: true
      };

      expect(request.health_facility_id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(request.matricule).toBe('EMP001');
      expect(request.year_of_exp).toBe(5);
      expect(request.specialty).toBe(MedicalSpecialty.GENERAL_PRACTITIONER);
      expect(request.department_id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(request.is_active).toBe(true);
    });

    it('should create valid request with optional fields', () => {
      const request: CreateHospitalStaffRequest = {
        health_facility_id: '123e4567-e89b-12d3-a456-426614174000',
        matricule: 'EMP002',
        year_of_exp: 10,
        specialty: MedicalSpecialty.CARDIOLOGIST,
        department_id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        user_data: {
          given_name: 'John',
          family_name: 'Doe',
          email: 'john.doe@example.com',
          health_id: 'HEALTH123',
          password: 'password123',
          roles: ['USER']
        },
        order_number: 'ORDER001',
        employment_status: EmploymentStatus.STATE_PERMANENT,
        is_active: true
      };

      expect(request.user_id).toBe('123e4567-e89b-12d3-a456-426614174002');
      expect(request.user_data).toBeDefined();
      expect(request.user_data?.given_name).toBe('John');
      expect(request.order_number).toBe('ORDER001');
      expect(request.employment_status).toBe(EmploymentStatus.STATE_PERMANENT);
    });
  });

  describe('UpdateHospitalStaffRequest', () => {
    it('should create valid update request', () => {
      const request: UpdateHospitalStaffRequest = {
        health_facility_id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        matricule: 'EMP001',
        year_of_exp: 6,
        specialty: MedicalSpecialty.SURGEON,
        department_id: '123e4567-e89b-12d3-a456-426614174002',
        order_number: 'ORDER002',
        employment_status: EmploymentStatus.HOSPITAL_CONTRACTUAL
      };

      expect(request.health_facility_id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(request.specialty).toBe(MedicalSpecialty.SURGEON);
      expect(request.department_id).toBe('123e4567-e89b-12d3-a456-426614174002');
      expect(request.order_number).toBe('ORDER002');
      expect(request.employment_status).toBe(EmploymentStatus.HOSPITAL_CONTRACTUAL);
    });

    it('should create valid partial update request', () => {
      const request: UpdateHospitalStaffRequest = {
        matricule: 'EMP003'
      };

      expect(request.matricule).toBe('EMP003');
      expect(request.health_facility_id).toBeUndefined();
      expect(request.specialty).toBeUndefined();
    });
  });

  describe('HospitalStaff', () => {
    it('should create valid hospital staff object', () => {
      const staff: HospitalStaff = {
        id_: '123e4567-e89b-12d3-a456-426614174000',
        user_given_name: 'John',
        user_family_name: 'Doe',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        health_facility_id: '123e4567-e89b-12d3-a456-426614174002',
        health_facility_name: 'Central Hospital',
        matricule: 'EMP001',
        year_of_exp: 5,
        specialty: MedicalSpecialty.GENERAL_PRACTITIONER,
        department_id: '123e4567-e89b-12d3-a456-426614174003',
        department_name: 'General Medicine',
        order_number: 'ORDER001',
        employment_status: EmploymentStatus.STATE_PERMANENT,
        is_active: true,
        version: 1,
        deleted_at: null
      };

      expect(staff.id_).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(staff.user_given_name).toBe('John');
      expect(staff.department_id).toBe('123e4567-e89b-12d3-a456-426614174003');
      expect(staff.department_name).toBe('General Medicine');
      expect(staff.order_number).toBe('ORDER001');
      expect(staff.employment_status).toBe(EmploymentStatus.STATE_PERMANENT);
      expect(staff.deleted_at).toBeNull();
    });
  });

  describe('HospitalStaffQueryParams', () => {
    it('should create valid query parameters', () => {
      const params: HospitalStaffQueryParams = {
        health_facility_id: '123e4567-e89b-12d3-a456-426614174000',
        search: 'John',
        specialty: MedicalSpecialty.CARDIOLOGIST,
        department_id: '123e4567-e89b-12d3-a456-426614174001',
        order_number: 'ORDER001',
        employment_status: EmploymentStatus.STATE_PERMANENT,
        limit: 10,
        offset: 0,
        sort_by: 'user_given_name',
        sort_order: 'asc'
      };

      expect(params.health_facility_id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(params.search).toBe('John');
      expect(params.specialty).toBe(MedicalSpecialty.CARDIOLOGIST);
      expect(params.department_id).toBe('123e4567-e89b-12d3-a456-426614174001');
      expect(params.order_number).toBe('ORDER001');
      expect(params.employment_status).toBe(EmploymentStatus.STATE_PERMANENT);
      expect(params.limit).toBe(10);
      expect(params.offset).toBe(0);
      expect(params.sort_by).toBe('user_given_name');
      expect(params.sort_order).toBe('asc');
    });

    it('should create valid empty query parameters', () => {
      const params: HospitalStaffQueryParams = {};

      expect(params.health_facility_id).toBeUndefined();
      expect(params.search).toBeUndefined();
      expect(params.specialty).toBeUndefined();
      expect(params.department_id).toBeUndefined();
      expect(params.order_number).toBeUndefined();
      expect(params.employment_status).toBeUndefined();
    });
  });

  describe('UUID Type', () => {
    it('should accept UUID strings', () => {
      const uuid: UUID = '123e4567-e89b-12d3-a456-426614174000';
      expect(typeof uuid).toBe('string');
    });
  });

  describe('EmploymentStatus enum', () => {
    it('should have all required employment statuses', () => {
      expect(EmploymentStatus.STATE_PERMANENT).toBe('STATE_PERMANENT');
      expect(EmploymentStatus.STATE_CONTRACTUAL).toBe('STATE_CONTRACTUAL');
      expect(EmploymentStatus.HOSPITAL_CONTRACTUAL).toBe('HOSPITAL_CONTRACTUAL');
      expect(EmploymentStatus.INTERN).toBe('INTERN');
      expect(EmploymentStatus.VACUM_GUEST).toBe('VACUM_GUEST');
    });
  });

  describe('MedicalSpecialty enum', () => {
    it('should have all required medical specialties', () => {
      expect(MedicalSpecialty.GENERAL_PRACTITIONER).toBe('GENERAL_PRACTITIONER');
      expect(MedicalSpecialty.CARDIOLOGIST).toBe('CARDIOLOGIST');
      expect(MedicalSpecialty.PEDIATRICIAN).toBe('PEDIATRICIAN');
      expect(MedicalSpecialty.SURGEON).toBe('SURGEON');
      expect(MedicalSpecialty.NURSE).toBe('NURSE');
      expect(MedicalSpecialty.PHARMACIST).toBe('PHARMACIST');
    });
  });
});
