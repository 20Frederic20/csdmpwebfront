'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Save } from "lucide-react";
import { InsuranceCompany, CreateInsuranceCompanyRequest } from "../types/insurance-companies.types";
import { InsuranceCompaniesService } from "../services/insurance-companies.service";
import { Modal } from "@/components/ui/modal";

interface EditInsuranceCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: InsuranceCompany;
  onUpdate: (updatedCompany: InsuranceCompany) => void;
}

export function EditInsuranceCompanyModal({ isOpen, onClose, company, onUpdate }: EditInsuranceCompanyModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateInsuranceCompanyRequest>({
    name: '',
    insurer_code: '',
    contact_phone: '',
    is_active: true
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        insurer_code: company.insurer_code,
        contact_phone: company.contact_phone || '',
        is_active: company.is_active
      });
    }
  }, [company]);

  const handleInputChange = (field: keyof CreateInsuranceCompanyRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.insurer_code.trim()) {
      setError('Le nom et le code assureur sont obligatoires');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const updatedCompany = await InsuranceCompaniesService.updateInsuranceCompany(company.id_, formData);
      onUpdate(updatedCompany);
      onClose();
    } catch (err: any) {
      console.error('Failed to update insurance company:', err);
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier la compagnie d'assurance" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error */}
        {error && (
          <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-1">
            Nom de la compagnie <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Nom de la compagnie d'assurance"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>

        {/* Insurer Code */}
        <div className="space-y-2">
          <Label htmlFor="insurer_code" className="flex items-center gap-1">
            Code assureur <span className="text-red-500">*</span>
          </Label>
          <Input
            id="insurer_code"
            type="text"
            placeholder="Code unique de l'assureur"
            value={formData.insurer_code || ''}
            onChange={(e) => handleInputChange('insurer_code', e.target.value)}
            required
          />
        </div>

        {/* Contact Phone */}
        <div className="space-y-2">
          <Label htmlFor="contact_phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Téléphone de contact
          </Label>
          <Input
            id="contact_phone"
            type="tel"
            placeholder="Numéro de téléphone (optionnel)"
            value={formData.contact_phone || ''}
            onChange={(e) => handleInputChange('contact_phone', e.target.value)}
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
            Compagnie active
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
