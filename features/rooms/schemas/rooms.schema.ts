import { z } from "zod";
import { RoomType } from "../types/rooms.types";

export const roomSchema = z.object({
    name: z.string().min(1, "Le nom de la chambre est obligatoire"),
    capacity: z.number().min(1, "La capacité doit être d'au moins 1 lit"),
    type_: z.nativeEnum(RoomType, {
        message: "Le type de chambre est invalide",
    }),



    health_facility_id: z.string().min(1, "L'établissement de santé est obligatoire"),
    department_id: z.string().nullable().optional(),
});

export type RoomFormValues = z.infer<typeof roomSchema>;

export const occupancyFilterSchema = z.object({
    patient_id: z.string().optional(),
    is_discharged: z.boolean().optional(),
    discharge_date: z.string().optional(),
});

export type OccupancyFilterValues = z.infer<typeof occupancyFilterSchema>;
