"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CreateLifestyleRequest } from "@/features/patients/types/lifestyle.types";
import { LifestyleService } from "@/features/patients/services/lifestyle.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { toast } from "sonner";

interface AddLifestyleModalProps {
  patientId: string;
  onLifestyleAdded: () => void;
}

export function AddLifestyleModal({ patientId, onLifestyleAdded }: AddLifestyleModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthToken();
  const [formData, setFormData] = useState({
    smoking_status: "never" as 'never' | 'former' | 'current',
    alcohol_consumption: "none" as 'none' | 'occasional' | 'regular' | 'heavy',
    physical_activity: "moderate" as 'sedentary' | 'light' | 'moderate' | 'intense',
    diet_type: "omnivore" as 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'gluten_free' | 'other',
    sleep_hours: 8,
    stress_level: "moderate" as 'low' | 'moderate' | 'high',
    notes: "",
    source: "manual" as 'manual' | 'ocr' | 'prev_cons',
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await LifestyleService.createLifestyle({
        ...formData,
      }, patientId, token || undefined);
      setOpen(false);
      setFormData({
        smoking_status: "never",
        alcohol_consumption: "none",
        physical_activity: "moderate",
        diet_type: "omnivore",
        sleep_hours: 8,
        stress_level: "moderate",
        notes: "",
        source: "manual",
      });
      toast.success("Style de vie ajouté avec succès");
      onLifestyleAdded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'ajout du style de vie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un style de vie</DialogTitle>
          <DialogDescription>
            Enregistrer les informations sur le style de vie du patient
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smoking_status">Tabagisme</Label>
                <Select value={formData.smoking_status} onValueChange={(value) => handleInputChange("smoking_status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Jamais</SelectItem>
                    <SelectItem value="former">Ancien fumeur</SelectItem>
                    <SelectItem value="current">Fumeur actuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alcohol_consumption">Consommation d'alcool</Label>
                <Select value={formData.alcohol_consumption} onValueChange={(value) => handleInputChange("alcohol_consumption", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    <SelectItem value="occasional">Occasionnelle</SelectItem>
                    <SelectItem value="regular">Régulière</SelectItem>
                    <SelectItem value="heavy">Importante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="physical_activity">Activité physique</Label>
                <Select value={formData.physical_activity} onValueChange={(value) => handleInputChange("physical_activity", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sédentaire</SelectItem>
                    <SelectItem value="light">Légère</SelectItem>
                    <SelectItem value="moderate">Modérée</SelectItem>
                    <SelectItem value="intense">Intense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="diet_type">Type de régime</Label>
                <Select value={formData.diet_type} onValueChange={(value) => handleInputChange("diet_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="omnivore">Omnivore</SelectItem>
                    <SelectItem value="vegetarian">Végétarien</SelectItem>
                    <SelectItem value="vegan">Végétalien</SelectItem>
                    <SelectItem value="pescatarian">Pescétarien</SelectItem>
                    <SelectItem value="gluten_free">Sans gluten</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sleep_hours">Heures de sommeil</Label>
                <Input
                  id="sleep_hours"
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={formData.sleep_hours}
                  onChange={(e) => handleInputChange("sleep_hours", parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stress_level">Niveau de stress</Label>
                <Select value={formData.stress_level} onValueChange={(value) => handleInputChange("stress_level", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="moderate">Modéré</SelectItem>
                    <SelectItem value="high">Élevé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manuelle</SelectItem>
                  <SelectItem value="ocr">OCR</SelectItem>
                  <SelectItem value="prev_cons">Consultation précédente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Informations supplémentaires..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
