'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from "lucide-react";
import { PatientInsurance, CreatePatientInsuranceRequest } from "../types/patient-insurance.types";
import { useUpdatePatientInsurance } from "../hooks/use-patient-insurances";
import { usePatients } from "@/features/patients/hooks/use-patients";
import { useInsuranceCompanies } from "@/features/insurance-companies/hooks/use-insurance-companies";
import { Modal } from "@/components/ui/modal";
import CustomSelect from "@/components/ui/custom-select";
import { toast } from "sonner";

interface EditPatientInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientInsurance: PatientInsurance;
  onUpdate: () => void;
}

export function EditPatientInsuranceModal({ isOpen, onClose, patientInsurance, onUpdate }: EditPatientInsuranceModalProps) {
  const { mutateAsync: updateInsurance, isPending: loading } = useUpdatePatientInsurance();

  // Queries for options
  const { data: patientsData, isLoading: loadingPatients } = usePatients({ limit: 50 });
  const { data: insurancesData, isLoading: loadingInsurances } = useInsuranceCompanies({
    limit: 50,
    is_active: true
  });

  const [formData, setFormData] = useState<CreatePatientInsuranceRequest>({
    patient_id: '',
    insurance_id: '',
    policy_number: '',
    priority: 1,
    is_active: true
  });

  const loadingData = loadingPatients || loadingInsurances;

  useEffect(() => {
    if (patientInsurance) {
      setFormData({
        patient_id: patientInsurance.patient_id,
        insurance_id: patientInsurance.insurance_id,
        policy_number: patientInsurance.policy_number,
        priority: patientInsurance.priority,
        is_active: patientInsurance.is_active
      });
    }
  }, [patientInsurance]);

  // Transformer les données pour le CustomSelect
  const patientOptions = (patientsData?.data || []).map(patient => ({
    value: patient.id_,
    label: `${patient.given_name} ${patient.family_name}`
  }));

  const insuranceOptions = (insurancesData?.data || []).map(insurance => ({
    value: insurance.id_,
    label: insurance.name
  }));

  const handleInputChange = (field: keyof CreatePatientInsuranceRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patient_id || !formData.insurance_id || !formData.policy_number.trim()) {
      toast.error('Le patient, l\'assurance et le numéro de police sont obligatoires');
      return;
    }

    try {
      await updateInsurance({ id: patientInsurance.id_, data: formData });
      onUpdate();
      onClose();
    } catch (err: any) {
      // Handled by hook
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier l'assurance patient" size="md">
      {loadingData ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Chargement des données...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Patient Selection - Read-only */}
          <div className="space-y-2">
            <Label htmlFor="patient_id">Patient *</Label>
            <CustomSelect
              options={patientOptions}
              value={formData.patient_id}
              onChange={(value) => handleInputChange('patient_id', value)}
              placeholder="Sélectionner un patient"
              isDisabled={true}  // Toujours désactivé en édition
              className="w-full"
            />
            <p className="text-xs text-gray-500">Le patient ne peut pas être modifié</p>
          </div>

          {/* Insurance Selection - Read-only */}
          <div className="space-y-2">
            <Label htmlFor="insurance_id">Assurance *</Label>
            <CustomSelect
              options={insuranceOptions}
              value={formData.insurance_id}
              onChange={(value) => handleInputChange('insurance_id', value)}
              placeholder="Sélectionner une assurance"
              isDisabled={true}  // Toujours désactivé en édition
              className="w-full"
            />
            <p className="text-xs text-gray-500">L'assurance ne peut pas être modifiée</p>
          </div>

          {/* Policy Number */}
          <div className="space-y-2">
            <Label htmlFor="policy_number">Numéro de police *</Label>
            <Input
              id="policy_number"
              value={formData.policy_number}
              onChange={(e) => handleInputChange('policy_number', e.target.value)}
              placeholder="Entrez le numéro de police"
              required
              disabled={loading}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <Input
              id="priority"
              type="number"
              min="1"
              max="10"
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
              placeholder="Priorité (1-10)"
              disabled={loading}
            />
          </div>

          {/* Is Active */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              disabled={loading}
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
