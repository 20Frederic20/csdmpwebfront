"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MedicalService, ServiceCategory } from "../types/medical-service.types";
import { useCreateMedicalService, useUpdateMedicalService } from "../hooks/use-medical-services";
import { useHealthFacilities } from "@/features/health-facilities/hooks/use-health-facilities";
import { usePermissionsContext } from "@/contexts/permissions-context";
import { toast } from "sonner";

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

  const [formData, setFormData] = useState({
    health_facility_id: "",
    code: "",
    label: "",
    base_price: "0",
    category: ServiceCategory.CONSULTATION,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      setFormData({
        health_facility_id: service.health_facility_id,
        code: service.code,
        label: service.label,
        base_price: service.base_price,
        category: service.category,
        is_active: service.is_active,
      });
    } else if (open) {
      setFormData({
        health_facility_id: user?.health_facility_id || "",
        code: "",
        label: "",
        base_price: "0",
        category: ServiceCategory.CONSULTATION,
        is_active: true,
      });
    }
    setErrors({});
  }, [service, open, user?.health_facility_id]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.health_facility_id) newErrors.health_facility_id = "L'établissement est requis";
    if (!formData.code) newErrors.code = "Le code est requis";
    if (!formData.label) newErrors.label = "La désignation est requise";
    if (isNaN(Number(formData.base_price)) || Number(formData.base_price) < 0) {
      newErrors.base_price = "Le prix doit être un nombre positif";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const dataToSubmit = {
        ...formData,
        base_price: Number(formData.base_price),
      };

      if (isEditing && service) {
        await updateService.mutateAsync({ id: service.id, data: dataToSubmit });
      } else {
        await createService.mutateAsync(dataToSubmit as any);
      }
      onOpenChange(false);
    } catch (error) {
      // Handled by hook
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le service médical" : "Ajouter un service médical"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="health_facility_id">Établissement</Label>
            <Select
              onValueChange={(val) => handleInputChange("health_facility_id", val)}
              value={formData.health_facility_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un établissement" />
              </SelectTrigger>
              <SelectContent>
                {healthFacilities?.data.map((hf: any) => (
                  <SelectItem key={hf.id_} value={hf.id_}>
                    {hf.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.health_facility_id && (
              <p className="text-sm text-red-500">{errors.health_facility_id}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                placeholder="SVC-001"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                onValueChange={(val) => handleInputChange("category", val)}
                value={formData.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ServiceCategory).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Désignation</Label>
            <Input
              id="label"
              placeholder="Ex: Consultation médecine générale"
              value={formData.label}
              onChange={(e) => handleInputChange("label", e.target.value)}
            />
            {errors.label && (
              <p className="text-sm text-red-500">{errors.label}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_price">Prix de base (XAF)</Label>
            <Input
              id="base_price"
              type="number"
              value={formData.base_price}
              onChange={(e) => handleInputChange("base_price", e.target.value)}
            />
            {errors.base_price && (
              <p className="text-sm text-red-500">{errors.base_price}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>Statut actif</Label>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(val) => handleInputChange("is_active", val)}
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
