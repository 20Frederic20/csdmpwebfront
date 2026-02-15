'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { PatientInsurance } from "../types/patient-insurance.types";

interface ViewPatientInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientInsurance: PatientInsurance;
}

export function ViewPatientInsuranceModal({ isOpen, onClose, patientInsurance }: ViewPatientInsuranceModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails de l'assurance patient" size="md">
      <div className="space-y-6">
        {/* Patient Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Patient</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nom complet</p>
                <p className="font-medium">{patientInsurance.patient_full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ID Patient</p>
                <p className="font-medium text-sm">{patientInsurance.patient_id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Insurance Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Assurance</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Compagnie</p>
                <p className="font-medium">{patientInsurance.insurance_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ID Assurance</p>
                <p className="font-medium text-sm">{patientInsurance.insurance_id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Police d'assurance</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Numéro de police</p>
                <p className="font-medium">{patientInsurance.policy_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Priorité</p>
                <p className="font-medium">{patientInsurance.priority}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Statut</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-600">État actuel</p>
                <div className="mt-1">
                  <Badge variant={patientInsurance.is_active && !patientInsurance.deleted_at ? "default" : "secondary"}>
                    {patientInsurance.deleted_at ? 'Supprimé' : patientInsurance.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
              </div>
              {patientInsurance.deleted_at && (
                <div>
                  <p className="text-sm text-gray-600">Date de suppression</p>
                  <p className="font-medium text-sm">
                    {new Date(patientInsurance.deleted_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
