"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Pill } from "lucide-react";
import { Prescription } from "@/features/consultations/types/consultations.types";

interface PrescriptionsTableProps {
  prescriptions: Prescription[];
  onChange: (prescriptions: Prescription[]) => void;
  disabled?: boolean;
}

const medicationForms = [
  "Comprimé",
  "Gélule", 
  "Sirop",
  "Injection",
  "Pommade",
  "Gouttes",
  "Suppositoire",
  "Inhalateur",
  "Autre"
];

export function PrescriptionsTable({ prescriptions, onChange, disabled = false }: PrescriptionsTableProps) {
  const addPrescription = () => {
    const newPrescription: Prescription = {
      medication_name: "",
      dosage_instructions: "",
      form: "",
      strength: "",
      duration_days: 0,
      special_instructions: "",
      is_confidential: false,
      is_active: true
    };
    onChange([...prescriptions, newPrescription]);
  };

  const removePrescription = (index: number) => {
    const updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
    onChange(updatedPrescriptions);
  };

  const updatePrescription = (index: number, field: keyof Prescription, value: any) => {
    const updatedPrescriptions = prescriptions.map((prescription, i) => 
      i === index ? { ...prescription, [field]: value } : prescription
    );
    onChange(updatedPrescriptions);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Prescriptions médicales
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPrescription}
            disabled={disabled}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une prescription
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {prescriptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-gray-200 rounded-lg">
            <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune prescription ajoutée</p>
            <p className="text-sm">Cliquez sur "Ajouter une prescription" pour commencer</p>
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((prescription, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-sm text-gray-700">
                    Prescription #{index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePrescription(index)}
                    disabled={disabled}
                    className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Nom du médicament */}
                  <div className="space-y-2">
                    <Label htmlFor={`medication_name_${index}`}>
                      Nom du médicament <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`medication_name_${index}`}
                      value={prescription.medication_name}
                      onChange={(e) => updatePrescription(index, 'medication_name', e.target.value)}
                      placeholder="Ex: Paracétamol"
                      disabled={disabled}
                      className="h-10"
                    />
                  </div>

                  {/* Forme */}
                  <div className="space-y-2">
                    <Label htmlFor={`form_${index}`}>Forme</Label>
                    <Select
                      value={prescription.form}
                      onValueChange={(value) => updatePrescription(index, 'form', value)}
                      disabled={disabled}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Sélectionner une forme" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicationForms.map((form) => (
                          <SelectItem key={form} value={form}>
                            {form}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Force */}
                  <div className="space-y-2">
                    <Label htmlFor={`strength_${index}`}>Force/Dosage</Label>
                    <Input
                      id={`strength_${index}`}
                      value={prescription.strength || ""}
                      onChange={(e) => updatePrescription(index, 'strength', e.target.value)}
                      placeholder="Ex: 500mg"
                      disabled={disabled}
                      className="h-10"
                    />
                  </div>

                  {/* Instructions de dosage */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`dosage_instructions_${index}`}>
                      Instructions de dosage <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`dosage_instructions_${index}`}
                      value={prescription.dosage_instructions}
                      onChange={(e) => updatePrescription(index, 'dosage_instructions', e.target.value)}
                      placeholder="Ex: 1 comprimé 3 fois par jour après les repas"
                      disabled={disabled}
                      className="h-10"
                    />
                  </div>

                  {/* Durée */}
                  <div className="space-y-2">
                    <Label htmlFor={`duration_days_${index}`}>Durée (jours)</Label>
                    <Input
                      id={`duration_days_${index}`}
                      type="number"
                      value={prescription.duration_days || ""}
                      onChange={(e) => updatePrescription(index, 'duration_days', parseInt(e.target.value) || 0)}
                      placeholder="Ex: 7"
                      disabled={disabled}
                      className="h-10"
                    />
                  </div>

                  {/* Instructions spéciales */}
                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor={`special_instructions_${index}`}>Instructions spéciales</Label>
                    <Textarea
                      id={`special_instructions_${index}`}
                      value={prescription.special_instructions || ""}
                      onChange={(e) => updatePrescription(index, 'special_instructions', e.target.value)}
                      placeholder="Instructions particulières, précautions, etc."
                      rows={2}
                      disabled={disabled}
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-2 md:col-span-3">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`is_active_${index}`}
                          checked={prescription.is_active}
                          onCheckedChange={(checked: boolean) => updatePrescription(index, 'is_active', checked)}
                          disabled={disabled}
                        />
                        <Label htmlFor={`is_active_${index}`} className="text-sm">
                          Prescription active
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`is_confidential_${index}`}
                          checked={prescription.is_confidential}
                          onCheckedChange={(checked: boolean) => updatePrescription(index, 'is_confidential', checked)}
                          disabled={disabled}
                        />
                        <Label htmlFor={`is_confidential_${index}`} className="text-sm">
                          Prescription confidentielle
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
