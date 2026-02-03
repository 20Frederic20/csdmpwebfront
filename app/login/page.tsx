'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";

import { loginAction } from '@/features/core/auth/services/auth.service';
import { useLoginActions } from '@/hooks/use-login-actions';

export default function LoginPage() {

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const { handleLoginSuccess } = useLoginActions();
    
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            try {
                // Appeler le server action pour le cookie HttpOnly
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        health_id: formData.get('health_id'),
                        password: formData.get('password'),
                    }),
                });

                if (!response.ok) {
                    throw new Error('Invalid credentials');
                }

                const data = await response.json();
                
                // Gérer le succès côté client
                handleLoginSuccess(data.access_token);
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue lors de la connexion.');
            }
        });
    }
    return (
        <Card className="w-full max-w-md mx-auto my-36">
            <CardHeader>
                <CardTitle>Connexion à votre compte</CardTitle>
                <CardDescription>
                    Entrez votre email ci-dessous pour vous connecter
                </CardDescription>
                {/* CardAction n'existe pas dans la version standard actuelle de shadcn/ui → on le remplace par un div flex */}
                <div className="ml-auto">
                    <Button variant="link" asChild>
                        <Link href="/register">S'inscrire</Link>
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="text">Health ID</Label>
                            <Input
                                id="health_id"
                                name="health_id"           // ← important pour FormData
                                type="text"
                                placeholder="m@example.com"
                                required
                                disabled={isPending}
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Mot de passe</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-md underline-offset-4 hover:underline"
                                >
                                    Mot de passe oublié ?
                                </a>
                            </div>
                            <Input
                                id="password"
                                name="password"       // ← important pour FormData
                                type="password"
                                required
                                disabled={isPending}
                            />
                        </div>

                        {error && (
                            <p className="text-md text-destructive text-center">{error}</p>
                        )}
                    </div>

                    {/* Bouton submit placé ici pour être dans le <form> */}
                    <CardFooter className="flex flex-col gap-2 pt-6">
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Connexion en cours..." : "Se connecter"}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={isPending}
                        // À implémenter plus tard : Google OAuth via Server Action ou route handler
                        // onClick={() => router.push('/api/auth/google')}
                        >
                            Se connecter avec Google
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}