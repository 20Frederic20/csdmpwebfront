'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Building2,
  Phone,
  Calendar,
  Save
} from "lucide-react";
import {
  useInsuranceCompany,
  useToggleInsuranceCompanyStatus,
  useDeleteInsuranceCompany
} from "@/features/insurance-companies/hooks/use-insurance-companies";
import { type InsuranceCompany } from "@/features/insurance-companies/types/insurance-companies.types";
import { useAuthRefresh } from "@/hooks/use-auth-refresh";
import Link from "next/link";
import { toast } from "sonner";

export default function InsuranceCompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const idValue = params.id as string;
  const { isLoading: authLoading } = useAuthRefresh();

  const { data: company, isLoading: loading, error } = useInsuranceCompany(idValue);
  const { mutateAsync: toggleStatus, isPending: togglingStatus } = useToggleInsuranceCompanyStatus();
  const { mutateAsync: deleteCompany, isPending: deleting } = useDeleteInsuranceCompany();

  const handleToggleStatus = async () => {
    if (!company) return;
    try {
      await toggleStatus({
        id: company.id_,
        isActive: !company.is_active
      });
    } catch (err) {
      // Handled by hook
    }
  };

  const handleDelete = async () => {
    if (!company) return;

    if (!confirm(`Êtes-vous sûr de vouloir supprimer la compagnie d'assurance "${company.name}" ?`)) {
      return;
    }

    try {
      await deleteCompany(company.id_);
      router.push('/insurance-companies');
    } catch (err: any) {
      // Handled by hook
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error && !company) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="text-red-600 mb-4">Erreur lors du chargement</div>
        <Link href="/insurance-companies">
          <Button>Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Compagnie d'assurance non trouvée</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/insurance-companies">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-gray-600 mt-2">Détails de la compagnie d'assurance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/insurance-companies/${company.id_}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleToggleStatus}
            disabled={loading || togglingStatus}
          >
            {company.is_active ? (
              <>
                <ToggleRight className="h-4 w-4 mr-2 text-green-600" />
                Désactiver
              </>
            ) : (
              <>
                <ToggleLeft className="h-4 w-4 mr-2 text-gray-400" />
                Activer
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={loading || deleting}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>


      {/* Company Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Nom de la compagnie</Label>
                  <p className="text-lg font-semibold">{company.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Code assureur</Label>
                  <p className="text-lg font-semibold">{company.insurer_code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Statut</Label>
                  <div className="mt-1">
                    <Badge variant={company.is_active ? "default" : "secondary"}>
                      {company.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">ID</Label>
                  <p className="text-sm font-mono text-gray-600">{company.id_}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-sm font-medium text-gray-500">Téléphone</Label>
                <p className="text-lg">
                  {company.contact_phone || (
                    <span className="text-gray-400">Non renseigné</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/insurance-companies/${company.id_}/edit`}>
                <Button className="w-full" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier les informations
                </Button>
              </Link>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleToggleStatus}
                disabled={loading || togglingStatus}
              >
                {company.is_active ? (
                  <>
                    <ToggleRight className="h-4 w-4 mr-2 text-green-600" />
                    Désactiver la compagnie
                  </>
                ) : (
                  <>
                    <ToggleLeft className="h-4 w-4 mr-2 text-gray-400" />
                    Activer la compagnie
                  </>
                )}
              </Button>
              <Button
                className="w-full text-red-600 hover:text-red-700"
                variant="outline"
                onClick={handleDelete}
                disabled={loading || deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer la compagnie
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informations système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-500">ID Unique</Label>
                <p className="text-xs font-mono text-gray-600 break-all">{company.id_}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Statut actuel</Label>
                <div className="mt-1">
                  <Badge variant={company.is_active ? "default" : "secondary"}>
                    {company.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
