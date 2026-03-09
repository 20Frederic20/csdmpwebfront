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
    const { mutateAsync: createRoom, isPending: isCreating } = useCreateRoom();
    const { mutateAsync: updateRoom, isPending: isUpdating } = useUpdateRoom();
    const loading = isCreating || isUpdating;

    const [formData, setFormData] = useState<CreateRoomRequest>({
        name: "",
        capacity: 1,
        type_: RoomType.STANDARD,
        health_facility_id: "",
        department_id: null,
    });

    useEffect(() => {
        if (room) {
            const timer = setTimeout(() => {
                setFormData({
                    name: room.name,
                    capacity: room.capacity,
                    type_: room.type_,
                    health_facility_id: room.health_facility_id,
                    department_id: room.department_id,
                });
            }, 0);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setFormData({
                    name: "",
                    capacity: 1,
                    type_: RoomType.STANDARD,
                    health_facility_id: "",
                    department_id: null,
                });
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [room, isOpen]);

    const roomTypeOptions = [
        { value: RoomType.STANDARD, label: "Standard" },
        { value: RoomType.VIP, label: "VIP" },
        { value: RoomType.ICU, label: "Unité de soins intensifs (ICU)" },
        { value: RoomType.PEDIATRICS, label: "Pédiatrie" },
    ];

    const handleInputChange = (field: keyof CreateRoomRequest, value: string | string[] | number | RoomType | null) => {
        const normalizedValue = Array.isArray(value) ? value[0] : value;
        setFormData((prev) => ({
            ...prev,
            [field]: normalizedValue,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) return;
        if (formData.capacity <= 0) return;
        if (!isEdit && !formData.health_facility_id) return;

        try {
            if (isEdit && room) {
                await updateRoom({ id: room.id_, data: formData as UpdateRoomRequest });
            } else {
                await createRoom(formData);
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom / Numéro de la chambre *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Ex: Chambre 101"
                                required
                                disabled={loading}
                            />
                        </div>

                        <HealthFacilitySelect
                            value={formData.health_facility_id}
                            onChange={(val) => {
                                handleInputChange("health_facility_id", val || "");
                                handleInputChange("department_id", null); // Reset department when facility changes
                            }}
                            required={!isEdit}
                            disabled={loading}
                            className="space-y-1"
                        />

                        <DepartmentSelect
                            value={formData.department_id || undefined}
                            onChange={(val) => handleInputChange("department_id", val)}
                            healthFacilityId={formData.health_facility_id}
                            disabled={loading || !formData.health_facility_id}
                            required={false}
                            placeholder="Sélectionner un département (optionnel)"
                            className="space-y-1"
                        />

                        <div className="space-y-2">
                            <Label htmlFor="type">Type de chambre *</Label>
                            <CustomSelect
                                options={roomTypeOptions}
                                value={formData.type_}
                                onChange={(val) => handleInputChange("type_", val)}
                                placeholder="Sélectionner le type"
                                isDisabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacité (Lits) *</Label>
                            <Input
                                id="capacity"
                                type="number"
                                min={1}
                                value={formData.capacity}
                                onChange={(e) => handleInputChange("capacity", parseInt(e.target.value))}
                                required
                                disabled={loading}
                            />
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
