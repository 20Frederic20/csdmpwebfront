"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CustomSelect from "@/components/ui/custom-select";
import { 
  useCreateLabParameterNorm, 
  useUpdateLabParameterNorm 
} from "../hooks/use-lab-parameter-norms";
import { 
  LabParameterNorm, 
  Gender 
} from "../types/lab-parameter-norms.types";
import { Loader2, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  parameter_code: z.string().min(1, "Le code est requis"),
  display_name: z.string().min(1, "Le nom est requis"),
  unit: z.string().min(1, "L'unité est requise"),
  gender: z.string().min(1, "Le genre est requis"),
  age_min_months: z.number().min(0, "L'âge minimum doit être positif"),
  age_max_months: z.number().min(0, "L'âge maximum doit être positif"),
  min_value: z.number(),
  max_value: z.number(),
  is_pregnant: z.boolean(),
  trimester: z.number().min(0).max(3),
}).refine((data) => data.age_max_months >= data.age_min_months, {
  message: "L'âge maximum doit être supérieur ou égal à l'âge minimum",
  path: ["age_max_months"],
}).refine((data) => data.max_value >= data.min_value, {
  message: "La valeur maximum doit être supérieure ou égale à la valeur minimum",
  path: ["max_value"],
});

type FormValues = z.infer<typeof formSchema>;

interface LabParameterNormModalProps {
  norm?: LabParameterNorm; // If provided, we're in update mode
  isOpen: boolean;
  onClose: () => void;
}

export function LabParameterNormModal({ norm, isOpen, onClose }: LabParameterNormModalProps) {
  const isUpdate = !!norm;
  const createMutation = useCreateLabParameterNorm();
  const updateMutation = useUpdateLabParameterNorm();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parameter_code: "",
      display_name: "",
      unit: "",
      gender: "ALL",
      age_min_months: 0,
      age_max_months: 1200, // 100 years
      min_value: 0,
      max_value: 0,
      is_pregnant: false,
      trimester: 0,
    },
  });

  const isPregnant = watch("is_pregnant");
  const gender = watch("gender");

  // Reset form when modal opens or norm changes
  useEffect(() => {
    if (isOpen) {
      if (norm) {
        reset({
          parameter_code: norm.parameter_code,
          display_name: norm.display_name,
          unit: norm.unit,
          gender: norm.gender,
          age_min_months: norm.age_min_months,
          age_max_months: norm.age_max_months,
          min_value: norm.min_value,
          max_value: norm.max_value,
          is_pregnant: norm.is_pregnant,
          trimester: norm.trimester,
        });
      } else {
        reset({
          parameter_code: "",
          display_name: "",
          unit: "",
          gender: "ALL",
          age_min_months: 0,
          age_max_months: 1200,
          min_value: 0,
          max_value: 0,
          is_pregnant: false,
          trimester: 0,
        });
      }
    }
  }, [isOpen, norm, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isUpdate && norm) {
        await updateMutation.mutateAsync({
          id: norm.id,
          payload: {
            min_value: values.min_value,
            max_value: values.max_value,
          },
        });
      } else {
        await createMutation.mutateAsync(values as any);
      }
      onClose();
    } catch (error) {
      // Error handled by mutation toast
    }
  };

  const genderOptions = [
    { value: 'MALE', label: "Homme" },
    { value: 'FEMALE', label: "Femme" },
    { value: 'ALL', label: "Tous" },
  ];

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isUpdate ? "Modifier la norme" : "Créer une nouvelle norme"} 
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Info */}
          <div className="space-y-2">
            <Label htmlFor="parameter_code">Code Paramètre</Label>
            <Input 
              id="parameter_code" 
              {...register("parameter_code")} 
              disabled={isUpdate || isLoading} 
              placeholder="Ex: HGB, WBC..."
              className="border-slate-200 focus:ring-primary/20 focus:border-primary"
            />
            {errors.parameter_code && <p className="text-xs text-red-500 font-medium">{errors.parameter_code.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">Nom Affiché</Label>
            <Input 
              id="display_name" 
              {...register("display_name")} 
              disabled={isUpdate || isLoading} 
              placeholder="Ex: Hémoglobine"
              className="border-slate-200 focus:ring-primary/20 focus:border-primary"
            />
            {errors.display_name && <p className="text-xs text-red-500 font-medium">{errors.display_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unité</Label>
            <Input 
              id="unit" 
              {...register("unit")} 
              disabled={isUpdate || isLoading} 
              placeholder="Ex: g/dL, 10^3/µL"
              className="border-slate-200 focus:ring-primary/20 focus:border-primary"
            />
            {errors.unit && <p className="text-xs text-red-500 font-medium">{errors.unit.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Genre</Label>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <CustomSelect
                  options={genderOptions}
                  value={field.value}
                  onChange={field.onChange}
                  isDisabled={isUpdate || isLoading}
                  placeholder="Sélectionner un genre"
                  className="border-slate-200"
                />
              )}
            />
            {errors.gender && <p className="text-xs text-red-500 font-medium">{errors.gender.message}</p>}
          </div>

          {/* Age Range */}
          <div className="space-y-2">
            <Label htmlFor="age_min_months">Âge Min (Mois)</Label>
            <Input 
              id="age_min_months" 
              type="number" 
              {...register("age_min_months", { valueAsNumber: true })} 
              disabled={isUpdate || isLoading} 
              className="border-slate-200 focus:ring-primary/20 focus:border-primary"
            />
            {errors.age_min_months && <p className="text-xs text-red-500 font-medium">{errors.age_min_months.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age_max_months">Âge Max (Mois)</Label>
            <Input 
              id="age_max_months" 
              type="number" 
              {...register("age_max_months", { valueAsNumber: true })} 
              disabled={isUpdate || isLoading} 
              className="border-slate-200 focus:ring-primary/20 focus:border-primary"
            />
            {errors.age_max_months && <p className="text-xs text-red-500 font-medium">{errors.age_max_months.message}</p>}
          </div>

          {/* Values - ALWAYS EDITABLE */}
          <div className="space-y-2">
            <Label htmlFor="min_value">Valeur Min</Label>
            <Input 
              id="min_value" 
              type="number" 
              step="any" 
              {...register("min_value", { valueAsNumber: true })} 
              disabled={isLoading} 
              className="border-slate-200 focus:ring-primary/20 focus:border-primary"
            />
            {errors.min_value && <p className="text-xs text-red-500 font-medium">{errors.min_value.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_value">Valeur Max</Label>
            <Input 
              id="max_value" 
              type="number" 
              step="any" 
              {...register("max_value", { valueAsNumber: true })} 
              disabled={isLoading} 
              className="border-slate-200 focus:ring-primary/20 focus:border-primary"
            />
            {errors.max_value && <p className="text-xs text-red-500 font-medium">{errors.max_value.message}</p>}
          </div>

          {/* Physiological Status - Only for Females */}
          {gender === 'FEMALE' && (
            <>
              <div className="flex items-center space-x-2 pt-4">
                <Controller
                  control={control}
                  name="is_pregnant"
                  render={({ field }) => (
                    <Checkbox
                      id="is_pregnant"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isUpdate || isLoading}
                    />
                  )}
                />
                <Label htmlFor="is_pregnant" className="cursor-pointer text-slate-700 font-medium">Est enceinte ?</Label>
              </div>

              {isPregnant && (
                <div className="space-y-2">
                  <Label htmlFor="trimester">Trimestre (0-3)</Label>
                  <Input 
                    id="trimester" 
                    type="number" 
                    min={0} 
                    max={3} 
                    {...register("trimester", { valueAsNumber: true })} 
                    disabled={isUpdate || isLoading} 
                    className="border-slate-200 focus:ring-primary/20 focus:border-primary"
                  />
                  {errors.trimester && <p className="text-xs text-red-500 font-medium">{errors.trimester.message}</p>}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
            className="text-slate-600 border-slate-200"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || (isUpdate && !isDirty)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUpdate ? "Mise à jour..." : "Création..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isUpdate ? "Enregistrer les modifications" : "Créer la norme"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
