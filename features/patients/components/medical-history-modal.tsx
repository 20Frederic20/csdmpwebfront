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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MedicalHistoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MedicalHistoryFormData) => void;
  editingMedicalHistory?: any;
}

interface MedicalHistoryFormData {
  condition: string;
  diagnosis_date?: string;
  description?: string;
  status: string;
  severity?: string;
}

export function MedicalHistoryModal({ open, onClose, onSubmit, editingMedicalHistory }: MedicalHistoryModalProps) {
  const [formData, setFormData] = useState<MedicalHistoryFormData>({
    condition: editingMedicalHistory?.condition || "",
    diagnosis_date: editingMedicalHistory?.diagnosis_date || "",
    description: editingMedicalHistory?.description || "",
    status: editingMedicalHistory?.status || "",
    severity: editingMedicalHistory?.severity || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      condition: "",
      diagnosis_date: "",
      description: "",
      status: "",
      severity: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingMedicalHistory ? "Modifier l'antécédent médical" : "Ajouter un antécédent médical"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="condition">Condition</Label>
            <Input
              id="condition"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="diagnosis_date">Date de diagnostic</Label>
            <Input
              id="diagnosis_date"
              type="date"
              value={formData.diagnosis_date}
              onChange={(e) => setFormData({ ...formData, diagnosis_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
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

          <div>
            <Label htmlFor="severity">Sévérité</Label>
            <Select
              value={formData.severity}
              onValueChange={(value) => setFormData({ ...formData, severity: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Léger</SelectItem>
                <SelectItem value="moderate">Modéré</SelectItem>
                <SelectItem value="severe">Grave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit">
              {editingMedicalHistory ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
