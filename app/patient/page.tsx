'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/patient/bottom-nav";
import {
  Calendar,
  FileText,
  CreditCard,
  Bell,
  User,
  ChevronRight,
  Activity,
  TestTube2
} from "lucide-react";
import Link from "next/link";

// Données factices pour l'exemple - à remplacer par des appels API
const patientData = {
  name: "Arthur Vance",
  nextAppointment: {
    date: "Demain à 09:30",
    type: "Consultation cardiologie",
    doctor: "Dr. Martin",
  },
  recentAnalyses: [
    {
      id: 1,
      name: "Hémogramme Complet",
      date: "15 Jan 2024",
      status: "ready",
      price: "12.500 FCFA",
    },
    {
      id: 2,
      name: "Bilan Cardiaque",
      date: "10 Jan 2024",
      status: "pending",
      price: "25.000 FCFA",
    },
    {
      id: 3,
      name: "Analyse d'urine",
      date: "08 Jan 2024",
      status: "ready",
      price: "8.000 FCFA",
    },
  ],
  recentInvoices: [
    {
      id: "INV-2023-08-012",
      service: "Consultation cardiologie",
      amount: "160.000 FCFA",
      status: "unpaid",
      date: "20 Jan 2024",
    },
    {
      id: "INV-2023-08-011",
      service: "Bilan sanguin",
      amount: "45.000 FCFA",
      status: "paid",
      date: "15 Jan 2024",
    },
  ],
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ready":
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded border border-primary/20 uppercase">
          Prêt
        </span>
      );
    case "pending":
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-600 rounded border border-amber-500/20 uppercase">
          En cours
        </span>
      );
    case "paid":
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded border border-primary/20 uppercase">
          Payée
        </span>
      );
    case "unpaid":
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-destructive/10 text-destructive rounded border border-destructive/20 uppercase">
          Impayée
        </span>
      );
    default:
      return null;
  }
};

export default function PatientDashboardPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] pb-24 md:pb-6">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#e1e3e2]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2D9971]/10 flex items-center justify-center overflow-hidden">
              <User className="w-5 h-5 text-[#2D9971]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#191c1c]">
                Bonjour, {patientData.name.split(" ")[0]}
              </h1>
              <p className="text-xs text-[#3e4943]">
                Votre espace santé
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative text-[#3e4943] hover:bg-[#eceeed]">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Quick Stats */}
        <section className="grid grid-cols-2 gap-3">
          <Card className="bg-white border-[#bdcac1]/30 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2D9971]/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#2D9971]" />
              </div>
              <div>
                <p className="text-xs text-[#3e4943]">Prochain RDV</p>
                <p className="text-sm font-bold text-[#191c1c]">
                  {patientData.nextAppointment.date.split(" ")[0]}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#bdcac1]/30 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2D9971]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#2D9971]" />
              </div>
              <div>
                <p className="text-xs text-[#3e4943]">Analyses</p>
                <p className="text-sm font-bold text-[#191c1c]">
                  {patientData.recentAnalyses.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Next Appointment */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#191c1c]">Prochain rendez-vous</h2>
          </div>
          <Card className="bg-white border-[#bdcac1]/30 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#2D9971]/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-[#2D9971]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#191c1c]">
                      {patientData.nextAppointment.type}
                    </p>
                    <p className="text-sm text-[#3e4943]">
                      {patientData.nextAppointment.date} • {patientData.nextAppointment.doctor}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-[#3e4943] hover:bg-[#eceeed]">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Analyses */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#191c1c]">Dernières analyses</h2>
            <Link href="/patient/analyses" className="text-sm text-[#2D9971] font-medium hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="space-y-2">
            {patientData.recentAnalyses.map((analysis) => (
              <Card key={analysis.id} className="bg-white border-[#bdcac1]/30 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#2D9971]/10 flex items-center justify-center">
                        <TestTube2 className="w-5 h-5 text-[#2D9971]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#191c1c] text-sm">
                          {analysis.name}
                        </p>
                        <p className="text-xs text-[#3e4943]">
                          {analysis.date} • {analysis.price}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(analysis.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Invoices */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#191c1c]">Factures récentes</h2>
            <Link href="/patient/factures" className="text-sm text-[#2D9971] font-medium hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="space-y-2">
            {patientData.recentInvoices.map((invoice) => (
              <Card key={invoice.id} className="bg-white border-[#bdcac1]/30 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[#191c1c] text-sm">
                          {invoice.service}
                        </p>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-xs text-[#3e4943]">
                        {invoice.id} • {invoice.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#191c1c]">
                        {invoice.amount}
                      </p>
                      {invoice.status === "unpaid" && (
                        <Link href={`/patient/factures/${invoice.id}/payer`}>
                          <Button size="xs" variant="default" className="bg-[#2D9971] hover:bg-[#2D9971]/90">
                            Payer
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
