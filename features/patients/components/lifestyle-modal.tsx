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

interface LifestyleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LifestyleFormData) => void;
  editingLifestyle?: any;
}

interface LifestyleFormData {
  tobacco_status: string;
  alcohol_consumption: string;
  physical_activity: string;
  assessment_date?: string;
  tobacco_per_week?: number;
  alcohol_units_per_week?: number;
  dietary_regime?: string;
  occupational_risks?: string;
  notes?: string;
}

export function LifestyleModal({ open, onClose, onSubmit, editingLifestyle }: LifestyleModalProps) {
  const [formData, setFormData] = useState<LifestyleFormData>({
    tobacco_status: editingLifestyle?.tobacco_status || "",
    alcohol_consumption: editingLifestyle?.alcohol_consumption || "",
    physical_activity: editingLifestyle?.physical_activity || "",
    assessment_date: editingLifestyle?.assessment_date || "",
    tobacco_per_week: editingLifestyle?.tobacco_per_week || undefined,
    alcohol_units_per_week: editingLifestyle?.alcohol_units_per_week || undefined,
    dietary_regime: editingLifestyle?.dietary_regime || "",
    occupational_risks: editingLifestyle?.occupational_risks || "",
    notes: editingLifestyle?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      tobacco_status: "",
      alcohol_consumption: "",
      physical_activity: "",
      assessment_date: "",
      tobacco_per_week: undefined,
      alcohol_units_per_week: undefined,
      dietary_regime: "",
      occupational_risks: "",
      notes: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingLifestyle ? "Modifier le style de vie" : "Ajouter un style de vie"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tobacco_status">Tabac</Label>
              <Select
                value={formData.tobacco_status}
                onValueChange={(value) => setFormData({ ...formData, tobacco_status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="non-smoker">Non-fumeur</SelectItem>
                  <SelectItem value="smoker">Fumeur</SelectItem>
                  <SelectItem value="former-smoker">Ex-fumeur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="alcohol_consumption">Alcool</Label>
              <Select
                value={formData.alcohol_consumption}
                onValueChange={(value) => setFormData({ ...formData, alcohol_consumption: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="moderate">Modéré</SelectItem>
                  <SelectItem value="heavy">Élevé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="physical_activity">Activité</Label>
              <Select
                value={formData.physical_activity}
                onValueChange={(value) => setFormData({ ...formData, physical_activity: value })}
              >
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tobacco_per_week">Tabac/semaine</Label>
              <Input
                id="tobacco_per_week"
                type="number"
                value={formData.tobacco_per_week || ""}
                onChange={(e) => setFormData({ ...formData, tobacco_per_week: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="Nombre/semaine"
              />
            </div>
            
            <div>
              <Label htmlFor="alcohol_units_per_week">Alcool/semaine</Label>
              <Input
                id="alcohol_units_per_week"
                type="number"
                value={formData.alcohol_units_per_week || ""}
                onChange={(e) => setFormData({ ...formData, alcohol_units_per_week: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="Unités/semaine"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dietary_regime">Régime alimentaire</Label>
              <Input
                id="dietary_regime"
                value={formData.dietary_regime}
                onChange={(e) => setFormData({ ...formData, dietary_regime: e.target.value })}
                placeholder="Ex: végétarien, sans gluten..."
              />
            </div>
            
            <div>
              <Label htmlFor="occupational_risks">Risques professionnels</Label>
              <Input
                id="occupational_risks"
                value={formData.occupational_risks}
                onChange={(e) => setFormData({ ...formData, occupational_risks: e.target.value })}
                placeholder="Ex: produits chimiques, bruit..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="assessment_date">Date d'évaluation</Label>
            <Input
              id="assessment_date"
              type="date"
              value={formData.assessment_date}
              onChange={(e) => setFormData({ ...formData, assessment_date: e.target.value })}
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
              {editingLifestyle ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
