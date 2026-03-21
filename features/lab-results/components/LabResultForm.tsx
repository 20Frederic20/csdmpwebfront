'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Save, ArrowLeft } from "lucide-react";
import { LabResult, TestType } from "../types/lab-results.types";
import { PatientSelect } from "@/features/patients/components/patient-select";
import { labResultSchema, LabResultFormValues } from "../schemas/lab-results.schema";
import { getTestTypeOptions } from "../utils/lab-results.utils";
import { usePermissionsContext } from "@/contexts/permissions-context";
import { DynamicTestFields } from "./DynamicTestFields";
import { TEST_FIELDS_CONFIG } from "../config/test-fields.config";
import { HealthFacilitySelect } from "@/features/health-facilities/components/health-facility-select";
import { HospitalStaffSelect } from "@/features/hospital-staff/components/hospital-staff-select";
import Link from 'next/link';

interface LabResultFormProps {
  initialData?: LabResult;
  onSubmit: (data: LabResultFormValues) => Promise<void>;
  isSubmitting?: boolean;
  title: string;
}

export function LabResultForm({ initialData, onSubmit, isSubmitting, title }: LabResultFormProps) {
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
      date_performed: new Date().toISOString().split('T')[0],
      date_reported: new Date().toISOString().split('T')[0],
      issuing_facility: '',
      document_id: '',
      extracted_values: null,
      is_active: true
    }
  });

  useEffect(() => {
    if (initialData) {
      // Pré-traitement des valeurs extraites : décoder les strings JSON si nécessaire
      const processedExtractedValues: Record<string, any> = {};
      if (initialData.extracted_values) {
        Object.entries(initialData.extracted_values).forEach(([key, val]) => {
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
        patient_id: initialData.patient_id,
        performer_id: initialData.performer_id || user?.hospital_staff_id || '',
        test_type: initialData.test_type,
        date_performed: initialData.date_performed.split('T')[0],
        date_reported: initialData.date_reported.split('T')[0],
        issuing_facility: initialData.issuing_facility || user?.health_facility_id || '',
        document_id: initialData.document_id || '',
        extracted_values: processedExtractedValues,
        is_active: initialData.is_active
      });
    } else if (user) {
      // Pour une nouvelle insertion, pré-remplir avec les infos de l'utilisateur
      if (user.health_facility_id) {
        setValue('issuing_facility', user.health_facility_id);
      }
      if (user.hospital_staff_id) {
        setValue('performer_id', user.hospital_staff_id);
      }
    }
  }, [initialData, reset, user, setValue]);

  const patientId = watch('patient_id');
  const isActive = watch('is_active');
  const testType = watch('test_type');
  const issuingFacility = watch('issuing_facility');
  const performerId = watch('performer_id');

  // Gérer le changement de type de test (réinitialiser les champs dynamiques)
  useEffect(() => {
    // Ne pas réinitialiser lors du premier chargement ou si c'est le type initial du labResult
    if (initialData && testType === initialData.test_type) return;

    const fields = TEST_FIELDS_CONFIG[testType] || [];
    const newExtractedValues: any = {};
    fields.forEach((f: any) => {
      if (f.type === 'number') {
        newExtractedValues[f.name] = { 
          value: null, 
          min_ref: f.defaultMin !== undefined ? f.defaultMin : null, 
          max_ref: f.defaultMax !== undefined ? f.defaultMax : null 
        };
      } else {
        newExtractedValues[f.name] = '';
      }
    });
    setValue('extracted_values', newExtractedValues);
  }, [testType, setValue, initialData]);

  const testTypeOptions = getTestTypeOptions();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/lab-results">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Issuing Facility Selection */}
          <div className="space-y-2">
            <HealthFacilitySelect
              value={issuingFacility || ''}
              onChange={(value) => {
                setValue('issuing_facility', value || '');
                // Reset performer if facility changes and is not the same as user's
                if (value !== user?.health_facility_id) {
                    setValue('performer_id', '');
                }
              }}
              required
            />
            {errors.issuing_facility && (
              <p className="text-sm text-red-500">{errors.issuing_facility.message}</p>
            )}
          </div>

          {/* Performer Selection */}
          <div className="space-y-2">
            <HospitalStaffSelect
              value={performerId}
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
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
            testType={testType} 
            register={register} 
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
        <div className="flex items-center gap-4 pt-6 border-t">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? (
              'Enregistrement...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
          <Link href="/lab-results">
            <Button variant="outline" type="button">
              Annuler
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
