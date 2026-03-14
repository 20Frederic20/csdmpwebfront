"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CustomSelect from "@/components/ui/custom-select";
import { MedicalService, ServiceCategory } from "../types/medical-service.types";
import { useCreateMedicalService, useUpdateMedicalService } from "../hooks/use-medical-services";
import { useHealthFacilities } from "@/features/health-facilities/hooks/use-health-facilities";
import { usePermissionsContext } from "@/contexts/permissions-context";

const medicalServiceSchema = z.object({
  health_facility_id: z.string().min(1, "L'établissement est requis"),
  code: z.string().min(1, "Le code est requis"),
  label: z.string().min(1, "La désignation est requise"),
  base_price: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(0, "Le prix doit être un nombre positif")
  ),
  category: z.nativeEnum(ServiceCategory),
  is_active: z.boolean().default(true),
});

type MedicalServiceFormValues = z.infer<typeof medicalServiceSchema>;

interface MedicalServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: MedicalService | null;
}

export function MedicalServiceModal({
  open,
  onOpenChange,
  service,
}: MedicalServiceModalProps) {
  const isEditing = !!service;
  const { user } = usePermissionsContext();
  const createService = useCreateMedicalService();
  const updateService = useUpdateMedicalService();
  const { data: healthFacilities } = useHealthFacilities({ limit: 100 });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MedicalServiceFormValues>({
    resolver: zodResolver(medicalServiceSchema),
    defaultValues: {
      health_facility_id: user?.health_facility_id || "",
      code: "",
      label: "",
      base_price: 0,
      category: ServiceCategory.CONSULTATION,
      is_active: true,
    },
  });

  useEffect(() => {
    if (service) {
      reset({
        health_facility_id: service.health_facility_id,
        code: service.code,
        label: service.label,
        base_price: parseFloat(service.base_price),
        category: service.category,
        is_active: service.is_active,
      });
    } else if (open) {
      reset({
        health_facility_id: user?.health_facility_id || "",
        code: "",
        label: "",
        base_price: 0,
        category: ServiceCategory.CONSULTATION,
        is_active: true,
      });
    }
  }, [service, open, user?.health_facility_id, reset]);

  const onSubmit = async (values: MedicalServiceFormValues) => {
    try {
      if (isEditing && service) {
        await updateService.mutateAsync({ id: service.id, data: values });
      } else {
        await createService.mutateAsync(values as any);
      }
      onOpenChange(false);
    } catch (error) {
      // Handled by hook
    }
  };

  const healthFacilityOptions = healthFacilities?.data.map((hf: any) => ({
    value: hf.id_,
    label: hf.name,
  })) || [];

  const categoryOptions = Object.values(ServiceCategory).map((cat) => ({
    value: cat,
    label: cat,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le service médical" : "Ajouter un service médical"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="health_facility_id">Établissement</Label>
            <Controller
              name="health_facility_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={healthFacilityOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Sélectionner un établissement"
                  height="h-10"
                />
              )}
            />
            {errors.health_facility_id && (
              <p className="text-sm text-red-500">{errors.health_facility_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                placeholder="SVC-001"
                {...register("code")}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={categoryOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Catégorie"
                    height="h-10"
                  />
                )}
              />
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Désignation</Label>
            <Input
              id="label"
              placeholder="Ex: Consultation médecine générale"
              {...register("label")}
            />
            {errors.label && (
              <p className="text-sm text-red-500">{errors.label.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_price">Prix de base (XAF)</Label>
            <Input
              id="base_price"
              type="number"
              {...register("base_price")}
            />
            {errors.base_price && (
              <p className="text-sm text-red-500">{errors.base_price.message}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>Statut actif</Label>
              </div>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createService.isPending || updateService.isPending}>
              {isEditing ? "Enregistrer les modifications" : "Ajouter le service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
