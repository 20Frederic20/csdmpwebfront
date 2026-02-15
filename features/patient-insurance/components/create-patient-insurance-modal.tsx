'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from "lucide-react";
import { CreatePatientInsuranceRequest } from "../types/patient-insurance.types";
import { PatientInsuranceService } from "../services/patient-insurance.service";
import { PatientService } from "@/features/patients/services/patients.service";
import { InsuranceCompaniesService } from "@/features/insurance-companies/services/insurance-companies.service";
import { Modal } from "@/components/ui/modal";
import CustomSelect from "@/components/ui/custom-select";
import { toast } from "sonner";

interface CreatePatientInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPatientInsurance: any) => void;
  patientId?: string;
}

export function CreatePatientInsuranceModal({ isOpen, onClose, onSuccess, patientId }: CreatePatientInsuranceModalProps) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);
  const [formData, setFormData] = useState<CreatePatientInsuranceRequest>({
    patient_id: patientId || '',
    insurance_id: '',
    policy_number: '',
    priority: 1,
    is_active: true
  });

  // Charger les données quand le modal s'ouvre
  useEffect(() => {
    const loadData = async () => {
      if (!isOpen) return;
      
      setLoadingData(true);
      try {
        // Charger les patients (si pas de patientId prédéfini)
        if (!patientId) {
          const patientsResponse = await PatientService.getPatients({ limit: 50 });
          setPatients(patientsResponse.data);
        }
        
        // Charger les compagnies d'assurance
        const insurancesResponse = await InsuranceCompaniesService.getInsuranceCompanies({ 
          limit: 50,
          is_active: true 
        });
        setInsurances(insurancesResponse.data);
      } catch (err) {
        console.error('Failed to load options:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoadingData(false);
      }
    };
    
    loadData();
  }, [isOpen, patientId]);

  useEffect(() => {
    if (patientId) {
      setFormData(prev => ({ ...prev, patient_id: patientId }));
    }
  }, [patientId]);

  // Transformer les données pour le CustomSelect
  const patientOptions = patients.map(patient => ({
    value: patient.id_,
    label: `${patient.given_name} ${patient.family_name}`
  }));

  const insuranceOptions = insurances.map(insurance => ({
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
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Creating patient insurance:', formData);
      const response = await PatientInsuranceService.createPatientInsurance(formData);
      
      toast.success('Assurance patient créée avec succès');
      
      // Fermer le modal et appeler onSuccess avec les données créées
      onSuccess(response);
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
      console.error('Failed to create patient insurance:', err);
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
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
          {/* Error */}
          {error && (
            <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
              {error}
            </div>
          )}

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
