'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from "lucide-react";
import { CreatePatientInsuranceRequest } from "../types/patient-insurance.types";
import { useCreatePatientInsurance } from "../hooks/use-patient-insurances";
import { usePatients } from "@/features/patients/hooks/use-patients";
import { useInsuranceCompanies } from "@/features/insurance-companies/hooks/use-insurance-companies";
import { Modal } from "@/components/ui/modal";
import CustomSelect from "@/components/ui/custom-select";
import { toast } from "sonner";

interface CreatePatientInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patientId?: string;
}

export function CreatePatientInsuranceModal({ isOpen, onClose, onSuccess, patientId }: CreatePatientInsuranceModalProps) {
  const { mutateAsync: createInsurance, isPending: loading } = useCreatePatientInsurance();

  // Queries
  const { data: patientsData, isLoading: loadingPatients } = usePatients({ limit: 50 });
  const { data: insurancesData, isLoading: loadingInsurances } = useInsuranceCompanies({
    limit: 50,
    is_active: true
  });

  const [formData, setFormData] = useState<CreatePatientInsuranceRequest>({
    patient_id: patientId || '',
    insurance_id: '',
    policy_number: '',
    priority: 1,
    is_active: true
  });

  useEffect(() => {
    if (patientId) {
      setFormData(prev => ({ ...prev, patient_id: patientId }));
    }
  }, [patientId]);

  const loadingData = loadingPatients || loadingInsurances;

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

    if (!formData.patient_id || !formData.insurance_id || !formData.policy_number) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await createInsurance(formData);

      // Fermer le modal et appeler onSuccess
      onSuccess();
      onClose();

      // Reset form
      setFormData({
        patient_id: patientId || '',
        insurance_id: '',
        policy_number: '',
        priority: 1,
        is_active: true
      });
    } catch (err: any) {
      // Handled by hook
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une assurance patient" size="md">
      {loadingData ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Chargement des données...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Patient Selection */}
          {!patientId && (
            <div className="space-y-2">
              <Label htmlFor="patient_id">Patient *</Label>
              <CustomSelect
                options={patientOptions}
                value={formData.patient_id}
                onChange={(value) => handleInputChange('patient_id', value)}
                placeholder="Sélectionner un patient"
                isDisabled={loading}
                className="w-full"
              />
            </div>
          )}

          {/* Insurance Selection */}
          <div className="space-y-2">
            <Label htmlFor="insurance_id">Assurance *</Label>
            <CustomSelect
              options={insuranceOptions}
              value={formData.insurance_id}
              onChange={(value) => handleInputChange('insurance_id', value)}
              placeholder="Sélectionner une assurance"
              isDisabled={loading}
              className="w-full"
            />
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
                  Création...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Créer
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
