'use client';

import { StatCard } from "@/components/dashboard/stat-card";
import { Hospital, Users, Stethoscope, Calendar, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAuthToken } from "@/hooks/use-auth-token";
import { usePermissionsContext } from "@/contexts/permissions-context";

import { useHealthFacilities } from "@/features/health-facilities/hooks/use-health-facilities";
import { usePatients } from "@/features/patients/hooks/use-patients";
import { useHospitalStaffs } from "@/features/hospital-staff/hooks/use-hospital-staffs";
import { useAppointments } from "@/features/appointments/hooks/use-appointments";
import { useConsultations } from "@/features/consultations/hooks/use-consultations";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Dashboard() {
  const { token } = useAuthToken();
  const { canAccess, user } = usePermissionsContext();
  const isSuperadmin = user?.roles?.some(role => role === 'SUPER_ADMIN') || false;

  // Metrics Queries
  const { data: facilitiesData, isLoading: loadingFacilities } = useHealthFacilities({ limit: 1, offset: 0 }, token || undefined);
  const { data: patientsData, isLoading: loadingPatients } = usePatients({ limit: 5, offset: 0 }); // Assuming newer are first or we can sort
  const { data: staffData, isLoading: loadingStaff } = useHospitalStaffs({ limit: 1, offset: 0 });
  const { data: consultationsData, isLoading: loadingConsultations } = useConsultations({ limit: 5, offset: 0 }); // Assuming newer are first
  const { data: appointmentsData, isLoading: loadingAppointments } = useAppointments({ limit: 1, offset: 0 });

  const stats = {
    hospitals: facilitiesData?.total || 0,
    patients: patientsData?.total || 0,
    doctors: staffData?.total || 0,
    consultations: consultationsData?.total || 0,
    appointments: appointmentsData?.total || 0,
  };

  const recentPatients = patientsData?.data || [];
  const recentConsultations = consultationsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Vue d'overview des statistiques du système de santé
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canAccess('patients', 'create') && (
            <Link href="/patients/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Patient
              </Button>
            </Link>
          )}
          {canAccess('consultations', 'create') && (
            <Link href="/consultations/add">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Consultation
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isSuperadmin ? (
          <StatCard
            title="Établissements"
            value={loadingFacilities ? "..." : stats.hospitals}
            icon={Hospital}
            description="Total des établissements"
          />
        ) : (
          <StatCard
            title="Rendez-vous"
            value={loadingAppointments ? "..." : stats.appointments}
            icon={Calendar}
            description="Rendez-vous programmés"
          />
        )}

        <StatCard
          title="Patients"
          value={loadingPatients ? "..." : stats.patients}
          icon={Users}
          description="Patients enregistrés"
        />

        <StatCard
          title="Personnel"
          value={loadingStaff ? "..." : stats.doctors}
          icon={Stethoscope}
          description="Professionnels de santé"
        />

        <StatCard
          title="Consultations"
          value={loadingConsultations ? "..." : stats.consultations}
          icon={Calendar}
          description="Consultations totales"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">

        {/* Recent Patients */}
        <Card className="col-span-1 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">Derniers Patients</CardTitle>
              <CardDescription>Les patients récemment enregistrés</CardDescription>
            </div>
            {canAccess('patients', 'read') && (
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/patients">
                  Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loadingPatients ? (
              <div className="text-sm text-gray-500 py-4 text-center">Chargement...</div>
            ) : recentPatients.length === 0 ? (
              <div className="text-sm text-gray-500 py-4 text-center">Aucun patient récent trouvé.</div>
            ) : (
              <div className="space-y-4 mt-4">
                {recentPatients.map(patient => (
                  <div key={patient.id_} className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" onClick={() => window.location.href = `/patients/${patient.id_}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {patient.given_name.charAt(0)}{patient.family_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{patient.given_name} {patient.family_name}</p>
                        <p className="text-xs text-muted-foreground mt-1">Sécu: {patient.health_id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Consultations */}
        <Card className="col-span-1 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">Dernières Consultations</CardTitle>
              <CardDescription>Les récentes entrées de consultation</CardDescription>
            </div>
            {canAccess('consultations', 'read') && (
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/consultations">
                  Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loadingConsultations ? (
              <div className="text-sm text-gray-500 py-4 text-center">Chargement...</div>
            ) : recentConsultations.length === 0 ? (
              <div className="text-sm text-gray-500 py-4 text-center">Aucune consultation récente trouvée.</div>
            ) : (
              <div className="space-y-4 mt-4">
                {recentConsultations.slice(0,5).map(consultation => (
                  <div key={consultation.id_} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer gap-2" onClick={() => window.location.href = `/consultations/${consultation.id_}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{consultation.patient_full_name || 'Consultation'}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1 flex gap-2">
                          <span>{consultation.created_at ? format(new Date(consultation.created_at), "dd MMM yyyy", { locale: fr }) : ''}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>Docteur {consultation.consulted_by_full_name || 'Inconnu'}</span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <Badge variant={consultation.status === 'COMPLETED' ? 'default' : consultation.status === 'IN_PROGRESS' ? 'secondary' : 'outline'}>
                        {consultation.status === 'COMPLETED' ? 'Terminée' : consultation.status === 'IN_PROGRESS' ? 'En cours' : consultation.status || 'Enregistrée'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}