"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { HealthFacility } from "@/features/health-facilities";
import { HealthFacilityService } from "@/features/health-facilities";
import { useAuthToken } from "@/hooks/use-auth-token";
import { getFacilityTypeOptions } from "@/features/health-facilities/utils/health-facility.utils";

interface EditHealthFacilityPageProps {
  params: {
    id: string;
  };
}

export default function EditHealthFacilityPage({ params }: EditHealthFacilityPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [facility, setFacility] = useState<HealthFacility | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    facility_type: "" as HealthFacility['facility_type'],
    district: "",
    region: "",
    phone: "",
    is_active: true,
  });
  const { token } = useAuthToken();

  useEffect(() => {
    const loadFacility = async () => {
      try {
        const facilityData = await HealthFacilityService.getHealthFacilityById(params.id, token || undefined);
        setFacility(facilityData);
        setFormData({
          name: facilityData.name,
          code: facilityData.code,
          facility_type: facilityData.facility_type,
          district: facilityData.district || "",
          region: facilityData.region || "",
          phone: facilityData.phone || "",
          is_active: facilityData.is_active,
        });
      } catch (error: any) {
        console.error('Error loading facility:', error);
        toast.error('Erreur lors du chargement de l\'établissement');
        router.push('/health-facilities');
      } finally {
        setFetchLoading(false);
      }
    };

    loadFacility();
  }, [params.id, token, router]);

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
      await HealthFacilityService.updateHealthFacility(params.id, formData, token || undefined);
      toast.success("Établissement mis à jour avec succès");
      router.push('/health-facilities');
    } catch (error: any) {
      console.error('Error updating facility:', error);
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

  if (fetchLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Chargement de l'établissement...</p>
          </div>
        </div>
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modifier l'établissement</h1>
          <p className="text-muted-foreground">
            Modifier les informations de l'établissement de santé
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations principales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations principales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'établissement *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Entrez le nom de l'établissement"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  placeholder="Entrez le code"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facility_type">Type d'établissement *</Label>
                <Select 
                  value={formData.facility_type} 
                  onValueChange={(value) => handleInputChange('facility_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {getFacilityTypeOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="is_active">Statut</Label>
                <Select 
                  value={formData.is_active.toString()} 
                  onValueChange={(value) => handleInputChange('is_active', value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Actif</SelectItem>
                    <SelectItem value="false">Inactif</SelectItem>
                  </SelectContent>
                </Select>
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
                disabled={loading}
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
