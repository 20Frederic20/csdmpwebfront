'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Save, Beaker } from "lucide-react";
import { LabResult, CreateLabResultRequest, TestType } from "../types/lab-results.types";
import { LabResultsService } from "../services/lab-results.service";
import { Modal } from "@/components/ui/modal";

interface EditLabResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  labResult: LabResult;
  onUpdate: (updatedLabResult: LabResult) => void;
}

export function EditLabResultModal({ isOpen, onClose, labResult, onUpdate }: EditLabResultModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateLabResultRequest>({
    patient_id: '',
    performer_id: '',
    test_type: TestType.BLOOD_COUNT,
    date_performed: '',
    date_reported: '',
    issuing_facility: '',
    document_id: '',
    extracted_values: null,
    is_active: true
  });

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
      [TestType.URINALYSIS]: 'Urinanalyse',
      [TestType.STOOL_ANALYSIS]: 'Analyse des selles',
      [TestType.IMAGING]: 'Imagerie',
      [TestType.OTHER]: 'Autre'
    };
    return labels[testType] || testType;
  };

  useEffect(() => {
    if (labResult) {
      setFormData({
        patient_id: labResult.patient_id,
        performer_id: labResult.performer_id,
        test_type: labResult.test_type,
        date_performed: labResult.date_performed.split('T')[0],
        date_reported: labResult.date_reported.split('T')[0],
        issuing_facility: labResult.issuing_facility || '',
        document_id: labResult.document_id || '',
        extracted_values: labResult.extracted_values,
        is_active: labResult.is_active
      });
    }
  }, [labResult]);

  const handleInputChange = (field: keyof CreateLabResultRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExtractedValuesChange = (value: string) => {
    try {
      if (value.trim() === '') {
        handleInputChange('extracted_values', null);
      } else {
        const parsed = JSON.parse(value);
        handleInputChange('extracted_values', parsed);
      }
    } catch (err) {
      // Ne pas mettre à jour si le JSON est invalide
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patient_id.trim() || !formData.performer_id.trim()) {
      setError('Les champs patient et performer sont obligatoires');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const updatedLabResult = await LabResultsService.updateLabResult(labResult.id_, formData);
      onUpdate(updatedLabResult);
      onClose();
    } catch (err: any) {
      console.error('Failed to update lab result:', err);
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le résultat de laboratoire" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error */}
        {error && (
          <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient ID */}
          <div className="space-y-2">
            <Label htmlFor="patient_id" className="flex items-center gap-1">
              Patient <span className="text-red-500">*</span>
            </Label>
            <Input
              id="patient_id"
              type="text"
              placeholder="UUID du patient"
              value={formData.patient_id || ''}
              onChange={(e) => handleInputChange('patient_id', e.target.value)}
              required
            />
          </div>

          {/* Performer ID */}
          <div className="space-y-2">
            <Label htmlFor="performer_id" className="flex items-center gap-1">
              Performer <span className="text-red-500">*</span>
            </Label>
            <Input
              id="performer_id"
              type="text"
              placeholder="UUID du performer"
              value={formData.performer_id || ''}
              onChange={(e) => handleInputChange('performer_id', e.target.value)}
              required
            />
          </div>

          {/* Test Type */}
          <div className="space-y-2">
            <Label htmlFor="test_type" className="flex items-center gap-1">
              Type de test <span className="text-red-500">*</span>
            </Label>
            <select
              id="test_type"
              value={formData.test_type}
              onChange={(e) => handleInputChange('test_type', e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              {testTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {getTestTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          {/* Issuing Facility */}
          <div className="space-y-2">
            <Label htmlFor="issuing_facility">Établissement émetteur</Label>
            <Input
              id="issuing_facility"
              type="text"
              placeholder="Établissement émetteur"
              value={formData.issuing_facility || ''}
              onChange={(e) => handleInputChange('issuing_facility', e.target.value)}
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
            onChange={(e) => handleExtractedValuesChange(e.target.value)}
            rows={4}
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => handleInputChange('is_active', checked)}
          />
          <Label htmlFor="is_active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Résultat actif
          </Label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <Button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
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
