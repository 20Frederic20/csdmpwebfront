"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";
import CustomSelect from "@/components/ui/custom-select";
import { PatientSelect } from "@/features/patients/components/patient-select";
import { occupancyFilterSchema, OccupancyFilterValues } from "../schemas/rooms.schema";

interface OccupancyFiltersProps {
    filters: Record<string, any>;
    onFiltersChange: (filters: Record<string, any>) => void;
    onReset: () => void;
}

export function OccupancyFilters({
    filters,
    onFiltersChange,
    onReset,
}: OccupancyFiltersProps) {
    const { control, reset, watch } = useForm<OccupancyFilterValues>({
        resolver: zodResolver(occupancyFilterSchema),
        defaultValues: {
            patient_id: filters.patient_id || "",
            is_discharged: filters.is_discharged !== undefined ? filters.is_discharged : undefined,
            discharge_date: filters.discharge_date || "",
        },
    });

    // Observer les changements pour filtrer en temps réel avec un léger délai (debouncing)
    const watchedFields = watch();
    const watchedFieldsString = JSON.stringify(watchedFields);

    useEffect(() => {
        const timer = setTimeout(() => {
            onFiltersChange(watchedFields);
        }, 300);
        return () => clearTimeout(timer);
    }, [watchedFieldsString, onFiltersChange]);

    const handleReset = () => {
        reset({
            patient_id: "",
            is_discharged: undefined,
            discharge_date: "",
        });
        onReset();
    };

    return (
        <div className="bg-muted/30 p-4 rounded-lg flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px] space-y-2">
                <Label>Patient</Label>
                <Controller
                    name="patient_id"
                    control={control}
                    render={({ field }) => (
                        <PatientSelect
                            value={field.value}
                            onChange={field.onChange}
                            height="h-9"
                        />
                    )}
                />
            </div>

            <div className="flex-1 min-w-[150px] space-y-2">
                <Label>Statut de sortie</Label>
                <Controller
                    name="is_discharged"
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            options={[
                                { value: "true", label: "Sorti" },
                                { value: "false", label: "Hospitalisé" },
                            ]}
                            value={field.value === true ? "true" : field.value === false ? "false" : ""}
                            onChange={(val) => field.onChange(val === "true" ? true : val === "false" ? false : undefined)}
                            placeholder="Tous les statuts"
                            height="h-9"
                        />
                    )}
                />
            </div>

            <div className="flex-1 min-w-[150px] space-y-2">
                <Label>Date de sortie</Label>
                <Controller
                    name="discharge_date"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="date"
                            className="h-9"
                            {...field}
                        />
                    )}
                />
            </div>

            <div className="flex items-center gap-2 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="h-9"
                    title="Réinitialiser"
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
