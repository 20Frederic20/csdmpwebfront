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
import { HospitalStaff, HospitalStaffService } from "@/features/hospital-staff";
import { useHospitalStaffMutations } from "@/features/hospital-staff/hooks/use-hospital-staff-mutations";
import { useAuthToken } from "@/hooks/use-auth-token";
import {
  formatSpecialty,
  formatDepartment,
  formatEmploymentStatus
} from "@/features/hospital-staff/utils/hospital-staff.utils";

export default function HospitalStaffDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthToken();
  const [staff, setStaff] = useState<HospitalStaff | null>(null);
  const [loading, setLoading] = useState(true);

  const staffId = params.id as string;
  const { toggleStatus, deleteStaff } = useHospitalStaffMutations();

  const loadStaff = async () => {
    try {
      const staffData = await HospitalStaffService.getHospitalStaffById(staffId);
      setStaff(staffData);
    } catch (error: any) {
      console.error('Error loading staff:', error);
      toast.error(error.message || "Erreur lors du chargement du personnel");
      router.push('/hospital-staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staffId) {
      loadStaff();
    }
  }, [staffId, isAuthenticated, router]);

  const handleToggleStatus = async () => {
    if (!staff) return;

    try {
      await toggleStatus(staff.id_);
      // Recharger les données pour mettre à jour l'affichage local
      await loadStaff();
    } catch (error: any) {
      // Erreur gérée dans le hook
    }
  };

  const handleDelete = async () => {
    if (!staff) return;

    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre du personnel ?')) {
      try {
        await deleteStaff(staff.id_);
        router.push('/hospital-staff');
      } catch (error: any) {
        // Erreur gérée dans le hook
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
          {/* Action buttons removed as requested */}
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte principale */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Information Professionnelle: {staff.user_full_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Infos de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Matricule</label>
                <p className="text-lg font-mono font-bold">{staff.matricule}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Statut du compte</label>
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

            {/* Profession */}
            <div className="space-y-6 pt-6 border-t font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Établissement</label>
                  <p className="text-md font-medium mt-1">{staff.health_facility_name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Département</label>
                  <p className="text-md font-medium mt-1">{staff.department_name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Spécialité</label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="capitalize">
                      {formatSpecialty(staff.specialty).toLowerCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Statut d'emploi</label>
                  <div className="mt-1 font-medium">
                    {staff.employment_status ? formatEmploymentStatus(staff.employment_status) : "Non spécifié"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Années d'expérience</label>
                  <div className="flex items-center gap-2 mt-1 font-medium">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{staff.year_of_exp === 0 ? 'Débutant' : `${staff.year_of_exp} ans`}</span>
                  </div>
                </div>
                {staff.order_number && (
                  <div>
                    <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Numéro d'ordre</label>
                    <p className="font-mono text-md mt-1 font-bold">{staff.order_number}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carte latérale */}
        <div className="space-y-6">
          {/* Statut visuel */}
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
                  <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${staff.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                    <UserCheck className="h-8 w-8" />
                  </div>
                  <Badge
                    variant={staff.is_active ? "default" : "secondary"}
                    className={staff.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {staff.is_active ? 'Actif' : 'Inactif'}
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
