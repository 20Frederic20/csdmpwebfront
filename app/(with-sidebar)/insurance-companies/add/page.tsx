'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Building2, Phone } from "lucide-react";
import { InsuranceCompaniesService } from "@/features/insurance-companies/services/insurance-companies.service";
import { CreateInsuranceCompanyRequest } from "@/features/insurance-companies/types/insurance-companies.types";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import Link from "next/link";

export default function AddInsuranceCompanyPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuthRefresh();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateInsuranceCompanyRequest>({
    name: '',
    insurer_code: '',
    contact_phone: '',
    is_active: true
  });

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
      
      await InsuranceCompaniesService.createInsuranceCompany(formData);
      router.push('/insurance-companies');
    } catch (err: any) {
      console.error('Failed to create insurance company:', err);
      setError(err.message || 'Erreur lors de la création de la compagnie d\'assurance');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/insurance-companies">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ajouter une Compagnie d'Assurance</h1>
          <p className="text-gray-600 mt-2">Créer une nouvelle compagnie d'assurance</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de la compagnie</CardTitle>
          <CardDescription>
            Remplissez les informations de la nouvelle compagnie d'assurance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  'Création en cours...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Créer la compagnie
                  </>
                )}
              </Button>
              <Link href="/insurance-companies">
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
