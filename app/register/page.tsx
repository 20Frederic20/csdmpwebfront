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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { AuthClientService } from '@/features/core/auth/services/auth-client.service';
import CustomSelect from "@/components/ui/custom-select";
import { cn } from "@/lib/utils";

const genderOptions = [
    { value: "male", label: "Homme" },
    { value: "female", label: "Femme" },
    { value: "other", label: "Autre" },
    { value: "unknown", label: "Inconnu" },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const registerSchema = z.object({
    health_id: z.string().min(1, "L'ID Hospitalier est requis"),
    email: z.string().email("Email invalide").min(1, "L'email est requis"),
    family_name: z.string().min(1, "Le nom est requis"),
    given_name: z.string().min(1, "Le prénom est requis"),
    birth_date: z.string().min(1, "La date de naissance est requise"),
    gender: z.string().min(1, "Le sexe est requis"),
    location: z.string().min(1, "La localisation est requise"),
    blood_group: z.string().optional(),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm_password"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { refreshPermissions } = usePermissionsContext();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors }
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            health_id: "",
            email: "",
            family_name: "",
            given_name: "",
            birth_date: "",
            gender: "",
            location: "",
            blood_group: "",
            password: "",
            confirm_password: "",
        }
    });

    const selectedBloodGroup = watch("blood_group");

    useEffect(() => {
        if (AuthClientService.isAuthenticated()) {
            router.push('/dashboard');
        }
    }, [router]);

    const onSubmit = (data: RegisterFormValues) => {
        setError(null);
        startTransition(async () => {
            try {
                await AuthClientService.register(
                    data.health_id,
                    data.given_name,
                    data.family_name,
                    data.email,
                    data.password,
                    data.birth_date,
                    data.gender,
                    data.location,
                    data.blood_group || undefined
                );

                await refreshPermissions();
                router.push('/dashboard');
                router.refresh();
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue lors de l\'inscription.');
            }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative bg-medical-bg">
            <div className="noise" />

            {/* Background decorative element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vital-green/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
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

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label htmlFor="health_id" className={cn("text-xs uppercase tracking-wider", errors.health_id ? "text-red-400" : "text-medical-muted")}>Health ID</Label>
                                <div className="relative">
                                    <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-medical-muted" />
                                    <Input
                                        id="health_id"
                                        {...register("health_id")}
                                        placeholder="ID Hospitalier"
                                        disabled={isPending}
                                        className={cn("bg-medical-bg/50 border-white/10 h-12 pl-11 rounded-xl focus:border-vital-green/50", errors.health_id && "border-red-400/50")}
                                    />
                                </div>
                                {errors.health_id && <p className="text-[10px] text-red-400 mt-1">{errors.health_id.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className={cn("text-xs uppercase tracking-wider", errors.email ? "text-red-400" : "text-medical-muted")}>Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-medical-muted" />
                                    <Input
                                        id="email"
                                        {...register("email")}
                                        type="email"
                                        placeholder="jean.dupont@hopital.fr"
                                        disabled={isPending}
                                        className={cn("bg-medical-bg/50 border-white/10 h-12 pl-11 rounded-xl focus:border-vital-green/50", errors.email && "border-red-400/50")}
                                    />
                                </div>
                                {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="family_name" className={cn("text-xs uppercase tracking-wider", errors.family_name ? "text-red-400" : "text-medical-muted")}>Nom</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-medical-muted" />
                                    <Input
                                        id="family_name"
                                        {...register("family_name")}
                                        placeholder="Dupont"
                                        disabled={isPending}
                                        className={cn("bg-medical-bg/50 border-white/10 h-12 pl-11 rounded-xl focus:border-vital-green/50", errors.family_name && "border-red-400/50")}
                                    />
                                </div>
                                {errors.family_name && <p className="text-[10px] text-red-400 mt-1">{errors.family_name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="given_name" className={cn("text-xs uppercase tracking-wider", errors.given_name ? "text-red-400" : "text-medical-muted")}>Prénom</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-medical-muted" />
                                    <Input
                                        id="given_name"
                                        {...register("given_name")}
                                        placeholder="Jean"
                                        disabled={isPending}
                                        className={cn("bg-medical-bg/50 border-white/10 h-12 pl-11 rounded-xl focus:border-vital-green/50", errors.given_name && "border-red-400/50")}
                                    />
                                </div>
                                {errors.given_name && <p className="text-[10px] text-red-400 mt-1">{errors.given_name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="birth_date" className={cn("text-xs uppercase tracking-wider", errors.birth_date ? "text-red-400" : "text-medical-muted")}>Date de naissance</Label>
                                <Input
                                    id="birth_date"
                                    {...register("birth_date")}
                                    type="date"
                                    disabled={isPending}
                                    className={cn("bg-medical-bg/50 border-white/10 h-12 rounded-xl focus:border-vital-green/50 px-4", errors.birth_date && "border-red-400/50")}
                                />
                                {errors.birth_date && <p className="text-[10px] text-red-400 mt-1">{errors.birth_date.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender" className={cn("text-xs uppercase tracking-wider", errors.gender ? "text-red-400" : "text-medical-muted")}>Sexe</Label>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomSelect
                                            options={genderOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Choisir"
                                            height="h-12"
                                            className={cn(errors.gender && "border-red-400/50")}
                                        />
                                    )}
                                />
                                {errors.gender && <p className="text-[10px] text-red-400 mt-1">{errors.gender.message}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="location" className={cn("text-xs uppercase tracking-wider", errors.location ? "text-red-400" : "text-medical-muted")}>Localisation</Label>
                                <Input
                                    id="location"
                                    {...register("location")}
                                    placeholder="Ville, Quartier"
                                    disabled={isPending}
                                    className={cn("bg-medical-bg/50 border-white/10 h-12 rounded-xl focus:border-vital-green/50 px-4", errors.location && "border-red-400/50")}
                                />
                                {errors.location && <p className="text-[10px] text-red-400 mt-1">{errors.location.message}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs text-medical-muted uppercase tracking-wider">Groupe Sanguin</Label>
                                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-1">
                                    {bloodGroups.map((bg) => (
                                        <button
                                            key={bg}
                                            type="button"
                                            onClick={() => setValue("blood_group", bg)}
                                            className={cn(
                                                "h-10 border rounded-lg text-sm font-medium transition-all active:scale-95",
                                                selectedBloodGroup === bg
                                                    ? "bg-vital-green text-medical-bg border-vital-green"
                                                    : "border-white/10 bg-medical-bg/30 text-medical-muted hover:bg-vital-green/10 hover:border-vital-green/50"
                                            )}
                                        >
                                            {bg}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className={cn("text-xs uppercase tracking-wider", errors.password ? "text-red-400" : "text-medical-muted")}>Mot de passe</Label>
                                <Input
                                    id="password"
                                    {...register("password")}
                                    type="password"
                                    placeholder="••••••••"
                                    disabled={isPending}
                                    className={cn("bg-medical-bg/50 border-white/10 h-12 rounded-xl focus:border-vital-green/50 px-4", errors.password && "border-red-400/50")}
                                />
                                {errors.password && <p className="text-[10px] text-red-400 mt-1">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm_password" className={cn("text-xs uppercase tracking-wider", errors.confirm_password ? "text-red-400" : "text-medical-muted")}>Confirmer le mot de passe</Label>
                                <Input
                                    id="confirm_password"
                                    {...register("confirm_password")}
                                    type="password"
                                    placeholder="••••••••"
                                    disabled={isPending}
                                    className={cn("bg-medical-bg/50 border-white/10 h-12 rounded-xl focus:border-vital-green/50 px-4", errors.confirm_password && "border-red-400/50")}
                                />
                                {errors.confirm_password && <p className="text-[10px] text-red-400 mt-1">{errors.confirm_password.message}</p>}
                            </div>
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

                        <Button type="submit" className="w-full py-7 text-lg mt-4" disabled={isPending}>
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
