'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from "lucide-react";
import { PatientInsurance } from "../types/patient-insurance.types";
import { useUpdatePatientInsurance } from "../hooks/use-patient-insurances";
import { useInsuranceCompanies } from "@/features/insurance-companies/hooks/use-insurance-companies";
import { Modal } from "@/components/ui/modal";
import CustomSelect from "@/components/ui/custom-select";
import { PatientSelect } from "@/features/patients/components/patient-select";
import { toast } from "sonner";

const editInsuranceSchema = z.object({
  patient_id: z.string().min(1, 'Patient requis'),
  insurance_id: z.string().min(1, 'Assurance requise'),
  policy_number: z.string().min(1, 'Le numéro de police est requis'),
  priority: z.number().min(1).max(10),
  is_active: z.boolean(),
});

type EditInsuranceFormValues = z.infer<typeof editInsuranceSchema>;

interface EditPatientInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientInsurance: PatientInsurance;
  onUpdate: () => void;
}

export function EditPatientInsuranceModal({ isOpen, onClose, patientInsurance, onUpdate }: EditPatientInsuranceModalProps) {
  const { mutateAsync: updateInsurance, isPending: loading } = useUpdatePatientInsurance();

  const { data: insurancesData, isLoading: loadingInsurances } = useInsuranceCompanies({
    limit: 100,
    is_active: true
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditInsuranceFormValues>({
    resolver: zodResolver(editInsuranceSchema),
    defaultValues: {
      patient_id: '',
      insurance_id: '',
      policy_number: '',
      priority: 1,
      is_active: true
    },
  });

  useEffect(() => {
    if (patientInsurance && isOpen) {
      reset({
        patient_id: patientInsurance.patient_id,
        insurance_id: patientInsurance.insurance_id,
        policy_number: patientInsurance.policy_number,
        priority: patientInsurance.priority,
        is_active: patientInsurance.is_active
      });
    }
  }, [patientInsurance, isOpen, reset]);

  const insuranceOptions = (insurancesData?.data || []).map(insurance => ({
    value: insurance.id_,
    label: insurance.name
  }));

  const onSubmit = async (data: EditInsuranceFormValues) => {
    try {
      await updateInsurance({ id: patientInsurance.id_, data });
      onUpdate();
      onClose();
    } catch (err: any) {
      // Handled by hook
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier l'assurance patient" size="md">
      {loadingInsurances ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Chargement des données...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Patient Selection - Read-only */}
          <div className="space-y-2">
            <Label htmlFor="patient_id">Patient <span className="text-red-500">*</span></Label>
            <Controller
              control={control}
              name="patient_id"
              render={({ field }) => (
                <PatientSelect
                  value={field.value}
                  onChange={field.onChange}
                  disabled={true}
                  required={true}
                />
              )}
            />
            <p className="text-xs text-gray-500">Le patient ne peut pas être modifié</p>
          </div>

          {/* Insurance Selection - Read-only */}
          <div className="space-y-2">
            <Label htmlFor="insurance_id">Assurance <span className="text-red-500">*</span></Label>
            <Controller
              control={control}
              name="insurance_id"
              render={({ field }) => (
                <CustomSelect
                  options={insuranceOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Sélectionner une assurance"
                  isDisabled={true}
                  className="w-full"
                />
              )}
            />
            <p className="text-xs text-gray-500">L'assurance ne peut pas être modifiée</p>
          </div>

          {/* Policy Number */}
          <div className="space-y-2">
            <Label htmlFor="policy_number">Numéro de police <span className="text-red-500">*</span></Label>
            <Input
              id="policy_number"
              {...register('policy_number')}
              placeholder="Entrez le numéro de police"
              disabled={loading}
              className={errors.policy_number ? "border-red-500" : ""}
            />
            {errors.policy_number && <p className="text-sm text-red-500">{errors.policy_number.message}</p>}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <Input
              id="priority"
              type="number"
              min="1"
              max="10"
              {...register('priority', { valueAsNumber: true })}
              placeholder="Priorité (1-10)"
              disabled={loading}
              className={errors.priority ? "border-red-500" : ""}
            />
            {errors.priority && <p className="text-sm text-red-500">{errors.priority.message}</p>}
          </div>

          {/* Is Active */}
          <div className="flex items-center space-x-2">
            <Controller
              control={control}
              name="is_active"
              render={({ field }) => (
                <Checkbox
                  id="is_active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={loading}
                />
              )}
            />
            <Label htmlFor="is_active">Actif</Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mise à jour...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Mettre à jour
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
