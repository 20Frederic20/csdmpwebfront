"use client";

import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface OccupancyFiltersProps {
    filters: Record<string, string | boolean | number | undefined>;
    onFiltersChange: (filters: Record<string, string | boolean | number | undefined>) => void;
    onReset: () => void;
}

export function OccupancyFilters({
    filters,
    onFiltersChange,
    onReset,
}: OccupancyFiltersProps) {
    return (
        <div className="flex flex-wrap items-end gap-4 bg-muted/30 p-4 rounded-lg">
            <div className="flex-1 min-w-[200px] space-y-2">
                <Label htmlFor="status">Statut</Label>
                <CustomSelect
                    options={[
                        { value: "true", label: "En cours" },
                        { value: "false", label: "Historique" },
                    ]}
                    value={filters.is_active?.toString() || ""}
                    onChange={(val) =>
                        onFiltersChange({ ...filters, is_active: val === "true" ? true : val === "false" ? false : undefined })
                    }
                    placeholder="Tous les statuts"
                />
            </div>

            <Button
                variant="outline"
                onClick={onReset}
                className="h-10"
            >
                <RotateCcw className="mr-2 h-4 w-4" />
                Réinitialiser
            </Button>
        </div>
    );
}
