import { FetchService } from '@/features/core/services/fetch.service';
import {
    Room,
    CreateRoomRequest,
    UpdateRoomRequest,
    RoomResponse,
    RoomQueryParams,
    AdmitPatientRequest,
    TransferPatientRequest,
    DischargePatientRequest,
    RoomOccupancy,
    RoomOccupancyResponse,
    RoomOccupancyQueryParams
} from '../types/rooms.types';

export class RoomService {
    private static readonly ENDPOINT = 'rooms';
    private static readonly OCCUPANCY_ENDPOINT = 'rooms/occupancies';

    static async getRooms(params: RoomQueryParams = {}): Promise<RoomResponse> {
        const queryParams = new URLSearchParams();

        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.offset) queryParams.append('offset', params.offset.toString());
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_order) queryParams.append('sort_order', params.sort_order);
        if (params.search) queryParams.append('search', params.search);
        if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
        if (params.health_facility_id) queryParams.append('health_facility_id', params.health_facility_id);
        if (params.department_id) queryParams.append('department_id', params.department_id);

        const queryString = queryParams.toString();
        const endpoint = queryString ? `${this.ENDPOINT}?${queryString}` : this.ENDPOINT;

        return FetchService.get<RoomResponse>(endpoint, 'Rooms');
    }

    static async getRoomById(id: string): Promise<Room> {
        return FetchService.get<Room>(`${this.ENDPOINT}/${id}`, 'Room');
    }

    static async createRoom(data: CreateRoomRequest): Promise<Room> {
        return FetchService.post<Room>(this.ENDPOINT, data, 'Room');
    }

    static async updateRoom(id: string, data: UpdateRoomRequest): Promise<Room> {
        return FetchService.put<Room>(`${this.ENDPOINT}/${id}`, data, 'Room');
    }

    static async deleteRoom(id: string): Promise<void> {
        return FetchService.delete<void>(`${this.ENDPOINT}/${id}`, 'Room');
    }

    static async toggleRoomStatus(id: string): Promise<Room> {
        return FetchService.patch<Room>(`${this.ENDPOINT}/${id}/toggle-status`, {}, 'Room');
    }

    // Occupancy methods
    static async admitPatient(data: AdmitPatientRequest): Promise<RoomOccupancy> {
        return FetchService.post<RoomOccupancy>(`${this.ENDPOINT}/admit`, data, 'chambre', {
            customMessages: {
                409: "Il n'y a plus de place libre dans cette chambre"
            }
        });
    }

    static async transferPatient(data: TransferPatientRequest): Promise<RoomOccupancy> {
        return FetchService.post<RoomOccupancy>(`${this.ENDPOINT}/transfer`, data, 'chambre');
    }

    static async dischargePatient(data: DischargePatientRequest): Promise<RoomOccupancy> {
        return FetchService.post<RoomOccupancy>(`${this.ENDPOINT}/discharge`, data, 'chambre');
    }

    static async getOccupancies(params: RoomOccupancyQueryParams = {}): Promise<RoomOccupancyResponse> {
        const queryParams = new URLSearchParams();

        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.offset) queryParams.append('offset', params.offset.toString());
        if (params.patient_id) queryParams.append('patient_id', params.patient_id);
        if (params.room_id) queryParams.append('room_id', params.room_id);

        const queryString = queryParams.toString();
        const endpoint = queryString ? `${this.OCCUPANCY_ENDPOINT}?${queryString}` : this.OCCUPANCY_ENDPOINT;

        return FetchService.get<RoomOccupancyResponse>(endpoint, 'RoomOccupancies');
    }
}
