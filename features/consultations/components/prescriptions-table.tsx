"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pill } from "lucide-react";
import { Prescription, RouteOfAdministration } from "@/features/consultations/types/consultations.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomSelect from "@/components/ui/custom-select";

interface PrescriptionsTableProps {
  prescriptions: Prescription[];
  onChange: (prescriptions: Prescription[]) => void;
  disabled?: boolean;
}

export function PrescriptionsTable({ prescriptions, onChange, disabled = false }: PrescriptionsTableProps) {
  const addPrescription = () => {
    const newPrescription: Prescription = {
      id: null,
      order_id: null,
      medication_name: "",
      dosage: "",
      frequency: "",
      duration_days: 1,
      route_of_administration: RouteOfAdministration.ORAL,
      special_instructions: ""
    };
    onChange([...prescriptions, newPrescription]);
  };

  const removePrescription = (index: number) => {
    const updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
    onChange(updatedPrescriptions);
  };

  const updatePrescription = <T extends keyof Prescription>(index: number, field: T, value: Prescription[T]) => {
    const updatedPrescriptions = prescriptions.map((prescription, i) =>
      i === index ? { ...prescription, [field]: value } : prescription
    );
    onChange(updatedPrescriptions);
  };

  const routeOptions = [
    { value: RouteOfAdministration.ORAL, label: "Orale" },
    { value: RouteOfAdministration.INTRAVENOUS, label: "Intraveineuse" },
    { value: RouteOfAdministration.SUBCUTANEOUS, label: "Sous-cutanée" },
    { value: RouteOfAdministration.TOPICAL, label: "Topique" },
    { value: RouteOfAdministration.INHALATION, label: "Inhalation" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5" />
          Prescriptions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Médicament</TableHead>
                <TableHead className="min-w-[120px]">Dosage</TableHead>
                <TableHead className="min-w-[120px]">Fréquence</TableHead>
                <TableHead className="w-[100px]">Durée (j)</TableHead>
                <TableHead className="min-w-[150px]">Voie</TableHead>
                <TableHead className="min-w-[200px]">Instructions</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    Aucune prescription ajoutée
                  </TableCell>
                </TableRow>
              ) : (
                prescriptions.map((prescription, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={prescription.medication_name}
                        onChange={(e) => updatePrescription(index, 'medication_name', e.target.value)}
                        placeholder="Nom du médicament"
                        disabled={disabled}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={prescription.dosage}
                        onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                        placeholder="Ex: 500mg"
                        disabled={disabled}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={prescription.frequency}
                        onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                        placeholder="Ex: 3x/jour"
                        disabled={disabled}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={prescription.duration_days}
                        onChange={(e) => updatePrescription(index, 'duration_days', parseInt(e.target.value) || 0)}
                        className="w-[80px]"
                        disabled={disabled}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={routeOptions}
                        value={prescription.route_of_administration}
                        onChange={(value) => updatePrescription(index, 'route_of_administration', value as RouteOfAdministration)}
                        isDisabled={disabled}
                        height="h-10"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={prescription.special_instructions || ""}
                        onChange={(e) => updatePrescription(index, 'special_instructions', e.target.value)}
                        placeholder="Instructions spéciales"
                        disabled={disabled}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePrescription(index)}
                        disabled={disabled}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPrescription}
            disabled={disabled}
            className="w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une ligne
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

