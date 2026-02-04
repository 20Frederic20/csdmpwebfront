"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  UserCheck, 
  Building2, 
  Calendar, 
  Award,
  MapPin,
  Stethoscope
} from "lucide-react";
import { toast } from "sonner";
import { HospitalStaff } from "@/features/hospital-staff";
import { HospitalStaffService } from "@/features/hospital-staff";
import { useAuthToken } from "@/hooks/use-auth-token";
import { 
  getSpecialtyLabel, 
  getDepartmentLabel, 
  getExperienceLabel 
} from "@/features/hospital-staff";

export default function HospitalStaffDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthToken();
  const [staff, setStaff] = useState<HospitalStaff | null>(null);
  const [loading, setLoading] = useState(true);

  const staffId = params.id as string;

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const staffData = await HospitalStaffService.getHospitalStaffById(staffId, token || undefined);
        setStaff(staffData);
      } catch (error: any) {
        console.error('Error loading staff:', error);
        toast.error(error.message || "Erreur lors du chargement du personnel");
        router.push('/hospital-staff');
      } finally {
        setLoading(false);
      }
    };

    if (staffId) {
      loadStaff();
    }
  }, [staffId, token, router]);

  const handleToggleStatus = async () => {
    if (!staff) return;
    
    try {
      const updatedStaff = await HospitalStaffService.toggleHospitalStaffStatus(staff.id_, token || undefined);
      setStaff(updatedStaff);
      toast.success(`Personnel ${updatedStaff.is_active ? 'activé' : 'désactivé'} avec succès`);
    } catch (error: any) {
      console.error('Error toggling status:', error);
      toast.error(error.message || "Erreur lors du changement de statut");
    }
  };

  const handleDelete = async () => {
    if (!staff) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre du personnel ?')) {
      try {
        await HospitalStaffService.deleteHospitalStaff(staff.id_, token || undefined);
        toast.success('Personnel supprimé avec succès');
        router.push('/hospital-staff');
      } catch (error: any) {
        console.error('Error deleting staff:', error);
        toast.error(error.message || "Erreur lors de la suppression");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Chargement des informations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Personnel non trouvé</h2>
          <p className="text-muted-foreground mb-4">Ce membre du personnel n'existe pas.</p>
          <Button onClick={() => router.push('/hospital-staff')} className="cursor-pointer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/hospital-staff')}
            className="cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Détails du Personnel</h1>
            <p className="text-muted-foreground">
              Informations complètes sur le membre du personnel hospitalier
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button 
            variant="outline" 
            onClick={handleToggleStatus}
            className="cursor-pointer"
          >
            <UserCheck className="mr-2 h-4 w-4" />
            {staff.is_active ? 'Désactiver' : 'Activer'}
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte principale */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Informations du personnel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Identité */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Identité</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-md font-medium text-muted-foreground">ID Personnel</label>
                  <p className="font-mono text-md bg-muted px-2 py-1 rounded">{staff.id_}</p>
                </div>
                <div>
                  <label className="text-md font-medium text-muted-foreground">ID Utilisateur</label>
                  <p className="font-mono text-md bg-muted px-2 py-1 rounded">{staff.user_id}</p>
                </div>
                <div>
                  <label className="text-md font-medium text-muted-foreground">Matricule</label>
                  <p className="font-mono text-md bg-muted px-2 py-1 rounded">{staff.matricule}</p>
                </div>
                <div>
                  <label className="text-md font-medium text-muted-foreground">Statut</label>
                  <div>
                    <Badge 
                      variant={staff.is_active ? "default" : "secondary"}
                      className={staff.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {staff.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Profession */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profession</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-md font-medium text-muted-foreground">Spécialité</label>
                  <div className="mt-1">
                    <Badge variant="secondary">
                      {getSpecialtyLabel(staff.specialty)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-md font-medium text-muted-foreground">Département</label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {getDepartmentLabel(staff.department)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-md font-medium text-muted-foreground">Années d'expérience</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{getExperienceLabel(staff.year_of_exp)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-md font-medium text-muted-foreground">ID Établissement</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-md">{staff.health_facility_id}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carte latérale */}
        <div className="space-y-6">
          {/* Statut */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Statut
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    staff.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {staff.is_active ? (
                      <UserCheck className="h-8 w-8" />
                    ) : (
                      <UserCheck className="h-8 w-8" />
                    )}
                  </div>
                  <Badge 
                    variant={staff.is_active ? "default" : "secondary"}
                    className={staff.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {staff.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <Button 
                  onClick={handleToggleStatus}
                  className="w-full cursor-pointer"
                  variant={staff.is_active ? "destructive" : "default"}
                >
                  {staff.is_active ? 'Désactiver' : 'Activer'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Modifier les informations
              </Button>
              <Button variant="outline" className="w-full cursor-pointer">
                <MapPin className="mr-2 h-4 w-4" />
                Voir l'établissement
              </Button>
              <Button 
                variant="destructive" 
                className="w-full cursor-pointer"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
