'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/patient/bottom-nav";
import {
  User,
  Bell,
  Search,
  Plus,
  TestTube2,
  FileText,
  CreditCard,
  MoreHorizontal,
  X,
  Check,
  Calendar,
  Activity
} from "lucide-react";
import Link from "next/link";

// Données factices - à remplacer par des appels API
const patientsData = [
  {
    id: "CS-8829",
    name: "Eleanor Vance",
    bloodType: "A+",
    status: "stable",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAir3pGBXwU_8fLDr5sq6hKj7Ag7QDzFL7gxPIxvtoCn2U3IChiq36XbxEcU-gNAkd8sv6cv_UfZUnNtJjU8VPF82kYHYWTxD-uyRksiwG1RfPBVTsXMARNPc0krdRK_9daiKKQprxDglQmvxE9cdcMAcv7zawpQWQStN5AOqy9HAc1kYxXNBouUVQYYp6kXNkMqajdIn0DaLW8asafn3da3oaSocPknTYTAFvevh5miXuhz8kHZ7mtEbaXUUvoEU1LAALt3sqJX5lD",
    hasUnpaidBill: false,
  },
  {
    id: "CS-1104",
    name: "Arthur Vance",
    bloodType: "O-",
    status: "observation",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbhOzjgVTyc4qS4xaeBnhvPoRUOpLolHxjEIgSODUn-p2q_d-_tHY5DXBOHE_urn1JoL6S_WEVSfVgOi4SVm952cH_RUZyty3Vw9oSu_l1OZyXQGhibf-RB4d38TRqcM2Z27y0eg1YPB1y1bP5NQy0imL8rjNy_KkKYgPbJ3ZzaBfCQ4yOflDI4j0k6pjKPxzFPEKEEhvT4qcYgHDb2jGSYADGno9r-WRASc07r4_SBDARPjCZv3SdAexeqVUAQUBrt_5hH8U9jHx",
    hasUnpaidBill: true,
  },
];

const appointmentsToConfirm = [
  {
    id: 1,
    patient: "Arthur Vance",
    date: "Demain à 09:30",
    type: "Check-up",
  },
  {
    id: 2,
    patient: "Sophie Martin",
    date: "25 Jan à 14:00",
    type: "Suivi",
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "stable":
      return {
        color: "text-primary",
        bg: "bg-primary/5",
        border: "border-primary/10",
        label: "Stable",
        pulse: true,
      };
    case "observation":
      return {
        color: "text-amber-600",
        bg: "bg-amber-500/5",
        border: "border-amber-500/10",
        label: "Observation",
        pulse: false,
      };
    case "critical":
      return {
        color: "text-destructive",
        bg: "bg-destructive/5",
        border: "border-destructive/10",
        label: "Critique",
        pulse: true,
      };
    default:
      return {
        color: "text-muted-foreground",
        bg: "bg-muted",
        border: "border-border",
        label: status,
        pulse: false,
      };
  }
};

export default function PatientPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patientsData.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8faf9] pb-24 md:pb-6">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#e1e3e2]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2D9971] flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#191c1c]">Patients</h1>
              <p className="text-xs text-[#3e4943]">Gestion et suivi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative text-[#3e4943] hover:bg-[#eceeed]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full" />
            </Button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#2D9971]">
              <User className="w-full h-full p-1 text-[#2D9971]" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6 max-w-5xl mx-auto">
        {/* Search Bar */}
        <section className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e7a72]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un patient..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#bdcac1]/30 rounded-xl focus:ring-2 focus:ring-[#2D9971]/20 focus:border-[#2D9971] transition-all placeholder:text-[#6e7a72]/60 text-[#191c1c] shadow-sm"
          />
        </section>

        {/* Appointments to Confirm */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#191c1c]">Rendez-vous à confirmer</h2>
            <span className="bg-[#2D9971]/10 text-[#2D9971] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {appointmentsToConfirm.length} Nouveaux
            </span>
          </div>
          <div className="space-y-3">
            {appointmentsToConfirm.map((appointment) => (
              <Card key={appointment.id} className="bg-white border-[#bdcac1]/30 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#eceeed] flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-[#2D9971]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#191c1c]">
                          {appointment.patient}
                        </h4>
                        <p className="text-xs text-[#3e4943]">
                          {appointment.date} • {appointment.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="w-10 h-10 text-[#ba1a1a] hover:bg-[#ba1a1a]/5">
                        <X className="w-5 h-5" />
                      </Button>
                      <Button size="sm" className="h-10 bg-[#2D9971] hover:bg-[#2D9971]/90">
                        <Check className="w-4 h-4 mr-1" />
                        Confirmer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Patients List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#191c1c]">Patients gérés</h2>
            <Link href="/patients/add">
              <Button variant="ghost" size="sm" className="text-[#2D9971]">
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {filteredPatients.map((patient) => {
              const statusConfig = getStatusConfig(patient.status);

              return (
                <Card
                  key={patient.id}
                  className="bg-white border-[#bdcac1]/30 shadow-sm overflow-hidden rounded-2xl"
                >
                  {/* Patient Header */}
                  <div className="p-5 border-b border-[#eceeed] flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#e1e3e2]">
                        <img
                          src={patient.image}
                          alt={patient.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-[#191c1c]">
                          {patient.name}
                        </h3>
                        <p className="text-xs text-[#3e4943] mb-2">
                          ID: #{patient.id} • {patient.bloodType}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold ${statusConfig.color} ${statusConfig.bg} px-2 py-0.5 rounded-full uppercase border ${statusConfig.border}`}
                        >
                          {statusConfig.pulse && (
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          )}
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-[#6e7a72]">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-4 grid grid-cols-3 gap-2 bg-[#f2f4f3]/30">
                    <Link href={`/patient/analyses?patient=${patient.id}`}>
                      <Button
                        variant="outline"
                        className="w-full h-auto py-3 flex flex-col items-center gap-1 hover:border-[#2D9971] hover:text-[#2D9971] bg-white border-[#bdcac1]/20"
                      >
                        <TestTube2 className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase text-center leading-tight text-[#3e4943]">
                          Test Labo
                        </span>
                      </Button>
                    </Link>
                    <Link href={`/patient/analyses?patient=${patient.id}`}>
                      <Button
                        variant="outline"
                        className="w-full h-auto py-3 flex flex-col items-center gap-1 hover:border-[#2D9971] hover:text-[#2D9971] bg-white border-[#bdcac1]/20"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase text-center leading-tight text-[#3e4943]">
                          Résultats
                        </span>
                      </Button>
                    </Link>
                    <Link href={`/patient/factures?patient=${patient.id}`}>
                      <Button
                        variant="outline"
                        className="w-full h-auto py-3 flex flex-col items-center gap-1 hover:border-[#2D9971] hover:text-[#2D9971] bg-white border-[#bdcac1]/20 relative"
                      >
                        <CreditCard className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase text-center leading-tight text-[#3e4943]">
                          Facturation
                        </span>
                        {patient.hasUnpaidBill && (
                          <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full" />
                        )}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Latest Analyses Preview */}
        <section className="space-y-3 pb-8">
          <h2 className="text-lg font-bold text-[#191c1c] px-1">Dernières Analyses</h2>
          <div className="space-y-3">
            <Card className="bg-white border-[#bdcac1]/20 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#90f6c8] flex items-center justify-center">
                    <TestTube2 className="w-5 h-5 text-[#191c1c]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-[#191c1c]">
                        Hémogramme Complet
                      </h4>
                      <span className="text-[10px] font-bold text-[#2D9971] px-2 py-0.5 bg-[#2D9971]/5 rounded border border-[#2D9971]/20">
                        PRÊT
                      </span>
                    </div>
                    <p className="text-xs text-[#3e4943]">
                      Eleanor Vance • 12.500 FCFA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#bdcac1]/20 shadow-sm opacity-70">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#e6e9e8] flex items-center justify-center">
                    <TestTube2 className="w-5 h-5 text-[#6e7a72]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-[#191c1c]">
                        Bilan Cardiaque
                      </h4>
                      <span className="text-[10px] font-bold text-[#6e7a72] px-2 py-0.5 bg-[#eceeed] rounded border border-[#6e7a72]/20">
                        EN COURS
                      </span>
                    </div>
                    <p className="text-xs text-[#3e4943]">
                      Arthur Vance • 25.000 FCFA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
