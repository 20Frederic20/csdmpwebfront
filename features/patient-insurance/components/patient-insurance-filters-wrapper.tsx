"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const filterSchema = z.object({
  search: z.string().optional(),
  policy_number: z.string().optional(),
  priority: z.string().optional(),
  is_active: z.enum(["", "true", "false"]).optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

interface PatientInsuranceFiltersWrapperProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export function PatientInsuranceFiltersWrapper({
  filters,
  onFiltersChange,
  onReset,
}: PatientInsuranceFiltersWrapperProps) {
  const { register, control, reset } = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: filters.search || "",
      policy_number: filters.policy_number || "",
      priority: filters.priority || "",
      is_active: filters.is_active === null || filters.is_active === undefined ? "" : filters.is_active.toString(),
    },
    mode: "onChange",
  });

  const formValues = useWatch({ control });

  useEffect(() => {
    // We can debounce here if needed, but for now we keep the immediate update behavior
    const timeoutId = setTimeout(() => {
      onFiltersChange({
        search: formValues.search,
        policy_number: formValues.policy_number,
        priority: formValues.priority ? parseInt(formValues.priority, 10) : undefined,
        is_active: formValues.is_active === "true" ? true : formValues.is_active === "false" ? false : null,
      });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [formValues, onFiltersChange]);

  const handleReset = () => {
    onReset();
    reset({
      search: "",
      policy_number: "",
      priority: "",
      is_active: "",
    });
  };

  return (
    <div className="flex flex-wrap items-start gap-4 bg-card p-4 rounded-lg border shadow-sm transition-all duration-300">
      <div className="space-y-2 flex-1 min-w-[200px] relative pb-5">
        <Label htmlFor="search" className="text-sm font-medium text-muted-foreground">Rechercher</Label>
        <Input
          id="search"
          {...register("search")}
          placeholder="Rechercher (min. 3 caractères)"
          className="h-10"
        />
        {formValues.search && formValues.search.length < 3 && (
          <p className="text-[11px] text-orange-500 absolute bottom-0 left-0 transition-all animate-in fade-in slide-in-from-top-1">
            Minimum 3 caractères requis
          </p>
        )}
      </div>
      <div className="space-y-2 flex-1 min-w-[200px] relative pb-5">
        <Label htmlFor="searchPolicyNumber" className="text-sm font-medium text-muted-foreground">Numéro de police</Label>
        <Input
          id="searchPolicyNumber"
          {...register("policy_number")}
          placeholder="Numéro de police (min. 7 caractères)"
          className="h-10"
        />
        {formValues.policy_number && formValues.policy_number.length < 7 && (
          <p className="text-[11px] text-orange-500 absolute bottom-0 left-0 transition-all animate-in fade-in slide-in-from-top-1">
            Minimum 7 caractères requis
          </p>
        )}
      </div>
      <div className="space-y-2 w-[120px] pb-5">
        <Label htmlFor="searchPriority" className="text-sm font-medium text-muted-foreground">Priorité</Label>
        <Input
          id="searchPriority"
          {...register("priority")}
          placeholder="Priorité"
          type="number"
          min="1"
          max="10"
          className="h-10"
        />
      </div>
      <div className="space-y-2 w-[150px] pb-5">
        <Label htmlFor="filterActive" className="text-sm font-medium text-muted-foreground">Statut</Label>
        <select
          id="filterActive"
          {...register("is_active")}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        >
          <option value="">Tous</option>
          <option value="true">Actifs</option>
          <option value="false">Inactifs</option>
        </select>
      </div>
      <div className="pt-8">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center justify-center h-10 w-10 p-0 border-dashed hover:border-solid transition-all hover:bg-muted"
          title="Réinitialiser"
          type="button"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
