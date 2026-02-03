"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useAuthToken } from "@/hooks/use-auth-token";
import { toast } from "sonner";

interface AddFamilyHistoryModalProps {
  patientId: string;
  onFamilyHistoryAdded: () => void;
}

interface FamilyHistoryData {
  relationship: string;
  condition: string;
  age_at_diagnosis?: number;
  status: string;
  notes?: string;
}

export function AddFamilyHistoryModal({ patientId, onFamilyHistoryAdded }: AddFamilyHistoryModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthToken();
  const [formData, setFormData] = useState<FamilyHistoryData>({
    relationship: "",
    condition: "",
    age_at_diagnosis: undefined,
    status: "active",
    notes: "",
  });

  const handleInputChange = (field: string, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implémenter le service d'antécédents familiaux
      // await FamilyHistoryService.createFamilyHistory(formData, patientId, token || undefined);
      
      console.log("Family history data:", formData);
      setOpen(false);
      setFormData({
        relationship: "",
        condition: "",
        age_at_diagnosis: undefined,
        status: "active",
        notes: "",
      });
      toast.success("Antécédent familial ajouté avec succès");
      onFamilyHistoryAdded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'ajout de l\'antécédent familial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un antécédent familial</DialogTitle>
          <DialogDescription>
            Enregistrer un nouvel antécédent familial pour le patient
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="relationship">Lien de parenté <span className="text-red-500">*</span></Label>
                <Select value={formData.relationship} onValueChange={(value) => handleInputChange("relationship", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Père</SelectItem>
                    <SelectItem value="mother">Mère</SelectItem>
                    <SelectItem value="brother">Frère</SelectItem>
                    <SelectItem value="sister">Sœur</SelectItem>
                    <SelectItem value="grandfather">Grand-père</SelectItem>
                    <SelectItem value="grandmother">Grand-mère</SelectItem>
                    <SelectItem value="uncle">Oncle</SelectItem>
                    <SelectItem value="aunt">Tante</SelectItem>
                    <SelectItem value="cousin">Cousin/Cousine</SelectItem>
                    <SelectItem value="son">Fils</SelectItem>
                    <SelectItem value="daughter">Fille</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition médicale <span className="text-red-500">*</span></Label>
                <Input
                  id="condition"
                  value={formData.condition}
                  onChange={(e) => handleInputChange("condition", e.target.value)}
                  placeholder="Ex: Diabète, Hypertension, Cancer..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age_at_diagnosis">Âge au diagnostic (optionnel)</Label>
                <Input
                  id="age_at_diagnosis"
                  type="number"
                  min="0"
                  max="120"
                  value={formData.age_at_diagnosis || ""}
                  onChange={(e) => handleInputChange("age_at_diagnosis", e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Âge en années"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut <span className="text-red-500">*</span></Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="resolved">Résolu</SelectItem>
                    <SelectItem value="chronic">Chronique</SelectItem>
                    <SelectItem value="deceased">Décédé</SelectItem>
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
