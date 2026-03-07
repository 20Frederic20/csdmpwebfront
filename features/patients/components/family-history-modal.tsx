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

interface FamilyHistoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FamilyHistoryFormData) => void;
  editingFamilyHistory?: any;
}

interface FamilyHistoryFormData {
  condition: string;
  relationship: string;
  age_of_onset?: number;
  notes?: string;
}

export function FamilyHistoryModal({ open, onClose, onSubmit, editingFamilyHistory }: FamilyHistoryModalProps) {
  const [formData, setFormData] = useState<FamilyHistoryFormData>({
    condition: editingFamilyHistory?.condition || "",
    relationship: editingFamilyHistory?.relationship || "",
    age_of_onset: editingFamilyHistory?.age_of_onset || undefined,
    notes: editingFamilyHistory?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      condition: "",
      relationship: "",
      age_of_onset: undefined,
      notes: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingFamilyHistory ? "Modifier l'antécédent familial" : "Ajouter un antécédent familial"}
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
            <Label htmlFor="relationship">Relation</Label>
            <Select
              value={formData.relationship}
              onValueChange={(value) => setFormData({ ...formData, relationship: value })}
            >
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
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="age_of_onset">Âge d'apparition</Label>
            <Input
              id="age_of_onset"
              type="number"
              value={formData.age_of_onset || ""}
              onChange={(e) => setFormData({ ...formData, age_of_onset: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="Âge en années"
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
              {editingFamilyHistory ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
