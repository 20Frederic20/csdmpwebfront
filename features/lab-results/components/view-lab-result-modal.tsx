'use client';

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Calendar, Building, FileText, Beaker, User, Clock } from "lucide-react";
import { LabResult } from "../types/lab-results.types";
import { TestType } from "../types/lab-results.types";
import { Modal } from "@/components/ui/modal";

interface ViewLabResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  labResult: LabResult;
}

export function ViewLabResultModal({ isOpen, onClose, labResult }: ViewLabResultModalProps) {
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
      [TestType.URINALYSIS]: 'Urinanalyse',
      [TestType.STOOL_ANALYSIS]: 'Analyse des selles',
      [TestType.IMAGING]: 'Imagerie',
      [TestType.OTHER]: 'Autre'
    };
    return labels[testType] || testType;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails du résultat de laboratoire" size="lg">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-center gap-3 mb-4">
          <Beaker className="h-6 w-6 text-blue-500" />
          <h3 className="text-xl font-semibold">Résultat de laboratoire</h3>
          <Badge variant={labResult.is_active ? "default" : "secondary"}>
            {labResult.is_active ? 'Actif' : 'Inactif'}
          </Badge>
        </div>

        {/* Main Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Type de test</label>
              <div className="mt-1">
                <Badge variant="outline" className="text-sm">
                  {getTestTypeLabel(labResult.test_type)}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">ID Patient</label>
              <p className="text-sm font-mono text-gray-600">{labResult.patient_id}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">ID Performer</label>
              <p className="text-sm font-mono text-gray-600">{labResult.performer_id}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Statut</label>
              <div className="mt-1">
                <Badge variant={labResult.is_active ? "default" : "secondary"}>
                  {labResult.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">Date du test</label>
                <p className="text-sm">{formatDate(labResult.date_performed)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">Date du rapport</label>
                <p className="text-sm">{formatDate(labResult.date_reported)}</p>
              </div>
            </div>
            
            {labResult.issuing_facility && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Établissement émetteur</label>
                  <p className="text-sm">{labResult.issuing_facility}</p>
                </div>
              </div>
            )}
            
            {labResult.document_id && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">ID Document</label>
                  <p className="text-sm font-mono">{labResult.document_id}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Extracted Values */}
        {labResult.extracted_values && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <h4 className="font-medium">Valeurs extraites</h4>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(labResult.extracted_values, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* System Info */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-gray-400" />
            <h4 className="font-medium">Informations système</h4>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">ID Unique</label>
            <p className="text-xs font-mono text-gray-600 break-all">{labResult.id_}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
