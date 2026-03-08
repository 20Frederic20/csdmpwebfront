"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/custom-select";
import { getConsultationStatusOptions } from "@/features/consultations/utils/consultation.utils";
import { Filter } from "lucide-react";

interface ConsultationFiltersWrapperProps {
    filters: Record<string, any>;
    onFiltersChange: (filters: Record<string, any>) => void;
    onReset: () => void;
}

export function ConsultationFiltersWrapper({
    filters,
    onFiltersChange,
    onReset,
}: ConsultationFiltersWrapperProps) {
    const handleChange = (key: string, value: any) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    return (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recherche */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Recherche</label>
                <input
                    type="text"
                    placeholder="Rechercher une consultation..."
                    value={filters.search || ""}
                    onChange={(e) => handleChange("search", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
            </div>

            {/* Filtre statut */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <CustomSelect
                    value={filters.status || ""}
                    onChange={(value) => handleChange("status", value || "")}
                    options={[
                        { value: "", label: "Tous les statuts" },
                        ...getConsultationStatusOptions(),
                    ]}
                    placeholder="Sélectionner un statut"
                    className="w-full"
                    height="h-9"
                />
            </div>

            {/* Reset */}
            <div className="space-y-2 flex items-end">
                <Button onClick={onReset} variant="outline" className="w-full h-9">
                    Effacer les filtres
                </Button>
            </div>
        </div>
    );
}
