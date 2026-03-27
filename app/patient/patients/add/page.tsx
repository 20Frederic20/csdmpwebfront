'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/patient/bottom-nav";
import {
  User,
  Bell,
  ArrowLeft,
  Phone,
  Calendar,
  Droplet,
  Save,
  Info
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PatientAddPage() {
  const [selectedBloodType, setSelectedBloodType] = useState<string>("");

  return (
    <div className="min-h-screen bg-[#f8faf9] pb-24 md:pb-6">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#e1e3e2]">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/patient/patients">
            <button className="p-2 rounded-xl hover:bg-[#f2f4f3] transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#191c1c]" />
            </button>
          </Link>
          <h1 className="text-base font-bold text-[#191c1c]">Ajouter un Patient</h1>
          <div className="w-10 h-10 rounded-full bg-[#e6e9e8] flex items-center justify-center overflow-hidden">
            <User className="w-5 h-5 text-[#2D9971]" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-8 max-w-md mx-auto">
        {/* Section 01: Identité */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a72]">
              01. Identité
            </span>
          </div>
          <Card className="bg-white border-[#bdcac1]/30 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e4943]">
                  Nom
                </label>
                <Input
                  placeholder="Entrez le nom"
                  className="h-12 px-4 bg-[#f2f4f3] border-0 rounded-lg focus:ring-2 focus:ring-[#2D9971]/20 transition-all placeholder:text-[#6e7a72]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e4943]">
                  Prénom
                </label>
                <Input
                  placeholder="Entrez le prénom"
                  className="h-12 px-4 bg-[#f2f4f3] border-0 rounded-lg focus:ring-2 focus:ring-[#2D9971]/20 transition-all placeholder:text-[#6e7a72]/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e4943]">
                    Date de naissance
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      className="h-12 px-4 bg-[#f2f4f3] border-0 rounded-lg focus:ring-2 focus:ring-[#2D9971]/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e4943]">
                    Sexe
                  </label>
                  <select className="w-full h-12 px-4 bg-[#f2f4f3] border-0 rounded-lg focus:ring-2 focus:ring-[#2D9971]/20 transition-all text-[#191c1c]">
                    <option value="">Choisir</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 02: Contact */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a72]">
              02. Contact
            </span>
          </div>
          <Card className="bg-white border-[#bdcac1]/30 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e4943]">
                  Ville de résidence
                </label>
                <Input
                  placeholder="Ex: Douala"
                  className="h-12 px-4 bg-[#f2f4f3] border-0 rounded-lg focus:ring-2 focus:ring-[#2D9971]/20 transition-all placeholder:text-[#6e7a72]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e4943]">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e7a72]" />
                  <Input
                    type="tel"
                    placeholder="+237 6 00 00 00 00"
                    className="h-12 pl-12 pr-4 bg-[#f2f4f3] border-0 rounded-lg focus:ring-2 focus:ring-[#2D9971]/20 transition-all placeholder:text-[#6e7a72]/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 03: Informations de santé */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a72]">
              03. Informations de santé
            </span>
          </div>
          <Card className="bg-white border-[#bdcac1]/30 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e4943]">
                  Groupe Sanguin
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {bloodTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedBloodType(type)}
                      className={cn(
                        "h-10 border rounded-lg text-sm font-bold transition-all active:scale-95",
                        selectedBloodType === type
                          ? "bg-[#2D9971] text-white border-[#2D9971]"
                          : "border-[#bdcac1]/30 text-[#191c1c] hover:bg-[#2D9971]/10 hover:border-[#2D9971]"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 04: Contact d'urgence */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#97413f]">
              04. Contact d'urgence
            </span>
          </div>
          <Card className="bg-[#97413f]/5 border-[#97413f]/10">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#354a53]">
                  Nom du contact
                </label>
                <Input
                  placeholder="Nom complet"
                  className="h-12 px-4 bg-white border-0 rounded-lg focus:ring-2 focus:ring-[#97413f]/20 transition-all placeholder:text-[#6e7a72]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#354a53]">
                  Téléphone d'urgence
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e7a72]" />
                  <Input
                    type="tel"
                    placeholder="+237 6 00 00 00 00"
                    className="h-12 pl-12 pr-4 bg-white border-0 rounded-lg focus:ring-2 focus:ring-[#97413f]/20 transition-all placeholder:text-[#6e7a72]/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Submit Button */}
        <section className="pt-6 pb-12 space-y-4">
          <Button className="w-full h-14 bg-[#2D9971] hover:bg-[#2D9971]/90 text-white font-bold rounded-xl shadow-lg shadow-[#2D9971]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            <span>Enregistrer le patient</span>
          </Button>
          <p className="text-center text-[10px] text-[#6e7a72] font-bold uppercase tracking-widest">
            Confidentialité médicale garantie • CSDMP
          </p>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
