"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building, User, Phone, MapPin, Users, Save, Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { HealthFacility, UpdateHealthFacilityRequest } from "@/features/health-facilities/types/health-facility.types";
import { HealthFacilityService } from "@/features/health-facilities/services/health-facility.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { usePermissions } from "@/hooks/use-permissions";
import { toast } from "sonner";
import Link from "next/link";
import { getFacilityTypeOptions } from "@/features/health-facilities/utils/health-facility.utils";
import CustomSelect from "@/components/ui/custom-select";

interface EditHealthFacilityPageProps {
  params: {
    id: string;
  };
}

export default function EditHealthFacilityPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [facility, setFacility] = useState<HealthFacility | null>(null);
  const [formData, setFormData] = useState<UpdateHealthFacilityRequest>({
    name: "",
    code: "",
    facility_type: null,
    district: "",
    region: "",
    phone: "",
    admin_user_id: null,
    is_active: true,
  });
  const { token } = useAuthToken();
  const { canAccess } = usePermissions();
  const facilityId = params.id as string;

  useEffect(() => {
    const loadFacility = async () => {
      try {
        const facilityData = await HealthFacilityService.getHealthFacilityById(facilityId, token || undefined);
        setFacility(facilityData);
        setFormData({
          name: facilityData.name,
          code: facilityData.code,
          facility_type: facilityData.facility_type,
          district: facilityData.district || "",
          region: facilityData.region || "",
          phone: facilityData.phone || "",
          admin_user_id: facilityData.admin_user_id || null,
          is_active: facilityData.is_active,
        });
      } catch (error: any) {
        toast.error('Erreur lors du chargement de l\'établissement');
        router.push('/health-facilities');
      } finally {
        setFetchLoading(false);
      }
    };

    loadFacility();
  }, [facilityId, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Le nom de l'établissement est requis");
      return;
    }
    if (!formData.code.trim()) {
      toast.error("Le code est requis");
      return;
    }
    if (!formData.facility_type) {
      toast.error("Le type d'établissement est requis");
      return;
    }

    setLoading(true);
    try {
      await HealthFacilityService.updateHealthFacility(facilityId, formData, token || undefined);
      router.push('/health-facilities');
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSoftDelete = async () => {
    if (!facility) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet établissement ?')) {
      try {
        await HealthFacilityService.deleteHealthFacility(facility.id_, token || undefined);
        toast.success('Établissement supprimé avec succès');
        router.push('/health-facilities');
      } catch (error: any) {
        toast.error(error.message || "Erreur lors de la suppression");
      }
    }
  };

  const handlePermanentlyDelete = async () => {
    if (!facility) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cet établissement ? Cette action est irréversible.')) {
      try {
        await HealthFacilityService.permanentlyDeleteHealthFacility(facility.id_, token || undefined);
        toast.success('Établissement supprimé définitivement');
        router.push('/health-facilities');
      } catch (error: any) {
        toast.error(error.message || "Erreur lors de la suppression définitive");
      }
    }
  };

  const handleRestore = async () => {
    if (!facility) return;
    
    try {
      const restoredFacility = await HealthFacilityService.restoreHealthFacility(facility.id_, token || undefined);
      setFacility(restoredFacility);
      toast.success('Établissement restauré avec succès');
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la restauration");
    }
  };

  if (fetchLoading) {
    return (
      <div className="container mx-auto py-6">
        {fetchLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto mb-2"></div>
              <p className="text-muted-foreground">Chargement de l'établissement...</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Établissement non trouvé</p>
          </div>
        )}
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Établissement non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => router.push('/health-facilities')}
          className="cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Modifier l'établissement</h1>
              <p className="text-muted-foreground">
                Modifier les informations de l'établissement de santé
              </p>
            </div>
            <div className="flex gap-2">
              {facility && facility.deleted_at && canAccess('health_facilities', 'restore') && (
                <Button 
                  variant="outline" 
                  onClick={handleRestore}
                  className="cursor-pointer"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restaurer
                </Button>
              )}
              {facility && !facility.deleted_at && canAccess('health_facilities', 'soft_delete') && (
                <Button 
                  variant="outline" 
                  onClick={handleSoftDelete}
                  className="cursor-pointer text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              )}
              {facility && facility.deleted_at && canAccess('health_facilities', 'delete') && (
                <Button 
                  variant="destructive" 
                  onClick={handlePermanentlyDelete}
                  className="cursor-pointer"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Supprimer définitivement
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {facility && facility.deleted_at && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800">Établissement supprimé</h3>
              <p className="text-sm text-yellow-700">
                Cet établissement a été supprimé. Vous pouvez le restaurer ou le supprimer définitivement.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`space-y-6 ${facility && facility.deleted_at ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Informations principales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations principales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'établissement <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Entrez le nom de l'établissement"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code <span className="text-red-500">*</span></Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  placeholder="Entrez le code"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facility_type">Type d'établissement <span className="text-red-500">*</span></Label>
                <CustomSelect
                  value={formData.facility_type}
                  onChange={(value) => {
                    const stringValue = Array.isArray(value) ? value[0] : value;
                    handleInputChange('facility_type', stringValue || '');
                  }}
                  options={getFacilityTypeOptions()}
                  placeholder="Sélectionner un type"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations de localisation */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de localisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder="Entrez le district"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Région</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  placeholder="Entrez la région"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Entrez le numéro de téléphone"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/health-facilities')}
                className="cursor-pointer"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading || (facility && facility.deleted_at)}
                className="cursor-pointer"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
