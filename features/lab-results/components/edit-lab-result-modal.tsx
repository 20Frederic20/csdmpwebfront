'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Save } from "lucide-react";
import { LabResult, TestType } from "../types/lab-results.types";
import { Modal } from "@/components/ui/modal";
import { PatientSelect } from "@/features/patients/components/patient-select";
import { labResultSchema, LabResultFormValues } from "../schemas/lab-results.schema";
import { useUpdateLabResult } from "../hooks/use-lab-results";
import { getTestTypeOptions } from "../utils/lab-results.utils";
import { usePermissionsContext } from "@/contexts/permissions-context";
import { DynamicTestFields } from "./DynamicTestFields";
import { useExamParameters } from '../hooks/use-lab-exam-definitions';
import { HealthFacilitySelect } from "@/features/health-facilities/components/health-facility-select";
import { HospitalStaffSelect } from "@/features/hospital-staff/components/hospital-staff-select";

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
      // Pré-traitement des valeurs extraites : décoder les strings JSON si nécessaire
      const processedExtractedValues: Record<string, any> = {};
      if (labResult.extracted_values) {
        Object.entries(labResult.extracted_values).forEach(([key, val]) => {
          if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
            try {
              processedExtractedValues[key] = JSON.parse(val);
            } catch {
              processedExtractedValues[key] = val;
            }
          } else {
            processedExtractedValues[key] = val;
          }
        });
      }

      reset({
        patient_id: labResult.patient_id,
        performer_id: labResult.performer_id || user?.hospital_staff_id || '',
        test_type: labResult.test_type,
        date_performed: labResult.date_performed.split('T')[0],
        date_reported: labResult.date_reported.split('T')[0],
        issuing_facility: labResult.issuing_facility || user?.health_facility_id || '',
        document_id: labResult.document_id || '',
        extracted_values: processedExtractedValues,
        is_active: labResult.is_active
      });
    }
  }, [labResult, reset, user]);

  const patientId = watch('patient_id');
  const isActive = watch('is_active');
  const testType = watch('test_type');
  const issuingFacility = watch('issuing_facility');

  // 1. Fetch exam parameters and patient-specific norms
  const { data: examParams, isLoading: isLoadingFields } = useExamParameters(
    testType,
    issuingFacility || undefined,
    patientId || undefined
  );

  const parameters = examParams?.parameters ?? [];

  // Gérer le changement de type de test (réinitialiser les champs dynamiques)
  useEffect(() => {
    // Ne pas réinitialiser lors du premier chargement ou si c'est le type initial du labResult
    if (labResult && testType === labResult.test_type && issuingFacility === (labResult.issuing_facility || '')) {
      return; 
    }
    
    if (!isLoadingFields && parameters.length > 0) {
      const newExtractedValues: Record<string, any> = {};
      parameters.forEach((param) => {
        newExtractedValues[param.parameter_code] = {
          value: null,
          min_ref: param.min_value,
          max_ref: param.max_value,
        };
      });
      setValue('extracted_values', newExtractedValues);
    }
  }, [testType, issuingFacility, isLoadingFields, parameters, setValue, labResult]);

  const onSubmit = async (data: LabResultFormValues) => {
    try {
      // Post-traitement des valeurs : matcher la logique du "add"
      const processedExtractedValues: Record<string, any> = {};
      if (data.extracted_values) {
        Object.entries(data.extracted_values).forEach(([key, val]) => {
          if (typeof val === 'object' && val !== null) {
            processedExtractedValues[key] = JSON.stringify(val);
          } else if (val !== undefined && val !== null) {
            processedExtractedValues[key] = String(val);
          }
        });
      }

      const result = await updateMutation.mutateAsync({
        id: labResult.id_,
        data: {
          ...data,
          extracted_values: processedExtractedValues
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
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le résultat de laboratoire" size="xl">
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

          {/* Performer Selection */}
          <div className="space-y-2">
            <HospitalStaffSelect
              value={watch('performer_id')}
              onChange={(value) => setValue('performer_id', value || '', { shouldValidate: true })}
              healthFacilityId={issuingFacility}
              required
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

          {/* Issuing Facility Selection */}
          <div className="space-y-2">
            <HealthFacilitySelect
              value={issuingFacility || ''}
              onChange={(value) => setValue('issuing_facility', value || '')}
              required
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

        {/* Extracted Values (Dynamic) */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Valeurs de l'examen</Label>
          <DynamicTestFields 
            parameters={parameters} 
            register={register} 
            isLoading={isLoadingFields}
          />
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
            className="bg-slate-900 hover:bg-slate-800 text-white"
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
