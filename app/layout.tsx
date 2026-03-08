import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PermissionsProvider } from "@/contexts/permissions-context";
import { QueryProvider } from "@/contexts/query-provider";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CSDMP - Carnet de Santé et Dossier Médical Patient",
  description: "CSDMP : Votre Carnet de Santé Complet. Suivez parcours patients, coordonnez équipes et traitez données en toute sécurité. Solution centralisée pour la gestion moderne des soins de santé.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PermissionsProvider>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </PermissionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
