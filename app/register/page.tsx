'use client';

import { useState, useTransition } from 'react';
import { Button } from "@/components/UI"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import { Activity, Shield, Lock, User, Mail, IdCard } from 'lucide-react';
import { motion } from 'motion/react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
        // Vérification côté serveur via middleware
        // Cette vérification client est limitée car les cookies HTTP-only ne sont pas lisibles
    }, []);

    const onSubmit = (data: RegisterFormValues) => {
        setError(null);
        startTransition(async () => {
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        health_id: data.health_id,
                        given_name: data.given_name,
                        family_name: data.family_name,
                        email: data.email,
                        password: data.password,
                        birth_date: data.birth_date,
                        gender: data.gender,
                        location: data.location,
                        blood_group: data.blood_group || undefined,
                    }),
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Erreur lors de l\'inscription');
                }

                // Attendre que le navigateur traite les cookies Set-Cookie
                await new Promise(resolve => setTimeout(resolve, 500));

                // Navigation complète pour que le middleware puisse vérifier le cookie
                window.location.href = '/dashboard';
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue lors de l\'inscription.');
            }
        });
    }

    return (
        <div className="min-h-screen flex relative bg-medical-bg">
            <div className="noise" />

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
                                Rejoignez la plateforme<br/>de santé numérique
                            </h2>
                            <p className="text-medical-bg/80 text-lg leading-relaxed">
                                Créez votre compte gratuitement et accédez à tous vos
                                outils de santé en un seul endroit.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-medical-bg/20 flex items-center justify-center flex-shrink-0">
                                    <Shield className="text-medical-bg w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-medical-bg mb-1">Compte sécurisé</h3>
                                    <p className="text-medical-bg/70 text-sm">Accès protégé à vos données médicales avec authentification forte</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-medical-bg/20 flex items-center justify-center flex-shrink-0">
                                    <User className="text-medical-bg w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-medical-bg mb-1">Profil personnalisé</h3>
                                    <p className="text-medical-bg/70 text-sm">Groupe sanguin, antécédents, traitements - tout votre historique</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-medical-bg/20 flex items-center justify-center flex-shrink-0">
                                    <Activity className="text-medical-bg w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-medical-bg mb-1">Suivi complet</h3>
                                    <p className="text-medical-bg/70 text-sm">Consultations, examens, ordonnances - centralisez votre parcours</p>
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

            {/* Partie droite - Formulaire d'inscription */}
            <div className="md:w-3/5 w-full flex items-center justify-center p-8 lg:p-12 relative bg-white overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg"
                >
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-vital-green flex items-center justify-center shadow-lg mb-4">
                        <Activity className="text-white w-8 h-8" />
                    </div>
                    <h1 className="font-display font-bold text-2xl tracking-tight">
                        CS<span className="text-vital-green">DMP</span>
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">Créez votre espace santé sécurisé</p>
                </div>

                <div className="w-full">
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

                        <Button type="submit" className="w-full py-2 text-sm mt-4" disabled={isPending}>
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

                    <p className="mt-6 text-center text-[10px] text-muted-foreground flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" />
                        Chiffrement de bout en bout AES-256 activé
                    </p>
                </div>
            </motion.div>
            </div>
        </div>
    );
}
