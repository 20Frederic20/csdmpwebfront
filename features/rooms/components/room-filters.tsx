"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CustomSelect from "@/components/ui/custom-select";
import { RoomType } from "../types/rooms.types";

interface RoomFiltersProps {
    filters: Record<string, any>;
    onFiltersChange: (filters: Record<string, any>) => void;
    onReset: () => void;
}

export function RoomFilters({ filters, onFiltersChange, onReset }: RoomFiltersProps) {
    const roomTypeOptions = [
        { value: RoomType.STANDARD, label: "Standard" },
        { value: RoomType.VIP, label: "VIP" },
        { value: RoomType.ICU, label: "ICU" },
        { value: RoomType.PEDIATRICS, label: "Pédiatrie" },
    ];

    const handleSearchChange = (value: string) => {
        onFiltersChange({ ...filters, search: value });
    };

    const handleTypeChange = (value: any) => {
        onFiltersChange({ ...filters, type_: value });
    };

    return (
        <Card className="bg-muted/40">
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par nom..."
                            value={filters.search || ""}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="w-full md:w-64">
                        <CustomSelect
                            options={roomTypeOptions}
                            value={filters.type_ || null}
                            onChange={handleTypeChange}
                            placeholder="Tous les types"
                            isClearable
                        />
                    </div>

                    <Button variant="outline" onClick={onReset} className="shrink-0">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Réinitialiser
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
