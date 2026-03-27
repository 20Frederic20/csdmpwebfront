'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/patient/bottom-nav";
import {
  CreditCard,
  User,
  Bell,
  Filter,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import Link from "next/link";

// Données factices - à remplacer par des appels API
const facturesData = [
  {
    id: "INV-2023-08-012",
    service: "Consultation cardiologie",
    doctor: "Dr. Martin",
    amount: "160.000 FCFA",
    status: "unpaid",
    date: "20 Jan 2024",
    dueDate: "27 Jan 2024",
  },
  {
    id: "INV-2023-08-011",
    service: "Bilan sanguin complet",
    doctor: "Labo Central",
    amount: "45.000 FCFA",
    status: "paid",
    date: "15 Jan 2024",
    paidDate: "16 Jan 2024",
  },
  {
    id: "INV-2023-08-010",
    service: "Radiographie pulmonaire",
    doctor: "Centre Imagerie",
    amount: "35.000 FCFA",
    status: "paid",
    date: "10 Jan 2024",
    paidDate: "10 Jan 2024",
  },
  {
    id: "INV-2023-08-009",
    service: "Consultation généraliste",
    doctor: "Dr. Dupont",
    amount: "25.000 FCFA",
    status: "overdue",
    date: "01 Jan 2024",
    dueDate: "08 Jan 2024",
  },
];

const stats = {
  total: facturesData.length,
  unpaid: facturesData.filter((f) => f.status === "unpaid" || f.status === "overdue").length,
  paid: facturesData.filter((f) => f.status === "paid").length,
  totalUnpaidAmount: "185.000 FCFA",
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "paid":
      return {
        icon: CheckCircle,
        color: "text-[#2D9971]",
        bg: "bg-[#2D9971]/10",
        label: "Payée",
      };
    case "unpaid":
      return {
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-500/10",
        label: "À payer",
      };
    case "overdue":
      return {
        icon: AlertCircle,
        color: "text-[#ba1a1a]",
        bg: "bg-[#ba1a1a]/10",
        label: "En retard",
      };
    default:
      return {
        icon: Clock,
        color: "text-[#6e7a72]",
        bg: "bg-[#eceeed]",
        label: status,
      };
  }
};

export default function PatientFacturesPage() {
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
              <h1 className="text-lg font-bold text-[#191c1c]">Factures</h1>
              <p className="text-xs text-[#3e4943]">Historique et paiements</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-[#3e4943] hover:bg-[#eceeed]">
              <Filter className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative text-[#3e4943] hover:bg-[#eceeed]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Stats Summary */}
        <section className="grid grid-cols-2 gap-3">
          <Card className="bg-white border-[#bdcac1]/30 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#ba1a1a]/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-[#ba1a1a]" />
                </div>
                <div>
                  <p className="text-xs text-[#3e4943]">À payer</p>
                  <p className="text-lg font-bold text-[#ba1a1a]">{stats.unpaid}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#bdcac1]/30 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#2D9971]/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#2D9971]" />
                </div>
                <div>
                  <p className="text-xs text-[#3e4943]">Payées</p>
                  <p className="text-lg font-bold text-[#2D9971]">{stats.paid}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Total Amount Card */}
        <Card className="bg-gradient-to-br from-[#2D9971]/10 to-[#2D9971]/5 border-[#2D9971]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#3e4943] mb-1">Total à payer</p>
                <p className="text-3xl font-bold text-[#191c1c]">{stats.totalUnpaidAmount}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-[#2D9971] flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Factures List */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#191c1c]">Toutes les factures</h2>
          <div className="space-y-3">
            {facturesData.map((facture) => {
              const statusConfig = getStatusConfig(facture.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card
                  key={facture.id}
                  className="bg-white border-[#bdcac1]/30 shadow-sm transition-all hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-lg ${statusConfig.bg} flex items-center justify-center shrink-0`}>
                          <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-[#191c1c] truncate max-w-full">
                              {facture.service}
                            </h3>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded whitespace-nowrap ${statusConfig.bg} ${statusConfig.color}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-xs text-[#3e4943] truncate">
                            {facture.id} • {facture.doctor}
                          </p>
                          <p className="text-xs text-[#3e4943]">
                            {facture.date}
                            {facture.dueDate && <span className="hidden sm:inline"> • Échéance: {facture.dueDate}</span>}
                            {facture.paidDate && <span className="hidden sm:inline"> • Payée le: {facture.paidDate}</span>}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end gap-2">
                        <p className="font-bold text-[#191c1c] text-sm whitespace-nowrap">
                          {facture.amount}
                        </p>
                        <div className="flex flex-col gap-1">
                          {facture.status === "unpaid" || facture.status === "overdue" ? (
                            <Link href={`/patient/factures/${facture.id}/payer`}>
                              <Button size="sm" className="w-full bg-[#2D9971] hover:bg-[#2D9971]/90 text-xs h-8 px-3">
                                Payer
                              </Button>
                            </Link>
                          ) : (
                            <div className="flex gap-1">
                              <Button variant="outline" size="icon" className="w-7 h-7 border-[#bdcac1]/30">
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="outline" size="icon" className="w-7 h-7 border-[#bdcac1]/30">
                                <Download className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
