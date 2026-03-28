'use client';

import { useState, useTransition } from 'react';
import { Button } from "@/components/UI"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import { Activity, Shield, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);
        const health_id = formData.get('health_id') as string;
        const password = formData.get('password') as string;

        startTransition(async () => {
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ health_id, password }),
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Identifiants invalides');
                }

                // Attendre que le navigateur traite les cookies Set-Cookie
                // Utiliser un délai court mais suffisant
                await new Promise(resolve => setTimeout(resolve, 500));

                // Navigation complète pour que le middleware puisse vérifier le cookie
                window.location.href = '/dashboard';
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue lors de la connexion.');
            }
        });
    }

    return (
        <div className="min-h-screen flex relative bg-background">
            {/* Panneau de session à gauche - visible sur tablette et desktop */}
            <div className="hidden md:flex md:w-2/5 bg-vital-green flex-col justify-between p-12 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-vital-green/90 to-vital-green/70" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-[80px]" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-[80px]" />

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-medical-bg flex items-center justify-center shadow-lg">
                            <Activity className="text-vital-green w-8 h-8" />
                        </div>
                        <h1 className="font-display font-bold text-3xl tracking-tight text-medical-bg">
                            CS<span className="text-medical-bg/70">DMP</span>
                        </h1>
                    </div>

                    <div className="space-y-8 mt-12">
                        <div>
                            <h2 className="text-4xl font-bold text-medical-bg mb-4">
                                Votre dossier médical<br/>numérique sécurisé
                            </h2>
                            <p className="text-medical-bg/80 text-lg leading-relaxed">
                                Accédez à vos informations de santé en toute sécurité,
                                où que vous soyez, à tout moment.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-medical-bg/20 flex items-center justify-center flex-shrink-0">
                                    <Shield className="text-medical-bg w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-medical-bg mb-1">Sécurité maximale</h3>
                                    <p className="text-medical-bg/70 text-sm">Chiffrement AES-256 et authentification forte pour protéger vos données</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-medical-bg/20 flex items-center justify-center flex-shrink-0">
                                    <Activity className="text-medical-bg w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-medical-bg mb-1">Suivi en temps réel</h3>
                                    <p className="text-medical-bg/70 text-sm">Consultez vos résultats, rendez-vous et historiques médicaux</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-medical-bg/20 flex items-center justify-center flex-shrink-0">
                                    <Lock className="text-medical-bg w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-medical-bg mb-1">Confidentialité garantie</h3>
                                    <p className="text-medical-bg/70 text-sm">Vos données restent privées et conformes RGPD</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-medical-bg/60 text-sm">
                        <Lock className="w-4 h-4" />
                        <span>Plateforme certifiée HDS - Données hébergées au Bénin</span>
                    </div>
                </div>
            </div>

            {/* Partie droite - Formulaire de connexion */}
            <div className="md:w-3/5 w-full flex items-center justify-center p-8 lg:p-12 relative bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-vital-green flex items-center justify-center shadow-lg mb-4">
                        <Activity className="text-white w-8 h-8" />
                    </div>
                    <h1 className="font-display font-bold text-2xl tracking-tight text-foreground">
                        CS<span className="text-vital-green">DMP</span>
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">Accès sécurisé à votre espace santé</p>
                </div>

                <div className="bg-white border border-border shadow-xl rounded-2xl p-6 lg:p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-foreground">Connexion</h2>
                        <Link href="/" className="text-xs text-vital-green hover:underline">
                            Retour à l'accueil
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="health_id" className="text-xs text-muted-foreground uppercase tracking-wider">Health ID</Label>
                            <Input
                                id="health_id"
                                name="health_id"
                                type="text"
                                placeholder="ID Hospitalier"
                                required
                                disabled={isPending}
                                className="bg-background border border-border h-12 rounded-xl focus:border-vital-green/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs text-muted-foreground uppercase tracking-wider">Mot de passe</Label>
                                <a href="#" className="text-xs text-muted-foreground hover:text-vital-green transition-colors">
                                    Oublié ?
                                </a>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                disabled={isPending}
                                className="bg-background border border-border h-12 rounded-xl focus:border-vital-green/50"
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-sm text-red-500 text-center bg-red-50 py-2 rounded-lg border border-red-200"
                            >
                                {error}
                            </motion.p>
                        )}

                        <Button type="submit" className="w-full py-2 text-sm" disabled={isPending}>
                            {isPending ? "Authentification..." : "Se connecter"}
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-border text-center">
                        <p className="text-sm text-muted-foreground">
                            Pas encore de compte ?{" "}
                            <Link href="/register" className="text-vital-green font-bold hover:underline">
                                S'inscrire
                            </Link>
                        </p>
                    </div>

                    <p className="mt-8 text-center text-[10px] text-muted-foreground flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" />
                        Chiffrement de bout en bout AES-256 activé
                    </p>
                </div>
            </motion.div>
            </div>
        </div>
    );
}