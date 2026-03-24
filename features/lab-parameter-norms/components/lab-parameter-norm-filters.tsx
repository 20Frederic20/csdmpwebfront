"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Filter } from "lucide-react";

interface LabParameterNormFiltersProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export function LabParameterNormFilters({
  filters,
  onFiltersChange,
  onReset,
}: LabParameterNormFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, parameter_codes: e.target.value });
  };

  return (
    <Card className="border-slate-100 shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-700">
          <Filter className="h-4 w-4 text-primary" />
          Filtres de recherche
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher par code (HGB, WBC...)"
              value={filters.parameter_codes || ""}
              onChange={handleSearchChange}
              className="pl-10 h-10 border-slate-200 focus:ring-primary/20 focus:border-primary"
            />
            {filters.parameter_codes && (
              <button
                onClick={() => onFiltersChange({ ...filters, parameter_codes: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={onReset}
            className="h-10 text-slate-600 border-slate-200 hover:bg-slate-50 w-full md:w-auto hover:text-primary hover:border-primary/50"
          >
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
