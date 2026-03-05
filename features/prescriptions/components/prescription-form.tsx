"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  CreatePrescriptionRequest, 
  Prescription 
} from "@/features/prescriptions/types/prescriptions.types";
import { getMedicationOptions } from "@/features/prescriptions/utils/prescriptions.utils";

interface PrescriptionFormProps {
  consultationId: string;
  medicationName: string;
  dosageInstructions: string;
  form?: string[];
  strength?: string;
  durationDays?: number;
  specialInstructions?: string;
  isConfidential: boolean;
  isActive: boolean;
  onFieldChange: (field: keyof CreatePrescriptionRequest, value: string | number | boolean | string[]) => void;
}

export function PrescriptionForm({
  consultationId,
  medicationName,
  dosageInstructions,
  form = [],
  strength,
  durationDays,
  specialInstructions,
  isConfidential,
  isActive = true,
  onFieldChange
}: PrescriptionFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="consultation_id">
          Consultation <span className="text-red-500">*</span>
        </Label>
        <Input
          id="consultation_id"
          type="text"
          value={consultationId}
          onChange={(e) => onFieldChange('consultation_id', e.target.value)}
          placeholder="ID de la consultation"
          required
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="medication_name">
          Médicament <span className="text-red-500">*</span>
        </Label>
        <Input
          id="medication_name"
          type="text"
          value={medicationName}
          onChange={(e) => onFieldChange('medication_name', e.target.value)}
          placeholder="Nom du médicament"
          required
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dosage_instructions">
          Instructions de dosage <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="dosage_instructions"
          value={dosageInstructions}
          onChange={(e) => onFieldChange('dosage_instructions', e.target.value)}
          placeholder="Instructions de dosage (ex: 1 comprimé le matin)"
          rows={3}
          required
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="form">
          Forme galénique
        </Label>
        <Input
          id="form"
          type="text"
          value={form?.join(', ')}
          onChange={(e) => onFieldChange('form', e.target.value.split(',').map(f => f.trim()))}
          placeholder="Comprimé, Gélule, Suppositoire (séparez par des virgules)"
          className="h-10"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="strength">
            Force
          </Label>
          <Input
            id="strength"
            type="text"
            value={strength || ""}
            onChange={(e) => onFieldChange('strength', e.target.value)}
            placeholder="Ex: 500mg"
            className="h-10"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration_days">
            Durée (jours)
          </Label>
          <Input
            id="duration_days"
            type="number"
            min="1"
            max="365"
            value={durationDays || 0}
            onChange={(e) => onFieldChange('duration_days', parseInt(e.target.value) || 0)}
            placeholder="Nombre de jours"
            className="h-10"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="special_instructions">
          Instructions spéciales
        </Label>
        <Textarea
          id="special_instructions"
          value={specialInstructions}
          onChange={(e) => onFieldChange('special_instructions', e.target.value)}
          placeholder="Instructions spéciales (ex: Prendre avec repas)"
          rows={2}
          className="h-10"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={isActive}
            onCheckedChange={(checked) => onFieldChange('is_active', checked)}
          />
          <Label htmlFor="is_active">
            Active
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="is_confidential"
            checked={isConfidential}
            onCheckedChange={(checked) => onFieldChange('is_confidential', checked)}
          />
          <Label htmlFor="is_confidential">
            Confidentiel
          </Label>
        </div>
      </div>
    </div>
  );
}
