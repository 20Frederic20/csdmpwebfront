"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
                <p className="text-muted-foreground">
                    Gérez les préférences de votre application et de votre compte.
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Préférences Générales</CardTitle>
                        <CardDescription>
                            Configurez les paramètres généraux de l'interface.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Notifications par email</Label>
                                <p className="text-sm text-muted-foreground">
                                    Recevoir des alertes pour les événements importants.
                                </p>
                            </div>
                            <Switch disabled />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Mode hors-ligne sync</Label>
                                <p className="text-sm text-muted-foreground">
                                    Synchroniser les données en arrière-plan (Bientôt disponible)
                                </p>
                            </div>
                            <Switch disabled />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Sécurité</CardTitle>
                        <CardDescription>
                            (En construction) Options avancées de sécurité et sessions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-[150px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                            Module de sécurité en cours de développement...
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
