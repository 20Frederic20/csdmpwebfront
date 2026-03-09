"use client";

import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { useRooms } from "../hooks/use-rooms";

interface RoomSelectProps {
    value?: string;
    onChange: (value: string | null) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    healthFacilityId?: string;
    departmentId?: string;
    onlyActive?: boolean;
}

export function RoomSelect({
    value,
    onChange,
    placeholder = "Sélectionner une chambre",
    disabled = false,
    required = false,
    className = "",
    healthFacilityId,
    departmentId,
    onlyActive = true,
}: RoomSelectProps) {
    const { data: roomsData, isLoading } = useRooms({
        health_facility_id: healthFacilityId,
        department_id: departmentId,
        is_active: onlyActive ? true : undefined,
        limit: 100,
    });

    const rooms = roomsData?.data || [];

    const options = rooms.map((room) => ({
        value: room.id_,
        label: `${room.name} (${room.type_} - ${room.capacity} lits)`,
    }));

    const handleChange = (selectedValue: string | string[] | null) => {
        const roomId = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
        onChange(roomId);
    };

    return (
        <div className={className}>
            {required && (
                <Label htmlFor="room-select" className="text-sm font-medium">
                    Chambre <span className="text-red-500">*</span>
                </Label>
            )}
            <CustomSelect
                options={options}
                value={value || ""}
                onChange={handleChange}
                placeholder={placeholder}
                isDisabled={disabled || isLoading}
                isLoading={isLoading}
            />
        </div>
    );
}
