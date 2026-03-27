'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Stethoscope,
  Calendar,
  IdCard
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const professions = [
  "Médecin Généraliste",
  "Médecin Spécialiste",
  "Infirmier(ère)",
  "Laborantin(e)",
  "Radiologue",
  "Pharmacien(ne)",
  "Administrateur",
  "Autre"
];

export default function InscriptionPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState<string>("");

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[#e1e3e2]">
        <div className="flex items-center justify-between px-4 md:px-6 h-16 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2D9971]/10 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-[#2D9971]" />
            </div>
            <span className="text-[#2D9971] font-bold tracking-tighter text-lg">CSDMP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#3e4943] hidden sm:inline">Déjà un compte ?</span>
            <Link href="/patient/connexion">
              <Button variant="outline" className="border-[#2D9971] text-[#2D9971] hover:bg-[#2D9971]/10 text-xs sm:text-sm">
                Connexion
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 md:px-6 max-w-5xl mx-auto">
        {/* Hero Section */}
        <section className="mb-8 md:mb-12">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-extrabold text-[#191c1c] mb-2 md:mb-4">
              Créez votre compte CSDMP
            </h1>
            <p className="text-sm md:text-base text-[#3e4943]">
              Rejoignez notre plateforme de gestion médicale et accédez à tous vos outils en un seul endroit.
            </p>
          </div>
        </section>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 01: Informations personnelles */}
            <Card className="bg-white border-[#bdcac1]/30 shadow-sm">
              <CardContent className="p-4 md:p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#2D9971]/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#2D9971]" />
                  </div>
                  <h2 className="text-base md:text-lg font-bold text-[#191c1c]">
                    01. Informations personnelles
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e4943]">
                      Nom complet
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7a72]" />
                      <Input
                        placeholder="Votre nom"
                        className="h-12 pl-10 pr-4 bg-[#f2f4f3] border-0 rounded-lg focus:ring-2 focus:ring-[#2D9971]/20 transition-all placeholder:text-[#6e7a72]/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e4943]">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7a72]" />
                      <Input
                        type="email"
                        placeholder="votre@email.com"
                        className="h-12 pl-10 pr-4 bg-[#f2f4f3] border-0 rounded-lg focus:ring-2 focus:ring-[#2D9971]/20 transition-all placeholder:text-[#6e7a72]/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e4943]">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7a72]" />
                      <Input
                        type="tel"
                        placeholder="+237 6 00 00 00 00"
                        className="h-12 pl-10 pr-4 bg-[#f2f4f3] border-0 rounded-lg focus:ring-2 focus:ring-[#2D9971]/20 transition-all placeholder:text-[#6e7a72]/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e4943]">
                      Date de naissance
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7a72]" />
                      <Input
                        type="date"
                        className="h-12 pl-10 pr-4 bg-[#f2f4f3] border-0 rounded-lg focus:ring-2 focus:ring-[#2D9971]/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e4943]">
                    Profession
                  </label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7a72]" />
                    <select
                      value={selectedProfession}
                      onChange={(e) => setSelectedProfession(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 bg-[#f2f4f3] border-0 rounded-lg focus:ring-2 focus:ring-[#2D9971]/20 transition-all text-[#191c1c] appearance-none cursor-pointer"
                    >
                      <option value="">Sélectionnez votre profession</option>
                      {professions.map((prof) => (
                        <option key={prof} value={prof}>{prof}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 02: Sécurité */}
            <Card className="bg-white border-[#bdcac1]/30 shadow-sm">
              <CardContent className="p-4 md:p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#2D9971]/10 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-[#2D9971]" />
                  </div>
                  <h2 className="text-base md:text-lg font-bold text-[#191c1c]">
                    02. Sécurité du compte
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e4943]">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7a72]" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 8 caractères"
                        className="h-12 pl-10 pr-12 bg-[#f2f4f3] border-0 rounded-lg focus:ring-2 focus:ring-[#2D9971]/20 transition-all placeholder:text-[#6e7a72]/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e7a72] hover:text-[#191c1c] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3e4943]">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7a72]" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmez votre mot de passe"
                        className="h-12 pl-10 pr-12 bg-[#f2f4f3] border-0 rounded-lg focus:ring-2 focus:ring-[#2D9971]/20 transition-all placeholder:text-[#6e7a72]/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e7a72] hover:text-[#191c1c] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password requirements */}
                <div className="bg-[#f2f4f3] rounded-lg p-4 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#3e4943] mb-2">
                    Le mot de passe doit contenir :
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Au moins 8 caractères",
                      "Une majuscule",
                      "Une minuscule",
                      "Un chiffre"
                    ].map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#3e4943]">
                        <div className="w-4 h-4 rounded-full bg-[#e1e3e2] flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-[#6e7a72]" />
                        </div>
                        {req}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits Card */}
            <Card className="bg-[#2D9971] text-white shadow-lg">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold mb-4">Avantages du compte</h3>
                <ul className="space-y-3">
                  {[
                    "Gestion complète des patients",
                    "Accès aux résultats d'analyses",
                    "Suivi des factures et paiements",
                    "Tableau de bord familial",
                    "Notifications en temps réel"
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />
                      <span className="text-sm text-white/90">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="bg-[#97413f]/10 border-[#97413f]/20">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#97413f]/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#97413f]" />
                </div>
                <h4 className="font-bold text-[#97413f]">Besoin d'aide ?</h4>
                <p className="text-sm text-[#3e4943]">
                  Notre équipe est disponible pour vous accompagner dans la création de votre compte.
                </p>
                <Link href="/support" className="text-[#97413f] font-bold text-sm hover:underline">
                  Centre d'assistance →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <section className="mt-8 md:mt-12">
          <div className="max-w-2xl mx-auto space-y-4">
            <Button className="w-full h-14 bg-[#2D9971] hover:bg-[#2D9971]/90 text-white font-bold rounded-xl shadow-lg shadow-[#2D9971]/20 active:scale-[0.98] transition-all text-base md:text-lg">
              Créer mon compte
            </Button>
            <p className="text-center text-xs text-[#3e4943]">
              En créant un compte, vous acceptez nos{" "}
              <Link href="/conditions" className="text-[#2D9971] hover:underline font-medium">
                Conditions d'utilisation
              </Link>{" "}
              et notre{" "}
              <Link href="/confidentialite" className="text-[#2D9971] hover:underline font-medium">
                Politique de confidentialité
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
