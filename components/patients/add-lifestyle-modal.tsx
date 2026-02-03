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
    tobacco_status: "never" as 'never' | 'former' | 'current',
    alcohol_consumption: "none" as 'none' | 'occasional' | 'frequent',
    physical_activity: "moderate" as 'sedentary' | 'moderate' | 'active',
    assessment_date: "",
    tobacco_per_week: null as number | null,
    alcohol_units_per_week: null as number | null,
    dietary_regime: "",
    occupational_risks: "",
    notes: "",
  });

  const handleInputChange = (field: string, value: string | number | null) => {
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
        tobacco_status: "never",
        alcohol_consumption: "none",
        physical_activity: "moderate",
        assessment_date: "",
        tobacco_per_week: null,
        alcohol_units_per_week: null,
        dietary_regime: "",
        occupational_risks: "",
        notes: "",
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
                <Label htmlFor="tobacco_status">Tabagisme</Label>
                <Select value={formData.tobacco_status} onValueChange={(value) => handleInputChange("tobacco_status", value)}>
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
                    <SelectItem value="frequent">Fréquente</SelectItem>
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
                    <SelectItem value="moderate">Modérée</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assessment_date">Date d'évaluation</Label>
                <Input
                  id="assessment_date"
                  type="date"
                  value={formData.assessment_date}
                  onChange={(e) => handleInputChange("assessment_date", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tobacco_per_week">Cigarettes/semaine</Label>
                <Input
                  id="tobacco_per_week"
                  type="number"
                  min="0"
                  value={formData.tobacco_per_week || ""}
                  onChange={(e) => handleInputChange("tobacco_per_week", e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Optionnel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alcohol_units_per_week">Unités alcool/semaine</Label>
                <Input
                  id="alcohol_units_per_week"
                  type="number"
                  min="0"
                  value={formData.alcohol_units_per_week || ""}
                  onChange={(e) => handleInputChange("alcohol_units_per_week", e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Optionnel"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dietary_regime">Régime alimentaire</Label>
                <Input
                  id="dietary_regime"
                  value={formData.dietary_regime}
                  onChange={(e) => handleInputChange("dietary_regime", e.target.value)}
                  placeholder="Ex: Végétarien, Sans gluten..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupational_risks">Risques professionnels</Label>
                <Input
                  id="occupational_risks"
                  value={formData.occupational_risks}
                  onChange={(e) => handleInputChange("occupational_risks", e.target.value)}
                  placeholder="Ex: Exposition aux produits chimiques..."
                />
              </div>
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
