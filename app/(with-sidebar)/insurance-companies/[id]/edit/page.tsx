'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Building2, Phone } from "lucide-react";
import { useInsuranceCompany, useUpdateInsuranceCompany } from "@/features/insurance-companies/hooks/use-insurance-companies";
import { CreateInsuranceCompanyRequest } from "@/features/insurance-companies/types/insurance-companies.types";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import { toast } from "sonner";
import Link from "next/link";

export default function EditInsuranceCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const idValue = params.id as string;
  const { isLoading: authLoading } = useAuthRefresh();
  
  const { data: company, isLoading: fetchingCompany, error } = useInsuranceCompany(idValue);
  const { mutateAsync: updateCompany, isPending: updating } = useUpdateInsuranceCompany();

  const [formData, setFormData] = useState<CreateInsuranceCompanyRequest>({
    name: '',
    insurer_code: '',
    contact_phone: '',
    coverage_rate: null,
    is_active: true
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        insurer_code: company.insurer_code,
        contact_phone: company.contact_phone || '',
        coverage_rate: company.coverage_rate ?? null,
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
      toast.error('Le nom et le code assureur sont obligatoires');
      return;
    }

    try {
      await updateCompany({ id: idValue, data: formData });
      router.push(`/insurance-companies/${idValue}`);
    } catch (err: any) {
      // Handled by hook
    }
  };

  if (authLoading || fetchingCompany) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="text-red-600 mb-4">Erreur lors du chargement de la compagnie d'assurance</div>
        <Link href="/insurance-companies">
          <Button>Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/insurance-companies/${idValue}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modifier la Compagnie d'Assurance</h1>
          <p className="text-gray-600 mt-2">Modifier les informations de {company.name}</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de la compagnie</CardTitle>
          <CardDescription>
            Mettez à jour les informations de la compagnie d'assurance
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

            {/* Coverage Rate */}
            <div className="space-y-2">
              <Label htmlFor="coverage_rate" className="flex items-center gap-1">
                Taux de couverture (%)
              </Label>
              <Input
                id="coverage_rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="Ex: 80"
                value={formData.coverage_rate ?? ''}
                onChange={(e) => handleInputChange('coverage_rate', e.target.value ? parseFloat(e.target.value) : null)}
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
                disabled={updating}
                className="bg-green-600 hover:bg-green-700"
              >
                {updating ? (
                  'Mise à jour en cours...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
              <Link href={`/insurance-companies/${idValue}`}>
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
