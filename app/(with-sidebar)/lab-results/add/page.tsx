'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Calendar, Building, FileText } from "lucide-react";
import { LabResultsService } from "@/features/lab-results/services/lab-results.service";
import { CreateLabResultRequest, TestType, HospitalStaff, Patient, HealthFacility } from "@/features/lab-results/types/lab-results.types";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import Link from "next/link";
import CustomSelect from '@/components/ui/custom-select';
import { FetchService } from "@/features/core/services/fetch.service";

export default function AddLabResultPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuthRefresh();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateLabResultRequest>({
    patient_id: '',
    performer_id: '',
    test_type: TestType.BLOOD_COUNT,
    date_performed: new Date().toISOString().split('T')[0],
    date_reported: new Date().toISOString().split('T')[0],
    issuing_facility: '',
    document_id: '',
    extracted_values: null,
    is_active: true
  });

  const [hospitalStaff, setHospitalStaff] = useState<HospitalStaff[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [healthFacilities, setHealthFacilities] = useState<HealthFacility[]>([]);
  const [facilitiesLoading, setFacilitiesLoading] = useState(false);

  const fetchHospitalStaff = async () => {
    if (!formData.issuing_facility) {
      setHospitalStaff([]);
      return;
    }
    
    await FetchService.fetchData(
      `hospital-staff?health_facility_id=${formData.issuing_facility}`,
      setHospitalStaff,
      setStaffLoading,
      'Hospital staff'
    );
  };

  const fetchPatients = async () => {
    await FetchService.fetchData(
      'patients',
      setPatients,
      setPatientsLoading,
      'Patients'
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
    fetchPatients();
    fetchHealthFacilities();
  }, []);

  useEffect(() => {
    fetchHospitalStaff();
    // Réinitialiser le performer_id quand l'établissement change
    setFormData(prev => ({ ...prev, performer_id: '' }));
  }, [formData.issuing_facility]);

  const testTypeOptions = Object.values(TestType);

  const getTestTypeLabel = (testType: TestType) => {
    const labels: Record<TestType, string> = {
      [TestType.BLOOD_COUNT]: 'Numération sanguine',
      [TestType.CHEMISTRY]: 'Chimie',
      [TestType.HEMATOLOGY]: 'Hématologie',
      [TestType.MICROBIOLOGY]: 'Microbiologie',
      [TestType.PATHOLOGY]: 'Pathologie',
      [TestType.IMMUNOLOGY]: 'Immunologie',
      [TestType.GENETICS]: 'Génétique',
      [TestType.TOXICOLOGY]: 'Toxicologie',
      [TestType.ENDOCRINOLOGY]: 'Endocrinologie',
      [TestType.CARDIOLOGY]: 'Cardiologie',
      [TestType.URINALYSIS]: 'Analyse d\'urine',
      [TestType.STOOL_ANALYSIS]: 'Analyse de selles',
      [TestType.IMAGING]: 'Imagerie',
      [TestType.OTHER]: 'Autre'
    };
    return labels[testType] || testType;
  };

  const handleInputChange = (field: keyof CreateLabResultRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert dates to ISO format
      const submitData: CreateLabResultRequest = {
        ...formData,
        date_performed: new Date(formData.date_performed).toISOString(),
        date_reported: new Date(formData.date_reported).toISOString(),
        extracted_values: formData.extracted_values ? JSON.parse(formData.extracted_values as string) : null
      };

      await LabResultsService.createLabResult(submitData);
      router.push('/lab-results');
    } catch (err: any) {
      setError(err.message || 'Failed to create lab result');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="p-4 border border-destructive rounded-lg text-destructive">
                {error}
              </div>
            )}

            {/* Patient ID */}
            <div className="space-y-2">
              <Label htmlFor="patient_id" className="flex items-center gap-1">
                Patient <span className="text-red-500">*</span>
              </Label>
              <CustomSelect
                options={Array.isArray(patients) ? patients.map((patient) => ({
                  value: patient.id_,
                  label: `${patient.given_name} ${patient.family_name}`
                })) : []}
                value={formData.patient_id}
                onChange={(value) => handleInputChange('patient_id', value)}
                placeholder="Sélectionner le patient..."
                isDisabled={patientsLoading}
                isLoading={patientsLoading}
                height="h-10"
              />
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
                  value={formData.issuing_facility}
                  onChange={(value) => handleInputChange('issuing_facility', value)}
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
                  value={formData.performer_id}
                  onChange={(value) => handleInputChange('performer_id', value)}
                  placeholder="Sélectionner le personnel..."
                  isDisabled={staffLoading || !formData.issuing_facility}
                  isLoading={staffLoading}
                  height="h-10"
                />
                {!formData.issuing_facility && (
                  <p className="text-sm text-muted-foreground">Veuillez d'abord sélectionner un établissement</p>
                )}
              </div>
            </div>

            {/* Test Type */}
            <div className="space-y-2">
              <Label htmlFor="test_type" className="flex items-center gap-1">
                Type de test <span className="text-red-500">*</span>
              </Label>
              <CustomSelect
                options={testTypeOptions.map((type) => ({
                  value: type,
                  label: getTestTypeLabel(type)
                }))}
                value={formData.test_type}
                onChange={(value) => handleInputChange('test_type', value)}
                placeholder="Sélectionner le type de test..."
                height="h-10"
              />
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
                  value={formData.date_performed}
                  onChange={(e) => handleInputChange('date_performed', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_reported" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date du rapport <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date_reported"
                  type="date"
                  value={formData.date_reported}
                  onChange={(e) => handleInputChange('date_reported', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Document ID */}
            <div className="space-y-2">
              <Label htmlFor="document_id">ID Document</Label>
              <Input
                id="document_id"
                type="text"
                placeholder="ID du document (optionnel)"
                value={formData.document_id || ''}
                onChange={(e) => handleInputChange('document_id', e.target.value)}
              />
            </div>

            {/* Extracted Values */}
            <div className="space-y-2">
              <Label htmlFor="extracted_values">Valeurs extraites (JSON)</Label>
              <Textarea
                id="extracted_values"
                placeholder='{"key": "value", "result": 123.45}'
                value={formData.extracted_values ? JSON.stringify(formData.extracted_values as unknown, null, 2) : ''}
                onChange={(e) => {
                  try {
                    const jsonValue = e.target.value ? JSON.parse(e.target.value) : null;
                    handleInputChange('extracted_values', jsonValue);
                  } catch {
                    // Keep the raw text for editing
                    handleInputChange('extracted_values', e.target.value as any);
                  }
                }}
                rows={6}
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">
                Format JSON. Exemple: {`{"hemoglobin": 14.5, "platelets": 250000}`}
              </p>
            </div>

            {/* Is Active */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
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
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
