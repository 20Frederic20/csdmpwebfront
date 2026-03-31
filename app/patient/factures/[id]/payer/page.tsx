'use client';

import { useState } from "react";
import { BottomNav } from "@/components/patient/bottom-nav";
import { GlassCard, Button } from "@/components/UI";
import {
  User,
  Bell,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Smartphone,
  Banknote,
  Info
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Données factices - à remplacer par un appel API basé sur l'ID
const factureData = {
  id: "INV-2023-08-012",
  patient: "Arthur Vance",
  service: "Consultation cardiologie",
  amount: "160.000 FCFA",
  date: "20 Jan 2024",
};

type PaymentMethod = "cash" | "momo" | "card";

export default function PatientPaiementPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [reference, setReference] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentMethod) {
      toast.error("Veuillez sélectionner un mode de paiement");
      return;
    }

    if ((paymentMethod === "momo" || paymentMethod === "card") && !reference) {
      toast.error("Veuillez entrer la référence de transaction");
      return;
    }

    setIsProcessing(true);

    // Simulation d'envoi - à remplacer par un appel API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Paiement confirmé avec succès !");
    setIsProcessing(false);
    router.push("/patient/factures");
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] pb-24 md:pb-6">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#e1e3e2]">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/patient/factures">
            <button className="p-2 rounded-full hover:bg-[#2D9971]/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#2D9971]" />
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2D9971]/10 flex items-center justify-center overflow-hidden border border-[#2D9971]/20">
              <User className="w-5 h-5 text-[#2D9971]" />
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-[#2D9971]/10 transition-colors relative">
            <Bell className="w-5 h-5 text-[#2D9971]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-[#191c1c]">Régler la facture</h1>
          <p className="text-sm text-[#3e4943]">
            Finalisez votre paiement de manière sécurisée
          </p>
        </div>

        {/* Facture Summary */}
        <Card className="bg-white border-[#bdcac1]/30 shadow-sm relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D9971]/5 rounded-bl-full -mr-8 -mt-8" />

          <CardContent className="space-y-4 relative">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a72] mb-1">
                ID Facture
              </p>
              <p className="text-lg font-bold text-[#191c1c]">{factureData.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a72] mb-1">
                  Patient
                </p>
                <p className="text-sm font-medium text-[#191c1c]">{factureData.patient}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a72] mb-1">
                  Service
                </p>
                <p className="text-sm font-medium text-[#191c1c]">{factureData.service}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#bdcac1]/30">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a72] mb-1">
                Montant Total
              </p>
              <p className="text-3xl font-extrabold text-[#2D9971]">
                {factureData.amount}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Selection */}
        <section className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a72]">
            Mode de Paiement
          </p>
          <div className="grid grid-cols-3 gap-3">
            {/* Cash */}
            <button
              type="button"
              onClick={() => setPaymentMethod("cash")}
              className={cn(
                "p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2",
                paymentMethod === "cash"
                  ? "border-[#2D9971] bg-[#2D9971]/10 shadow-[0_0_16px_rgba(45,153,113,0.2)]"
                  : "border-[#bdcac1]/30 bg-white hover:border-[#2D9971]/50"
              )}
            >
              <Banknote
                className={cn(
                  "w-8 h-8 transition-colors",
                  paymentMethod === "cash" ? "text-[#2D9971]" : "text-[#6e7a72]"
                )}
              />
              <span className={cn(
                "text-xs font-bold",
                paymentMethod === "cash" ? "text-[#2D9971]" : "text-[#191c1c]"
              )}>Espèces</span>
            </button>

            {/* Mobile Money */}
            <button
              type="button"
              onClick={() => setPaymentMethod("momo")}
              className={cn(
                "p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2",
                paymentMethod === "momo"
                  ? "border-[#2D9971] bg-[#2D9971]/10 shadow-[0_0_16px_rgba(45,153,113,0.2)]"
                  : "border-[#bdcac1]/30 bg-white hover:border-[#2D9971]/50"
              )}
            >
              <Smartphone
                className={cn(
                  "w-8 h-8 transition-colors",
                  paymentMethod === "momo" ? "text-[#2D9971]" : "text-[#6e7a72]"
                )}
              />
              <span className={cn(
                "text-xs font-bold",
                paymentMethod === "momo" ? "text-[#2D9971]" : "text-[#191c1c]"
              )}>Mobile Money</span>
            </button>

            {/* Credit Card */}
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={cn(
                "p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2",
                paymentMethod === "card"
                  ? "border-[#2D9971] bg-[#2D9971]/10 shadow-[0_0_16px_rgba(45,153,113,0.2)]"
                  : "border-[#bdcac1]/30 bg-white hover:border-[#2D9971]/50"
              )}
            >
              <CreditCard
                className={cn(
                  "w-8 h-8 transition-colors",
                  paymentMethod === "card" ? "text-[#2D9971]" : "text-[#6e7a72]"
                )}
              />
              <span className={cn(
                "text-xs font-bold",
                paymentMethod === "card" ? "text-[#2D9971]" : "text-[#191c1c]"
              )}>Carte</span>
            </button>
          </div>
        </section>

        {/* Transaction Reference */}
        {(paymentMethod === "momo" || paymentMethod === "card") && (
          <section className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a72]">
                Référence du paiement
              </label>
              <div className="relative">
                <Input
                  id="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ex: TXN987654321"
                  className="pr-10 bg-white border-[#bdcac1]/30 text-[#191c1c] placeholder:text-[#6e7a72] focus:border-[#2D9971] focus:ring-[#2D9971]/20"
                />
                <Info className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7a72]" />
              </div>
              <p className="text-xs text-[#3e4943]">
                Entrez la référence de transaction fournie par votre opérateur
              </p>
            </div>
          </section>
        )}

        {/* Submit Button */}
        <section className="pt-4 space-y-3">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing || !paymentMethod}
            className="w-full h-12 text-base font-bold bg-[#2D9971] hover:bg-[#2D9971]/90"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Traitement en cours...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Confirmer le paiement
              </span>
            )}
          </Button>
          <p className="text-center text-xs text-[#3e4943]">
            Une confirmation vous sera envoyée par e-mail immédiatement après validation.
          </p>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
