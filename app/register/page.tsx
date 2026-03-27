'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissionsContext } from '@/contexts/permissions-context';
import { GlassCard, Button } from "@/components/UI"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import { Activity, Shield, Lock, User, Mail, IdCard } from 'lucide-react';
import { motion } from 'motion/react';

import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

export default function RegisterPage() {

    const { refreshPermissions } = usePermissionsContext();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (AuthClientService.isAuthenticated()) {
            router.push('/dashboard');
        }
    }, [router]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);
        const health_id = formData.get('health_id') as string;
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirm_password') as string;

        // Validation
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        startTransition(async () => {
            try {
                await AuthClientService.register(health_id, name, email, password);

                // Rafraîchir les permissions après l'inscription
                await refreshPermissions();

                router.push('/dashboard');
                router.refresh();
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue lors de l\'inscription.');
            }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative">
            <div className="noise" />

            {/* Background decorative element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vital-green/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-vital-green flex items-center justify-center vital-glow mb-6">
                        <Activity className="text-medical-bg w-10 h-10" />
                    </div>
                    <h1 className="font-display font-bold text-3xl tracking-tight">
                        CS<span className="text-vital-green">DMP</span>
                    </h1>
                    <p className="text-medical-muted mt-2">Créez votre espace santé sécurisé</p>
                </div>

                <GlassCard className="p-8 border-vital-green/20">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Inscription</h2>
                        <Link href="/login" className="text-xs text-vital-green hover:underline">
                            Déjà un compte ?
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="health_id" className="text-xs text-medical-muted uppercase tracking-wider">Health ID</Label>
                            <div className="relative">
                                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-medical-muted" />
                                <Input
                                    id="health_id"
                                    name="health_id"
                                    type="text"
                                    placeholder="ID Hospitalier"
                                    required
                                    disabled={isPending}
                                    className="bg-medical-bg/50 border-white/10 h-12 pl-11 rounded-xl focus:border-vital-green/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs text-medical-muted uppercase tracking-wider">Nom complet</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-medical-muted" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Dr. Jean Dupont"
                                    required
                                    disabled={isPending}
                                    className="bg-medical-bg/50 border-white/10 h-12 pl-11 rounded-xl focus:border-vital-green/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs text-medical-muted uppercase tracking-wider">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-medical-muted" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="jean.dupont@hopital.fr"
                                    required
                                    disabled={isPending}
                                    className="bg-medical-bg/50 border-white/10 h-12 pl-11 rounded-xl focus:border-vital-green/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs text-medical-muted uppercase tracking-wider">Mot de passe</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                disabled={isPending}
                                className="bg-medical-bg/50 border-white/10 h-12 rounded-xl focus:border-vital-green/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm_password" className="text-xs text-medical-muted uppercase tracking-wider">Confirmer le mot de passe</Label>
                            <Input
                                id="confirm_password"
                                name="confirm_password"
                                type="password"
                                placeholder="••••••••"
                                required
                                disabled={isPending}
                                className="bg-medical-bg/50 border-white/10 h-12 rounded-xl focus:border-vital-green/50"
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-sm text-red-400 text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20"
                            >
                                {error}
                            </motion.p>
                        )}

                        <Button type="submit" className="w-full py-6 text-lg" disabled={isPending}>
                            {isPending ? "Inscription en cours..." : "S'inscrire"}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <p className="text-xs text-medical-muted">
                            En vous inscrivant, vous acceptez nos{" "}
                            <Link href="/terms" className="text-vital-green hover:underline">
                                Conditions d'utilisation
                            </Link>{" "}
                            et notre{" "}
                            <Link href="/privacy" className="text-vital-green hover:underline">
                                Politique de confidentialité
                            </Link>
                        </p>
                    </div>

                    <p className="mt-8 text-center text-[10px] text-medical-muted flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" />
                        Chiffrement de bout en bout AES-256 activé
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    );
}
