'use client';

import { StatCard } from "@/components/dashboard/stat-card";
import { Hospital, Users, Stethoscope, Calendar, Plus, ChevronRight, Activity, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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

type PatientStatus = 'Stable' | 'Critical' | 'Observation' | 'En Analyse';

interface PatientCardProps {
  patient: {
    id_: string;
    given_name: string;
    family_name: string;
    photo_url?: string;
    status?: PatientStatus;
    department?: string;
    doctor?: string;
    needsAppointment?: boolean;
  };
}

const statusColors: Record<PatientStatus, string> = {
  'Stable': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Critical': 'bg-red-100 text-red-800 border-red-200',
  'Observation': 'bg-amber-100 text-amber-800 border-amber-200',
  'En Analyse': 'bg-blue-100 text-blue-800 border-blue-200',
};

function PatientCard({ patient }: PatientCardProps) {
  const initials = `${patient.given_name.charAt(0)}${patient.family_name.charAt(0)}`.toUpperCase();
  const status = (patient.status as PatientStatus) || 'Stable';

  return (
    <Link href={`/patients/${patient.id_}`}>
      <Card className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:scale-[1.02] border border-outline-variant/20 cursor-pointer h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-tint/10 flex items-center justify-center">
            {patient.photo_url ? (
              <img alt={`${patient.given_name} ${patient.family_name}`} className="w-full h-full object-cover" src={patient.photo_url} />
            ) : (
              <span className="text-lg font-bold text-primary">{initials}</span>
            )}
          </div>
          <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border", statusColors[status])}>
            {status}
          </span>
        </div>
        <div>
          <h3 className="font-headline font-bold text-lg text-on-surface">{patient.given_name} {patient.family_name}</h3>
          {patient.needsAppointment && (
            <div className="flex items-center gap-2 mt-2 text-primary font-semibold">
              <Activity className="w-4 h-4" />
              <span className="text-sm">RDV à confirmer</span>
            </div>
          )}
        </div>
        {patient.department && (
          <div className="pt-4 mt-auto">
            <div className="bg-surface-container-low p-3 rounded-lg flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{patient.department}</span>
                {patient.doctor && <span className="text-[10px] text-on-surface-variant">{patient.doctor}</span>}
              </div>
              {patient.needsAppointment && (
                <button className="px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded shadow-sm hover:brightness-110 transition-colors">
                  Confirmer
                </button>
              )}
            </div>
          </div>
        )}
      </Card>
    </Link>
  );
}

interface TimelineEventProps {
  icon: React.ReactNode;
  iconBg: 'primary' | 'surface';
  timestamp: string;
  title: string;
  subtitle: string;
  isLast?: boolean;
}

function TimelineEvent({ icon, iconBg, timestamp, title, subtitle, isLast = false }: TimelineEventProps) {
  return (
    <div className="flex gap-4 pb-6 relative">
      {!isLast && <div className="absolute left-3 top-8 bottom-0 w-px bg-outline-variant/30" />}
      <div className={cn(
        "relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0",
        iconBg === 'primary' ? 'bg-primary' : 'bg-surface-container-highest border-2 border-outline-variant'
      )}>
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">{timestamp}</span>
        <p className="text-on-surface font-medium">{title}</p>
        <p className="text-xs text-on-surface-variant">{subtitle}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { token } = useAuthToken();
  const { canAccess, user } = usePermissionsContext();
  const isSuperadmin = user?.roles?.some(role => role === 'SUPER_ADMIN') || false;

  // Metrics Queries
  const { data: facilitiesData, isLoading: loadingFacilities } = useHealthFacilities({ limit: 1, offset: 0 }, token || undefined);
  const { data: patientsData, isLoading: loadingPatients } = usePatients({ limit: 6, offset: 0 });
  const { data: staffData, isLoading: loadingStaff } = useHospitalStaffs({ limit: 1, offset: 0 });
  const { data: consultationsData, isLoading: loadingConsultations } = useConsultations({ limit: 5, offset: 0 });
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

  // Map patients to family dashboard format
  const familyPatients = recentPatients.slice(0, 3).map(patient => ({
    id_: patient.id_,
    given_name: patient.given_name,
    family_name: patient.family_name,
    photo_url: patient.photo_url,
    status: 'Stable' as PatientStatus,
    department: patient.last_consultation_department || 'Général',
    doctor: patient.last_consultation_doctor || 'Inconnu',
    needsAppointment: patient.needs_appointment || false,
  }));

  return (
    <div className="space-y-6 pb-32">
      {/* Welcome Header */}
      <section className="flex flex-col gap-1">
        <h1 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface">
          Bonjour {user?.name || 'Utilisateur'}
        </h1>
        <p className="text-on-surface-variant">
          Voici un aperçu de l'état de santé de vos patients aujourd'hui.
        </p>
      </section>

      {/* Quick Actions Bento */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {canAccess('patients', 'create') && (
          <Link href="/patients/add">
            <button className="group flex items-center justify-between w-full p-6 rounded-lg bg-primary text-on-primary shadow-sm hover:brightness-105 transition-all duration-200 active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-headline font-bold text-lg text-left">Ajouter un patient</span>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        )}
        {canAccess('lab_tests', 'create') && (
          <Link href="/lab-tests/request">
            <button className="group flex items-center justify-between w-full p-6 rounded-lg bg-secondary-container text-on-secondary-container shadow-sm hover:bg-secondary-container/80 transition-all duration-200 active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="bg-white/40 p-3 rounded-lg">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="font-headline font-bold text-lg text-left">Demander un test labo</span>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        )}
      </section>

      {/* Patient Status Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-xl tracking-tight">Vos Patients</h2>
          {canAccess('patients', 'read') && (
            <Link href="/patients" className="text-primary font-semibold text-sm hover:underline">
              Voir tout
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingPatients ? (
            <div className="text-sm text-muted-foreground py-4 text-center">Chargement...</div>
          ) : familyPatients.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center col-span-full">Aucun patient trouvé.</div>
          ) : (
            familyPatients.map(patient => (
              <PatientCard key={patient.id_} patient={patient} />
            ))
          )}
          {/* Stats Card */}
          <Card className="bg-surface-container-low rounded-lg p-6 shadow-sm border border-outline-variant/20">
            <div>
              <span className="font-label text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Suivi Hebdomadaire
              </span>
              <h3 className="font-headline font-bold text-2xl mt-2 text-primary">
                {stats.consultations} Interventions
              </h3>
              <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                Toutes les constantes sont dans les normes pour vos patients suivis.
              </p>
            </div>
            <div className="flex items-end gap-1 h-12 mt-6">
              {[40, 60, 45, 90, 55, 70, 30].map((height, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-t-sm transition-all",
                    i === 3 ? 'bg-primary h-full' : 'bg-primary/20'
                  )}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Upcoming Timeline */}
      <section className="bg-surface-container-high/20 rounded-lg p-8 border border-outline-variant/10">
        <h2 className="font-headline font-bold text-xl mb-6">Activités Récentes</h2>
        <div className="space-y-0">
          {loadingConsultations || recentConsultations.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">Aucune activité récente.</div>
          ) : (
            <>
              {recentConsultations.slice(0, 3).map((consultation, index) => (
                <TimelineEvent
                  key={consultation.id_}
                  icon={<Check className="w-3 h-3 text-white" />}
                  iconBg="primary"
                  timestamp={consultation.created_at ? format(new Date(consultation.created_at), "dd MMM, HH:mm", { locale: fr }) : ''}
                  title={`Consultation - ${consultation.patient_full_name || 'Patient'}`}
                  subtitle={`Par Dr. ${consultation.consulted_by_full_name || 'Inconnu'}`}
                  isLast={index === recentConsultations.slice(0, 3).length - 1}
                />
              ))}
            </>
          )}
        </div>
      </section>

      {/* Stat Cards (hidden on mobile, shown on larger screens) */}
      <div className="hidden lg:grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}