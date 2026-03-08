"use client"

import { usePermissionsContext } from "@/contexts/permissions-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, User, Mail, Shield, Building, Key } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
    const { user, loading } = usePermissionsContext()
    const router = useRouter()

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Non connecté</h2>
                <p className="text-muted-foreground max-w-sm text-center">
                    Vous devez être connecté pour voir votre profil et accéder aux fonctionnalités de l'application.
                </p>
                <Button size="lg" onClick={() => router.push('/login')} className="mt-4">
                    Se connecter
                </Button>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profil Utilisateur</h1>
                <p className="text-muted-foreground">
                    Gérez vos informations personnelles et préférences.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations Personnelles</CardTitle>
                    <CardDescription>
                        Vos informations de base telles qu'elles apparaissent dans le système.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center border-b pb-6">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="text-3xl font-semibold uppercase">
                                {user.given_name?.[0]}{user.family_name?.[0]}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-semibold leading-none tracking-tight">
                                {user.given_name} {user.family_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="flex items-center text-sm font-medium text-muted-foreground">
                                <Mail className="mr-2 h-4 w-4" /> Email
                            </div>
                            <p className="text-sm font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-sm font-medium text-muted-foreground">
                                <Shield className="mr-2 h-4 w-4" /> Rôles
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {user.roles?.map((role, idx) => (
                                    <span key={idx} className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                                        {role}
                                    </span>
                                )) || <span className="text-sm">Aucun rôle</span>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-sm font-medium text-muted-foreground">
                                <Building className="mr-2 h-4 w-4" /> Établissement (ID)
                            </div>
                            <p className="text-sm font-medium">{user.health_facility_id || "Non spécifié"}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-sm font-medium text-muted-foreground">
                                <Key className="mr-2 h-4 w-4" /> Statut du compte
                            </div>
                            <p className="text-sm font-medium">
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.is_active !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                                    {user.is_active !== false ? "Actif" : "Inactif"}
                                </span>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
