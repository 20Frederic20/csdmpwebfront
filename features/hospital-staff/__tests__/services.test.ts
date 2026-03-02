import { HospitalStaffService } from '../services/hospital-staff.service';
import { CreateHospitalStaffRequest, UpdateHospitalStaffRequest, HospitalStaffQueryParams, MedicalSpecialty, EmploymentStatus } from '../types/hospital-staff.types';

// Mock fetch global
global.fetch = jest.fn();

describe('HospitalStaffService', () => {
  const mockToken = 'test-token';
  const mockStaffResponse = {
    data: [
      {
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
      }
    ],
    total: 1,
    page: 1,
    limit: 10
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => mockToken),
        setItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true
    });
  });

  describe('getHospitalStaff', () => {
    it('should fetch hospital staff with query parameters', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockStaffResponse)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const params: HospitalStaffQueryParams = {
        health_facility_id: '123e4567-e89b-12d3-a456-426614174002',
        search: 'John',
        specialty: MedicalSpecialty.GENERAL_PRACTITIONER,
        department_id: '123e4567-e89b-12d3-a456-426614174003',
        order_number: 'ORDER001',
        employment_status: EmploymentStatus.STATE_PERMANENT,
        limit: 10,
        offset: 0
      };

      const result = await HospitalStaffService.getHospitalStaff(params, mockToken);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('health_facility_id=123e4567-e89b-12d3-a456-426614174002'),
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`
          }
        })
      );
      expect(result).toEqual(mockStaffResponse);
    });

    it('should handle empty query parameters', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockStaffResponse)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await HospitalStaffService.getHospitalStaff();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('hospital-staff?'),
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result).toEqual(mockStaffResponse);
    });
  });

  describe('getHospitalStaffById', () => {
    it('should fetch single hospital staff by id', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockStaffResponse.data[0])
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await HospitalStaffService.getHospitalStaffById('123e4567-e89b-12d3-a456-426614174000', mockToken);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/hospital-staff/123e4567-e89b-12d3-a456-426614174000',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`
          }
        })
      );
      expect(result).toEqual(mockStaffResponse.data[0]);
    });
  });

  describe('createHospitalStaff', () => {
    it('should create new hospital staff', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockStaffResponse.data[0])
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const createRequest: CreateHospitalStaffRequest = {
        health_facility_id: '123e4567-e89b-12d3-a456-426614174002',
        matricule: 'EMP002',
        year_of_exp: 3,
        specialty: MedicalSpecialty.CARDIOLOGIST,
        department_id: '123e4567-e89b-12d3-a456-426614174003',
        is_active: true
      };

      const result = await HospitalStaffService.createHospitalStaff(createRequest, mockToken);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/hospital-staff',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`
          },
          body: JSON.stringify(createRequest)
        })
      );
      expect(result).toEqual(mockStaffResponse.data[0]);
    });
  });

  describe('updateHospitalStaff', () => {
    it('should update existing hospital staff', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockStaffResponse.data[0])
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const updateRequest: UpdateHospitalStaffRequest = {
        matricule: 'EMP001_UPDATED',
        year_of_exp: 6,
        specialty: MedicalSpecialty.SURGEON,
        department_id: '123e4567-e89b-12d3-a456-426614174004'
      };

      const result = await HospitalStaffService.updateHospitalStaff('123e4567-e89b-12d3-a456-426614174000', updateRequest, mockToken);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/hospital-staff/123e4567-e89b-12d3-a456-426614174000',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`
          },
          body: JSON.stringify(updateRequest)
        })
      );
      expect(result).toEqual(mockStaffResponse.data[0]);
    });
  });

  describe('deleteHospitalStaff', () => {
    it('should delete hospital staff', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await HospitalStaffService.deleteHospitalStaff('123e4567-e89b-12d3-a456-426614174000', mockToken);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/hospital-staff/123e4567-e89b-12d3-a456-426614174000/soft-delete',
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`
          }
        })
      );
      expect(result).toBeUndefined();
    });

  describe('Error handling', () => {
    it('should handle fetch errors', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Internal Server Error'
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(HospitalStaffService.getHospitalStaff()).rejects.toThrow(
        'Failed to fetch hospital staff: Internal Server Error'
      );
    });
  });
  });
});
