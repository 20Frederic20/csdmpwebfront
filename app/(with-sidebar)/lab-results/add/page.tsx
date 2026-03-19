'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Calendar, FileText } from "lucide-react";
import { TestType, HospitalStaff, HealthFacility } from "@/features/lab-results/types/lab-results.types";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import Link from "next/link";
import CustomSelect from '@/components/ui/custom-select';
import { FetchService } from "@/features/core/services/fetch.service";
import { PatientSelect } from "@/features/patients/components/patient-select";
import { labResultSchema, LabResultFormValues } from "@/features/lab-results/schemas/lab-results.schema";
import { useCreateLabResult } from "@/features/lab-results/hooks/use-lab-results";
import { getTestTypeOptions } from "@/features/lab-results/utils/lab-results.utils";
import { usePermissionsContext } from "@/contexts/permissions-context";
import { DynamicTestFields } from "@/features/lab-results/components/DynamicTestFields";
import { TEST_FIELDS_CONFIG } from "@/features/lab-results/config/test-fields.config";

export default function AddLabResultPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuthRefresh();
  const { user } = usePermissionsContext();
  const createMutation = useCreateLabResult();
  
  const [hospitalStaff, setHospitalStaff] = useState<HospitalStaff[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [healthFacilities, setHealthFacilities] = useState<HealthFacility[]>([]);
  const [facilitiesLoading, setFacilitiesLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const issuingFacility = watch('issuing_facility');
  const patientId = watch('patient_id');
  const testType = watch('test_type');
  const isActive = watch('is_active');

  const fetchHospitalStaff = async () => {
    if (!issuingFacility) {
      setHospitalStaff([]);
      return;
    }
    
    await FetchService.fetchData(
      `hospital-staff?health_facility_id=${issuingFacility}`,
      setHospitalStaff,
      setStaffLoading,
      'Hospital staff'
    );
  };

  const fetchHealthFacilities = async () => {
    await FetchService.fetchData(
      'health-facilities',
      setHealthFacilities,
      setFacilitiesLoading,
      'Health facilities'
    );
  };

  useEffect(() => {
    fetchHealthFacilities();
  }, []);

  // Auto-inject health facility and performer for new lab results
  useEffect(() => {
    if (user && !issuingFacility) {
      setValue('issuing_facility', user.health_facility_id || "");
      if (user.hospital_staff_id && !watch('performer_id')) {
        setValue('performer_id', user.hospital_staff_id, { shouldValidate: true });
      }
    }
  }, [user, issuingFacility, setValue, watch]);

  useEffect(() => {
    fetchHospitalStaff();
    // Only reset performer_id if it's not the same as user's staff id when facility changes
    if (issuingFacility !== user?.health_facility_id) {
       setValue('performer_id', '');
    }
  }, [issuingFacility, setValue, user?.health_facility_id]);

  useEffect(() => {
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
  }, [testType, setValue]);

  const onSubmit = async (data: LabResultFormValues) => {
    try {
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

      const submitData = {
        ...data,
        date_performed: new Date(data.date_performed).toISOString(),
        date_reported: new Date(data.date_reported).toISOString(),
        extracted_values: processedExtractedValues,
      };

      await createMutation.mutateAsync(submitData);
      router.push('/lab-results');
    } catch (err) {
      console.error('Failed to create lab result:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  const testTypeOptions = getTestTypeOptions();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/lab-results">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ajouter un résultat de laboratoire</h1>
          <p className="text-muted-foreground">
            Créez un nouveau résultat de laboratoire pour un patient
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informations du résultat
          </CardTitle>
          <CardDescription>
            Remplissez les informations du résultat de laboratoire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            {/* Issuing Facility and Performer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Issuing Facility */}
              <div className="space-y-2">
                <Label htmlFor="issuing_facility">Établissement émetteur</Label>
                <CustomSelect
                  options={Array.isArray(healthFacilities) ? healthFacilities.map((facility) => ({
                    value: facility.id_,
                    label: `${facility.code} - ${facility.name}`
                  })) : []}
                  value={issuingFacility || ''}
                  onChange={(value) => setValue('issuing_facility', value as string)}
                  placeholder="Sélectionner l'établissement..."
                  isDisabled={facilitiesLoading}
                  isLoading={facilitiesLoading}
                  height="h-10"
                />
              </div>

              {/* Performer (Hospital Staff) */}
              <div className="space-y-2">
                <Label htmlFor="performer_id" className="flex items-center gap-1">
                  Personnel qui a réalisé le test <span className="text-red-500">*</span>
                </Label>
                <CustomSelect
                  options={Array.isArray(hospitalStaff) ? hospitalStaff.map((staff) => ({
                    value: staff.id_,
                    label: `${staff.given_name} ${staff.family_name} - ${staff.matricule}`
                  })) : []}
                  value={watch('performer_id')}
                  onChange={(value) => setValue('performer_id', value as string, { shouldValidate: true })}
                  placeholder="Sélectionner le personnel..."
                  isDisabled={staffLoading || !issuingFacility}
                  isLoading={staffLoading}
                  height="h-10"
                />
                {!issuingFacility && (
                  <p className="text-sm text-muted-foreground">Veuillez d'abord sélectionner un établissement</p>
                )}
                {errors.performer_id && (
                  <p className="text-sm text-red-500">{errors.performer_id.message}</p>
                )}
              </div>
            </div>

            {/* Test Type */}
            <div className="space-y-2">
              <Label htmlFor="test_type" className="flex items-center gap-1">
                Type de test <span className="text-red-500">*</span>
              </Label>
              <CustomSelect
                options={testTypeOptions}
                value={testType}
                onChange={(value) => setValue('test_type', value as TestType)}
                placeholder="Sélectionner le type de test..."
                height="h-10"
              />
              {errors.test_type && (
                <p className="text-sm text-red-500">{errors.test_type.message}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Valeurs de l'examen</Label>
              <DynamicTestFields 
                testType={testType} 
                register={register} 
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={isActive}
                onChange={(e) => setValue('is_active', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="is_active">Résultat actif</Label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Link href="/lab-results">
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={createMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {createMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
