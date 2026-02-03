"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CreateMedicalHistoryRequest } from "@/features/patients/types/medical-history.types";
import { MedicalHistoryService } from "@/features/patients/services/medical-history.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { toast } from "sonner";

interface AddMedicalHistoryModalProps {
  patientId: string;
  onMedicalHistoryAdded: () => void;
}

export function AddMedicalHistoryModal({ patientId, onMedicalHistoryAdded }: AddMedicalHistoryModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthToken();
  const [formData, setFormData] = useState({
    category: "medical" as 'medical' | 'surgical' | 'obstetric',
    description: "",
    onset_date: "",
    status: "active" as 'active' | 'resolved' | 'chronic',
    code: null as string | null,
    severity: "moderate" as 'mild' | 'moderate' | 'severe',
    notes: null as string | null,
    resolution_date: null as string | null,
    is_active: true,
  });

  const handleInputChange = (field: string, value: string | boolean | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await MedicalHistoryService.createMedicalHistory({
        ...formData,
      }, patientId, token || undefined);
      setOpen(false);
      setFormData({
        category: "medical",
        description: "",
        onset_date: "",
        status: "active",
        code: null,
        severity: "moderate",
        notes: null,
        resolution_date: null,
        is_active: true,
      });
      toast.success("Antécédent médical ajouté avec succès");
      onMedicalHistoryAdded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'ajout de l\'antécédent médical');
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
          <DialogTitle>Ajouter un antécédent médical</DialogTitle>
          <DialogDescription>
            Enregistrer un nouvel antécédent médical pour le patient
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Médical</SelectItem>
                    <SelectItem value="surgical">Chirurgical</SelectItem>
                    <SelectItem value="obstetric">Obstétrique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="resolved">Résolu</SelectItem>
                    <SelectItem value="chronic">Chronique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Description de l'antécédent médical..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="onset_date">Date de début *</Label>
                <Input
                  id="onset_date"
                  type="date"
                  value={formData.onset_date}
                  onChange={(e) => handleInputChange("onset_date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Sévérité</Label>
                <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Léger</SelectItem>
                    <SelectItem value="moderate">Modéré</SelectItem>
                    <SelectItem value="severe">Sévère</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code (optionnel)</Label>
                <Input
                  id="code"
                  value={formData.code || ""}
                  onChange={(e) => handleInputChange("code", e.target.value || null)}
                  placeholder="Ex: I10, J45, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resolution_date">Date de résolution</Label>
                <Input
                  id="resolution_date"
                  type="date"
                  value={formData.resolution_date || ""}
                  onChange={(e) => handleInputChange("resolution_date", e.target.value || null)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Input
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value || null)}
                placeholder="Informations supplémentaires..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleInputChange("is_active", e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="is_active">Actif</Label>
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
