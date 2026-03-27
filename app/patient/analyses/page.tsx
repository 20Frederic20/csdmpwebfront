'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/patient/bottom-nav";
import {
  TestTube2,
  Download,
  Eye,
  Filter,
  Plus,
  User,
  Bell,
  AlertCircle,
  CheckCircle,
  Hourglass
} from "lucide-react";
import Link from "next/link";

// Données factices - à remplacer par des appels API
const analysesData = [
  {
    id: 1,
    name: "Bilan Sanguin Complet",
    description: "Bilan métabolique et profil lipidique",
    date: "24 Oct, 2023",
    status: "ready",
    icon: "bloodtype",
    canView: true,
    canDownload: true,
  },
  {
    id: 2,
    name: "Analyse d'urine",
    description: "Examen microscopique des urines",
    date: "26 Oct, 2023",
    status: "pending",
    icon: "science",
    canView: false,
    canDownload: false,
  },
  {
    id: 3,
    name: "Biopsie Pulmonaire",
    description: "Rapport d'anatomopathologie tissulaire",
    date: "18 Oct, 2023",
    status: "consulted",
    icon: "biotech",
    canView: true,
    canDownload: true,
  },
  {
    id: 4,
    name: "Électrocardiogramme (ECG)",
    description: "Surveillance cardiaque 12 dérivations",
    date: "12 Oct, 2023",
    status: "ready",
    icon: "ecg",
    canView: true,
    canDownload: true,
  },
];

const metrics = {
  pending: 2,
  ready: 14,
  critical: 1,
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "ready":
      return {
        badge: (
          <span className="px-3 py-1.5 rounded-full bg-[#2D9971]/10 text-[#2D9971] text-xs font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D9971]" />
            Disponible
          </span>
        ),
        iconBg: "bg-[#2D9971]/10",
        iconColor: "text-[#2D9971]",
      };
    case "pending":
      return {
        badge: (
          <span className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            En cours
          </span>
        ),
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-600",
      };
    case "consulted":
      return {
        badge: (
          <span className="px-3 py-1.5 rounded-full bg-[#eceeed] text-[#6e7a72] text-xs font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6e7a72]" />
            Consulté
          </span>
        ),
        iconBg: "bg-[#eceeed]",
        iconColor: "text-[#6e7a72]",
      };
    default:
      return {
        badge: null,
        iconBg: "bg-[#eceeed]",
        iconColor: "text-[#6e7a72]",
      };
  }
};

const getIconForAnalysis = (icon: string, iconBg: string, iconColor: string) => {
  switch (icon) {
    case "bloodtype":
      return (
        <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center`}>
          <TestTube2 className={`w-6 h-6 ${iconColor}`} />
        </div>
      );
    case "science":
      return (
        <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center`}>
          <TestTube2 className={`w-6 h-6 ${iconColor}`} />
        </div>
      );
    case "biotech":
      return (
        <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center`}>
          <TestTube2 className={`w-6 h-6 ${iconColor}`} />
        </div>
      );
    default:
      return (
        <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center`}>
          <TestTube2 className={`w-6 h-6 ${iconColor}`} />
        </div>
      );
  }
};

export default function PatientAnalysesPage() {
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
              <h1 className="text-lg font-bold text-[#191c1c]">Analyses</h1>
              <p className="text-xs text-[#3e4943]">Vos résultats de laboratoire</p>
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
        {/* Metrics Bento Grid */}
        <section className="grid grid-cols-3 gap-3">
          <Card className="bg-white border-[#bdcac1]/30 shadow-sm">
            <CardContent className="p-4">
              <Hourglass className="w-6 h-6 text-[#2D9971] mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#3e4943]">
                En attente
              </p>
              <p className="text-2xl font-bold text-[#191c1c]">{metrics.pending}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#bdcac1]/30 shadow-sm">
            <CardContent className="p-4">
              <CheckCircle className="w-6 h-6 text-[#2D9971] mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#3e4943]">
                Prêts
              </p>
              <p className="text-2xl font-bold text-[#191c1c]">{metrics.ready}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#bdcac1]/30 shadow-sm">
            <CardContent className="p-4">
              <AlertCircle className="w-6 h-6 text-[#ba1a1a] mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#3e4943]">
                Alertes
              </p>
              <p className="text-2xl font-bold text-[#ba1a1a]">{metrics.critical}</p>
            </CardContent>
          </Card>
        </section>

        {/* New Test CTA */}
        <Card className="bg-[#2D9971]/5 border-[#2D9971]/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D9971]/10 flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5 text-[#2D9971]" />
                </div>
                <div>
                  <h2 className="font-bold text-[#191c1c]">Nouvelle demande</h2>
                  <p className="text-xs text-[#3e4943]">
                    Soumettre une demande d'analyse à votre médecin
                  </p>
                </div>
              </div>
              <Button className="shrink-0 bg-[#2D9971] hover:bg-[#2D9971]/90">
                <Plus className="w-4 h-4 mr-1" />
                Demander
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analyses List */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#191c1c]">Toutes les analyses</h2>
          <div className="space-y-3">
            {analysesData.map((analysis) => {
              const statusConfig = getStatusConfig(analysis.status);

              return (
                <Card
                  key={analysis.id}
                  className="bg-white border-[#bdcac1]/30 shadow-sm transition-all hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {getIconForAnalysis(analysis.icon, statusConfig.iconBg, statusConfig.iconColor)}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#191c1c] truncate">
                          {analysis.name}
                        </h3>
                        <p className="text-xs text-[#3e4943] truncate">
                          {analysis.description}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {statusConfig.badge}
                        <p className="text-xs text-[#3e4943]">
                          {analysis.date}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 border-[#bdcac1]/30"
                            disabled={!analysis.canView}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 border-[#bdcac1]/30"
                            disabled={!analysis.canDownload}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
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
