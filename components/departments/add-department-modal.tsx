"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CustomSelect from "@/components/ui/custom-select";
import { Save, X } from "lucide-react";
import { CreateDepartmentRequest, HospitalDepartment } from "@/features/departments/types/departments.types";
import { DepartmentService } from "@/features/departments/services/departments.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { HealthFacilitySelect } from "@/components/health-facilities/health-facility-select";

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepartmentCreated?: (department: any) => void;
  defaultHealthFacilityId?: string;
}

export function AddDepartmentModal({
  isOpen,
  onClose,
  onDepartmentCreated,
  defaultHealthFacilityId = "",
}: AddDepartmentModalProps) {
  const { token } = useAuthToken();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDepartmentRequest>({
    health_facility_id: defaultHealthFacilityId,
    name: "",
    code: HospitalDepartment.EMERGENCY,
    is_active: true,
  });

  // Options pour le CustomSelect
  const departmentOptions = [
    { value: HospitalDepartment.EMERGENCY, label: 'Urgences' },
    { value: HospitalDepartment.INTENSIVE_CARE, label: 'Soins intensifs' },
    { value: HospitalDepartment.SURGERY, label: 'Chirurgie' },
    { value: HospitalDepartment.PEDIATRICS, label: 'Pédiatrie' },
    { value: HospitalDepartment.OBSTETRICS_GYNECOLOGY, label: 'Obstétrique-Gynécologie' },
    { value: HospitalDepartment.CARDIOLOGY, label: 'Cardiologie' },
    { value: HospitalDepartment.NEUROLOGY, label: 'Neurologie' },
    { value: HospitalDepartment.ONCOLOGY, label: 'Oncologie' },
    { value: HospitalDepartment.RADIOLOGY, label: 'Radiologie' },
    { value: HospitalDepartment.LABORATORY, label: 'Laboratoire' },
    { value: HospitalDepartment.PHARMACY, label: 'Pharmacie' },
    { value: HospitalDepartment.OUTPATIENT, label: 'Consultations externes' },
    { value: HospitalDepartment.INPATIENT, label: 'Hospitalisation' },
    { value: HospitalDepartment.MATERNITY, label: 'Maternité' },
    { value: HospitalDepartment.NEONATAL, label: 'Néonatalogie' },
    { value: HospitalDepartment.PSYCHIATRY, label: 'Psychiatrie' },
    { value: HospitalDepartment.DENTISTRY, label: 'Dentisterie' },
    { value: HospitalDepartment.OPHTHALMOLOGY, label: 'Ophtalmologie' },
    { value: HospitalDepartment.ORTHOPEDICS, label: 'Orthopédie' },
    { value: HospitalDepartment.DERMATOLOGY, label: 'Dermatologie' },
    { value: HospitalDepartment.INFECTIOUS_DISEASES, label: 'Maladies infectieuses' },
    { value: HospitalDepartment.INTERNAL_MEDICINE, label: 'Médecine interne' },
    { value: HospitalDepartment.ANESTHESIOLOGY, label: 'Anesthésiologie' },
    { value: HospitalDepartment.PATHOLOGY, label: 'Pathologie' },
    { value: HospitalDepartment.NUTRITION, label: 'Nutrition' },
    { value: HospitalDepartment.REHABILITATION, label: 'Rééducation' },
    { value: HospitalDepartment.EMERGENCY_ROOM, label: 'Salle d\'urgence' },
    { value: HospitalDepartment.INTENSIVE_CARE_UNIT, label: 'Unité de soins intensifs' },
    { value: HospitalDepartment.PEDIATRIC_EMERGENCY, label: 'Urgences pédiatriques' },
    { value: HospitalDepartment.SURGICAL_EMERGENCY, label: 'Urgences chirurgicales' },
    { value: HospitalDepartment.OBSTETRIC_EMERGENCY, label: 'Urgences obstétriques' },
  ];

  const handleInputChange = (field: keyof CreateDepartmentRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCodeChange = (value: string | string[] | null) => {
    handleInputChange('code', value as HospitalDepartment);
  };

  const handleHealthFacilityChange = (value: string | null) => {
    handleInputChange('health_facility_id', value || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.health_facility_id.trim()) {
      return; // Gérer l'erreur avec un toast si nécessaire
    }
    
    if (!formData.name.trim()) {
      return; // Gérer l'erreur avec un toast si nécessaire
    }

    setLoading(true);
    
    try {
      const newDepartment = await DepartmentService.createDepartment(formData, token || undefined);
      onDepartmentCreated?.(newDepartment);
      
      // Reset du formulaire
      setFormData({
        health_facility_id: defaultHealthFacilityId,
        name: "",
        code: HospitalDepartment.EMERGENCY,
        is_active: true,
      });
      
      onClose();
    } catch (error: any) {
      console.error('Error creating department:', error);
      // Gérer l'erreur avec un toast si nécessaire
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Ajouter un département
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={loading}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Créer un nouveau département dans le système
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Établissement de santé */}
            <div className="md:col-span-2">
              <HealthFacilitySelect
                value={formData.health_facility_id}
                onChange={handleHealthFacilityChange}
                placeholder="Sélectionner un établissement de santé"
                required={true}
                disabled={loading}
              />
            </div>

            {/* Nom du département */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom du département *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nom du département"
                required
                disabled={loading}
              />
            </div>

            {/* Code du département */}
            <div className="space-y-2">
              <Label htmlFor="code">Code du département *</Label>
              <CustomSelect
                options={departmentOptions}
                value={formData.code}
                onChange={handleCodeChange}
                placeholder="Sélectionner le code du département"
                height="h-10"
                disabled={loading}
              />
            </div>

            {/* Statut */}
            <div className="space-y-2">
              <Label htmlFor="is_active">Statut</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  disabled={loading}
                />
                <Label htmlFor="is_active" className="text-sm">
                  Département actif
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Créer le département
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
