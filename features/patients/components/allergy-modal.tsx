"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomSelect from "@/components/ui/custom-select";

// Fonctions de traduction pour les enums
const translateAllergenType = (value: string) => {
  const translations: Record<string, string> = {
    "FOOD": "Alimentaire",
    "MEDICATION": "Médicamenteuse", 
    "ENVIRONMENTAL": "Environnementale",
    "OTHER": "Autre"
  };
  return translations[value] || value;
};

const translateAllergySeverity = (value: string) => {
  const translations: Record<string, string> = {
    "MILD": "Léger",
    "MODERATE": "Modéré",
    "SEVERE": "Grave",
    "ABSOLUTELY_CONTRAINDICATED": "Contre-indiqué absolu"
  };
  return translations[value] || value;
};

const translateAllergySource = (value: string) => {
  const translations: Record<string, string> = {
    "MANUAL": "Manuel",
    "OCR": "OCR",
    "PREVIOUS_CONSULTATION": "Consultation précédente"
  };
  return translations[value] || value;
};

interface AllergyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AllergyFormData) => void;
  editingAllergy?: any;
}

interface AllergyFormData {
  allergen: string;
  allergen_type: string;
  reaction: string;
  severity: string;
  source?: string;
  notes?: string;
}

export function AllergyModal({ open, onClose, onSubmit, editingAllergy }: AllergyModalProps) {
  
  const [formData, setFormData] = useState<AllergyFormData>({
    allergen: editingAllergy?.allergen || "",
    allergen_type: editingAllergy?.allergen_type || "",
    reaction: editingAllergy?.reaction || "",
    severity: editingAllergy?.severity || "",
    source: editingAllergy?.source || "",
    notes: editingAllergy?.notes || "",
  });

  // Options pour les selects
  const allergenTypeOptions = [
    { value: "FOOD", label: "Alimentaire" },
    { value: "MEDICATION", label: "Médicamenteuse" },
    { value: "ENVIRONMENTAL", label: "Environnementale" },
    { value: "OTHER", label: "Autre" }
  ];

  const severityOptions = [
    { value: "MILD", label: "Léger" },
    { value: "MODERATE", label: "Modéré" },
    { value: "SEVERE", label: "Grave" },
    { value: "ABSOLUTELY_CONTRAINDICATED", label: "Contre-indiqué absolu" }
  ];

  const sourceOptions = [
    { value: "MANUAL", label: "Manuel" },
    { value: "OCR", label: "OCR" },
    { value: "PREVIOUS_CONSULTATION", label: "Consultation précédente" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      allergen: "",
      allergen_type: "",
      reaction: "",
      severity: "",
      source: "",
      notes: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingAllergy ? "Modifier l'allergie" : "Ajouter une allergie"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="allergen">Allergène</Label>
              <Input
                id="allergen"
                value={formData.allergen}
                onChange={(e) => setFormData({ ...formData, allergen: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="allergen_type">Type</Label>
              <CustomSelect
                options={allergenTypeOptions}
                value={formData.allergen_type}
                onChange={(value) => setFormData({ ...formData, allergen_type: (value as string) || "" })}
                placeholder="Sélectionner un type"
                height="h-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="reaction">Réaction</Label>
            <Input
              id="reaction"
              value={formData.reaction}
              onChange={(e) => setFormData({ ...formData, reaction: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="severity">Sévérité</Label>
            <CustomSelect
              options={severityOptions}
              value={formData.severity}
              onChange={(value) => setFormData({ ...formData, severity: (value as string) || "" })}
              placeholder="Sélectionner une sévérité"
              height="h-10"
            />
          </div>

          <div>
            <Label htmlFor="source">Source</Label>
            <CustomSelect
              options={sourceOptions}
              value={formData.source}
              onChange={(value) => setFormData({ ...formData, source: (value as string) || "" })}
              placeholder="Sélectionner une source"
              height="h-10"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit">
              {editingAllergy ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
