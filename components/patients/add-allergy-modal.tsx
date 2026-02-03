import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { CreateAllergyRequest } from "@/features/patients/types/allergies.types";
import { AllergiesService } from "@/features/patients/services/allergies.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { toast } from "sonner";

interface AddAllergyModalProps {
  patientId: string;
  onAllergyAdded: () => void;
}

export function AddAllergyModal({ patientId, onAllergyAdded }: AddAllergyModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthToken();
  const [formData, setFormData] = useState({
    allergen: "",
    allergen_type: "food" as 'food' | 'medication' | 'environmental' | 'other',
    severity: "mild" as 'mild' | 'moderate' | 'severe' | 'absolutely_contraindicated',
    reaction: "",
    notes: "",
    onset_date: "",
    source: "manual" as 'manual' | 'ocr' | 'prev_cons',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AllergiesService.createAllergy({
        ...formData,
      }, patientId, token || undefined);
      setOpen(false);
      setFormData({
        allergen: "",
        allergen_type: "food",
        severity: "mild",
        reaction: "",
        notes: "",
        onset_date: "",
        source: "manual",
      });
      toast.success("Allergie ajoutée avec succès");
      onAllergyAdded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'ajout de l\'allergie');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une allergie
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ajouter une allergie</DialogTitle>
            <DialogDescription>
              Ajoutez une nouvelle allergie pour ce patient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="allergen">Allergène</Label>
              <Input
                id="allergen"
                value={formData.allergen}
                onChange={(e) => handleInputChange("allergen", e.target.value)}
                placeholder="Ex: Arachides, Pénicilline..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="allergen_type">Type d'allergie</Label>
                <Select value={formData.allergen_type} onValueChange={(value) => handleInputChange("allergen_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Alimentaire</SelectItem>
                    <SelectItem value="medication">Médicamenteuse</SelectItem>
                    <SelectItem value="environmental">Environnementale</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Sévérité</Label>
                <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Légère</SelectItem>
                    <SelectItem value="moderate">Modérée</SelectItem>
                    <SelectItem value="severe">Sévère</SelectItem>
                    <SelectItem value="absolutely_contraindicated">Contre-indiquée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reaction">Réaction</Label>
              <Input
                id="reaction"
                value={formData.reaction}
                onChange={(e) => handleInputChange("reaction", e.target.value)}
                placeholder="Ex: Urticaire, Difficultés respiratoires..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="onset_date">Date de début (optionnel)</Label>
                <Input
                  id="onset_date"
                  type="date"
                  value={formData.onset_date}
                  onChange={(e) => handleInputChange("onset_date", e.target.value)}
                />
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
