"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import CustomSelect from "@/components/ui/custom-select";
import {
    Room,
    RoomType,
    CreateRoomRequest,
    UpdateRoomRequest
} from "../types/rooms.types";
import { useCreateRoom, useUpdateRoom } from "../hooks/use-rooms";
import { HealthFacilitySelect } from "@/features/health-facilities/components/health-facility-select";
import { DepartmentSelect } from "@/features/departments/components/department-select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema, RoomFormValues } from "../schemas/rooms.schema";
import { usePermissionsContext } from "@/contexts/permissions-context";

interface RoomFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    room?: Room; // If provided, we are in edit mode
}

export function RoomFormModal({
    isOpen,
    onClose,
    room,
}: RoomFormModalProps) {
    const isEdit = !!room;
    const { user } = usePermissionsContext();
    const { mutateAsync: createRoom, isPending: isCreating } = useCreateRoom();
    const { mutateAsync: updateRoom, isPending: isUpdating } = useUpdateRoom();
    const loading = isCreating || isUpdating;

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm<RoomFormValues>({
        resolver: zodResolver(roomSchema),
        defaultValues: {
            name: "",
            capacity: 1,
            type_: RoomType.STANDARD,
            health_facility_id: user?.health_facility_id || "",
            department_id: null,
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (room) {
                reset({
                    name: room.name,
                    capacity: room.capacity,
                    type_: room.type_,
                    health_facility_id: room.health_facility_id,
                    department_id: room.department_id,
                });
            } else {
                reset({
                    name: "",
                    capacity: 1,
                    type_: RoomType.STANDARD,
                    health_facility_id: user?.health_facility_id || "",
                    department_id: null,
                });
            }
        }
    }, [room, isOpen, reset, user?.health_facility_id]);

    const healthFacilityId = watch("health_facility_id");

    const roomTypeOptions = [
        { value: RoomType.STANDARD, label: "Standard" },
        { value: RoomType.VIP, label: "VIP" },
        { value: RoomType.ICU, label: "Unité de soins intensifs (ICU)" },
        { value: RoomType.PEDIATRICS, label: "Pédiatrie" },
    ];

    const onSubmit = async (data: RoomFormValues) => {
        try {
            if (isEdit && room) {
                await updateRoom({ id: room.id_, data: data as UpdateRoomRequest });
            } else {
                await createRoom(data as CreateRoomRequest);
            }
            onClose();
        } catch (error) {
            console.error("Error saving room:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Modifier la chambre" : "Ajouter une chambre"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Modifiez les informations de la chambre ci-dessous."
                            : "Remplissez les informations pour créer une nouvelle chambre."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom / Numéro de la chambre *</Label>
                            <Input
                                id="name"
                                {...register("name")}
                                placeholder="Ex: Chambre 101"
                                disabled={loading}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <HealthFacilitySelect
                                value={healthFacilityId}
                                onChange={(val) => {
                                    setValue("health_facility_id", val || "", { shouldValidate: true });
                                    setValue("department_id", null); // Reset department when facility changes
                                }}
                                required={true}
                                disabled={loading || !!user?.health_facility_id}
                                className="space-y-1"
                            />
                            {errors.health_facility_id && (
                                <p className="text-sm text-red-500">{errors.health_facility_id.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Controller
                                control={control}
                                name="department_id"
                                render={({ field }) => (
                                    <DepartmentSelect
                                        value={field.value || undefined}
                                        onChange={(val) => field.onChange(val)}
                                        healthFacilityId={healthFacilityId}
                                        disabled={loading || !healthFacilityId}
                                        required={false}
                                        placeholder="Sélectionner un département (optionnel)"
                                        className="space-y-1"
                                    />
                                )}
                            />
                            {errors.department_id && (
                                <p className="text-sm text-red-500">{errors.department_id.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type de chambre *</Label>
                            <Controller
                                control={control}
                                name="type_"
                                render={({ field }) => (
                                    <CustomSelect
                                        options={roomTypeOptions}
                                        value={field.value}
                                        onChange={(val) => field.onChange(val)}
                                        placeholder="Sélectionner le type"
                                        isDisabled={loading}
                                    />
                                )}
                            />
                            {errors.type_ && (
                                <p className="text-sm text-red-500">{errors.type_.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacité (Lits) *</Label>
                            <Input
                                id="capacity"
                                type="number"
                                min={1}
                                {...register("capacity", { valueAsNumber: true })}
                                disabled={loading}
                            />
                            {errors.capacity && (
                                <p className="text-sm text-red-500">{errors.capacity.message}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            {isEdit ? "Enregistrer" : "Créer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
