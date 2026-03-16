export enum RoomType {
    STANDARD = "STANDARD",
    VIP = "VIP",
    ICU = "ICU",
    PEDIATRICS = "PEDIATRICS"
}

export interface Room {
    id_: string;
    name: string;
    capacity: number;
    type_: RoomType;
    health_facility_id: string;
    department_id: string | null;
    is_active: boolean;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface CreateRoomRequest {
    name: string;
    capacity: number;
    type_: RoomType;
    health_facility_id: string;
    department_id?: string | null;
}

export interface UpdateRoomRequest {
    name?: string;
    capacity?: number;
    type_?: RoomType;
    health_facility_id?: string;
    department_id?: string | null;
    is_active?: boolean;
}

export interface RoomResponse {
    data: Room[];
    total: number;
}

export interface RoomQueryParams {
    limit?: number;
    offset?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    search?: string;
    is_active?: boolean;
    health_facility_id?: string;
    department_id?: string;
}

export interface AdmitPatientRequest {
    patient_id: string;
    room_id: string;
}

export interface TransferPatientRequest {
    patient_id: string;
    new_room_id: string;
}

export interface DischargePatientRequest {
    patient_id: string;
    reason?: string | null;
}

export interface RoomOccupancy {
    id_: string;
    patient_id: string;
    room_id: string;
    admission_date: string;
    discharge_date: string | null;
    reason: string | null;
    is_active: boolean;
    created_at: string | null;
    updated_at: string | null;

    // Joined data for UI
    patient_full_name?: string;
    room_name?: string;
}

export interface RoomOccupancyResponse {
    data: RoomOccupancy[];
    total: number;
}

export interface RoomOccupancyQueryParams {
    limit?: number;
    offset?: number;
    patient_id?: string;
    room_id?: string;
    is_active?: boolean;
}
