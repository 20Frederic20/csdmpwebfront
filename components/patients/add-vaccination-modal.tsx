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

interface AddVaccinationModalProps {
  patientId: string;
  onVaccinationAdded: () => void;
}

interface VaccinationData {
  vaccine_name: string;
  vaccine_type: string;
  administration_date: string;
  dose_number: number;
  next_due_date?: string;
  administered_by: string;
  batch_number?: string;
  notes?: string;
}

export function AddVaccinationModal({ patientId, onVaccinationAdded }: AddVaccinationModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthToken();
  const [formData, setFormData] = useState<VaccinationData>({
    vaccine_name: "",
    vaccine_type: "",
    administration_date: "",
    dose_number: 1,
    next_due_date: "",
    administered_by: "",
    batch_number: "",
    notes: "",
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
      // TODO: Implémenter le service de vaccination
      // await VaccinationService.createVaccination(formData, patientId, token || undefined);
      
      console.log("Vaccination data:", formData);
      setOpen(false);
      setFormData({
        vaccine_name: "",
        vaccine_type: "",
        administration_date: "",
        dose_number: 1,
        next_due_date: "",
        administered_by: "",
        batch_number: "",
        notes: "",
      });
      toast.success("Vaccination ajoutée avec succès");
      onVaccinationAdded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'ajout de la vaccination');
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
          <DialogTitle>Ajouter une vaccination</DialogTitle>
          <DialogDescription>
            Enregistrer une nouvelle vaccination pour le patient
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vaccine_name">Nom du vaccin <span className="text-red-500">*</span></Label>
                <Input
                  id="vaccine_name"
                  value={formData.vaccine_name}
                  onChange={(e) => handleInputChange("vaccine_name", e.target.value)}
                  placeholder="Ex: BCG, DTC, Hepatite B"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vaccine_type">Type de vaccin <span className="text-red-500">*</span></Label>
                <Select value={formData.vaccine_type} onValueChange={(value) => handleInputChange("vaccine_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bcg">BCG</SelectItem>
                    <SelectItem value="dtc">DTC</SelectItem>
                    <SelectItem value="polio">Poliomyélite</SelectItem>
                    <SelectItem value="rougeole">Rougeole</SelectItem>
                    <SelectItem value="hepatite_b">Hépatite B</SelectItem>
                    <SelectItem value="tetanos">Tétanos</SelectItem>
                    <SelectItem value="covid19">COVID-19</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="administration_date">Date d'administration <span className="text-red-500">*</span></Label>
                <Input
                  id="administration_date"
                  type="date"
                  value={formData.administration_date}
                  onChange={(e) => handleInputChange("administration_date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dose_number">Numéro de dose <span className="text-red-500">*</span></Label>
                <Input
                  id="dose_number"
                  type="number"
                  min="1"
                  value={formData.dose_number}
                  onChange={(e) => handleInputChange("dose_number", parseInt(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="next_due_date">Prochaine dose (optionnel)</Label>
                <Input
                  id="next_due_date"
                  type="date"
                  value={formData.next_due_date}
                  onChange={(e) => handleInputChange("next_due_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="administered_by">Administré par <span className="text-red-500">*</span></Label>
                <Input
                  id="administered_by"
                  value={formData.administered_by}
                  onChange={(e) => handleInputChange("administered_by", e.target.value)}
                  placeholder="Nom du professionnel de santé"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch_number">Numéro de lot (optionnel)</Label>
                <Input
                  id="batch_number"
                  value={formData.batch_number}
                  onChange={(e) => handleInputChange("batch_number", e.target.value)}
                  placeholder="Lot du vaccin"
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
