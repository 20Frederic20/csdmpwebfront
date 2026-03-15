'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Save } from "lucide-react";
import { LabResult, TestType } from "../types/lab-results.types";
import { Modal } from "@/components/ui/modal";
import { PatientSelect } from "@/features/patients/components/patient-select";
import { labResultSchema, LabResultFormValues } from "../schemas/lab-results.schema";
import { useUpdateLabResult } from "../hooks/use-lab-results";
import { getTestTypeOptions } from "../utils/lab-results.utils";
import { usePermissionsContext } from "@/contexts/permissions-context";

interface EditLabResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  labResult: LabResult;
  onUpdate?: (updatedLabResult: LabResult) => void;
}

export function EditLabResultModal({ isOpen, onClose, labResult, onUpdate }: EditLabResultModalProps) {
  const updateMutation = useUpdateLabResult();
  const { user } = usePermissionsContext();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<LabResultFormValues>({
    resolver: zodResolver(labResultSchema),
    defaultValues: {
      patient_id: '',
      performer_id: '',
      test_type: TestType.BLOOD_COUNT,
      date_performed: '',
      date_reported: '',
      issuing_facility: '',
      document_id: '',
      extracted_values: null,
      is_active: true
    }
  });

  useEffect(() => {
    if (labResult) {
      reset({
        patient_id: labResult.patient_id,
        performer_id: labResult.performer_id || user?.hospital_staff_id || '',
        test_type: labResult.test_type,
        date_performed: labResult.date_performed.split('T')[0],
        date_reported: labResult.date_reported.split('T')[0],
        issuing_facility: labResult.issuing_facility || user?.health_facility_id || '',
        document_id: labResult.document_id || '',
        extracted_values: labResult.extracted_values,
        is_active: labResult.is_active
      });
    }
  }, [labResult, reset, user]);

  const patientId = watch('patient_id');
  const isActive = watch('is_active');
  const testType = watch('test_type');

  const onSubmit = async (data: LabResultFormValues) => {
    try {
      let extractedValues = data.extracted_values;
      if (typeof extractedValues === 'string') {
        try {
          extractedValues = JSON.parse(extractedValues);
        } catch {
          // Validation should already handled this
        }
      }

      const result = await updateMutation.mutateAsync({
        id: labResult.id_,
        data: {
          ...data,
          extracted_values: extractedValues
        }
      });
      
      if (onUpdate) onUpdate(result);
      onClose();
    } catch (err) {
      console.error('Failed to update lab result:', err);
    }
  };

  const testTypeOptions = getTestTypeOptions();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le résultat de laboratoire" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient Selection */}
          <div className="space-y-2">
            <PatientSelect
              value={patientId}
              onChange={(value) => setValue('patient_id', value || '', { shouldValidate: true })}
              required
            />
            {errors.patient_id && (
              <p className="text-sm text-red-500">{errors.patient_id.message}</p>
            )}
          </div>

          {/* Performer ID (In a real app, this might also be a searchable select) */}
          <div className="space-y-2">
            <Label htmlFor="performer_id" className="flex items-center gap-1">
              Performer <span className="text-red-500">*</span>
            </Label>
            <Input
              id="performer_id"
              {...register('performer_id')}
              placeholder="UUID du performer"
            />
            {errors.performer_id && (
              <p className="text-sm text-red-500">{errors.performer_id.message}</p>
            )}
          </div>

          {/* Test Type */}
          <div className="space-y-2">
            <Label htmlFor="test_type" className="flex items-center gap-1">
              Type de test <span className="text-red-500">*</span>
            </Label>
            <select
              id="test_type"
              {...register('test_type')}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {testTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.test_type && (
              <p className="text-sm text-red-500">{errors.test_type.message}</p>
            )}
          </div>

          {/* Issuing Facility */}
          <div className="space-y-2">
            <Label htmlFor="issuing_facility">Établissement émetteur</Label>
            <Input
              id="issuing_facility"
              {...register('issuing_facility')}
              placeholder="Établissement émetteur"
            />
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <Label htmlFor="date_performed" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date du test <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date_performed"
              type="date"
              {...register('date_performed')}
            />
            {errors.date_performed && (
              <p className="text-sm text-red-500">{errors.date_performed.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_reported" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date du rapport <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date_reported"
              type="date"
              {...register('date_reported')}
            />
            {errors.date_reported && (
              <p className="text-sm text-red-500">{errors.date_reported.message}</p>
            )}
          </div>
        </div>

        {/* Document ID */}
        <div className="space-y-2">
          <Label htmlFor="document_id">ID Document</Label>
          <Input
            id="document_id"
            {...register('document_id')}
            placeholder="ID du document (optionnel)"
          />
        </div>

        {/* Extracted Values */}
        <div className="space-y-2">
          <Label htmlFor="extracted_values">Valeurs extraites (JSON)</Label>
          <Textarea
            id="extracted_values"
            placeholder='{"key": "value", "result": 123.45}'
            {...register('extracted_values', {
                setValueAs: (v) => v === "" ? null : v
            })}
            defaultValue={labResult.extracted_values ? JSON.stringify(labResult.extracted_values, null, 2) : ''}
            rows={4}
          />
          {errors.extracted_values && (
            <p className="text-sm text-red-500">{errors.extracted_values.message as string}</p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={isActive}
            onCheckedChange={(checked) => setValue('is_active', !!checked)}
          />
          <Label htmlFor="is_active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Résultat actif
          </Label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {updateMutation.isPending ? (
              'Mise à jour en cours...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Mettre à jour
              </>
            )}
          </Button>
          <Button variant="outline" type="button" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </form>
    </Modal>
  );
}
