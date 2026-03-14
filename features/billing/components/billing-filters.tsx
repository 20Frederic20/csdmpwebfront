"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface BillingFiltersProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export function BillingFilters({
  filters,
  onFiltersChange,
  onReset,
}: BillingFiltersProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card p-4 rounded-lg border shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => handleFilterChange("status", value === "all" ? undefined : value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="DRAFT">Brouillon</SelectItem>
              <SelectItem value="PAID">Payée</SelectItem>
              <SelectItem value="CANCELLED">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="patient_id">ID Patient</Label>
          <Input
            id="patient_id"
            placeholder="Filtrer par patient..."
            value={filters.patient_id || ""}
            onChange={(e) => handleFilterChange("patient_id", e.target.value)}
          />
        </div>

        <div className="flex items-end gap-2">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="w-full"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
        </div>
      </div>
    </div>
  );
}
