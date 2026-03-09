import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RoomService } from "../services/rooms.service";
import {
    RoomQueryParams,
    CreateRoomRequest,
    UpdateRoomRequest,
    RoomOccupancyQueryParams,
    AdmitPatientRequest,
    TransferPatientRequest,
    DischargePatientRequest
} from "../types/rooms.types";
import { toast } from "sonner";

export const useRooms = (params: RoomQueryParams = {}) => {
    return useQuery({
        queryKey: ['rooms', params],
        queryFn: () => RoomService.getRooms(params),
        staleTime: 5 * 60 * 1000,
    });
};

export const useRoomById = (id: string) => {
    return useQuery({
        queryKey: ['rooms', id],
        queryFn: () => RoomService.getRoomById(id),
        enabled: !!id,
    });
};

export const useCreateRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateRoomRequest) => RoomService.createRoom(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            toast.success("Chambre créée avec succès");
        },
        onError: (error: Error) => {
            toast.error(`Erreur lors de la création de la chambre: ${error.message}`);
        },
    });
};

export const useUpdateRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateRoomRequest }) =>
            RoomService.updateRoom(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            queryClient.invalidateQueries({ queryKey: ['rooms', id] });
            toast.success("Chambre mise à jour avec succès");
        },
        onError: (error: Error) => {
            toast.error(`Erreur lors de la mise à jour de la chambre: ${error.message}`);
        },
    });
};

export const useDeleteRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => RoomService.deleteRoom(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            toast.success("Chambre supprimée avec succès");
        },
        onError: (error: Error) => {
            toast.error(`Erreur lors de la suppression de la chambre: ${error.message}`);
        },
    });
};

export const useToggleRoomStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => RoomService.toggleRoomStatus(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            queryClient.invalidateQueries({ queryKey: ['rooms', id] });
            toast.success("Statut de la chambre mis à jour");
        },
        onError: (error: Error) => {
            toast.error(`Erreur lors de la mise à jour du statut: ${error.message}`);
        },
    });
};

// Occupancy Hooks
export const useOccupancies = (params: RoomOccupancyQueryParams = {}) => {
    return useQuery({
        queryKey: ['room-occupancies', params],
        queryFn: () => RoomService.getOccupancies(params),
        staleTime: 5 * 60 * 1000,
    });
};

export const useAdmitPatient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AdmitPatientRequest) => RoomService.admitPatient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['room-occupancies'] });
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            toast.success("Patient admis avec succès");
        },
        onError: (error: Error) => {
            toast.error(`Erreur lors de l'admission: ${error.message}`);
        },
    });
};

export const useTransferPatient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TransferPatientRequest) => RoomService.transferPatient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['room-occupancies'] });
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            toast.success("Patient transféré avec succès");
        },
        onError: (error: Error) => {
            toast.error(`Erreur lors du transfert: ${error.message}`);
        },
    });
};

export const useDischargePatient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: DischargePatientRequest) => RoomService.dischargePatient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['room-occupancies'] });
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            toast.success("Sortie du patient enregistrée avec succès");
        },
        onError: (error: Error) => {
            toast.error(`Erreur lors de la sortie: ${error.message}`);
        },
    });
};
