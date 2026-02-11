'use client';

import { useState } from 'react';
import { StatCard } from "@/components/dashboard/stat-card";
import { Hospital, Users, Stethoscope, Calendar } from "lucide-react";

export default function Dashboard() {
  const [error, setError] = useState<string | null>(null);

  // Données mockées pour démonstration - à remplacer par des vraies données API
  const stats = {
    hospitals: 12,
    patients: 1248,
    doctors: 89,
    consultations: 342
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble des statistiques du système de santé
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Hôpitaux"
          value={stats.hospitals}
          icon={Hospital}
          description="Total des établissements"
        />
        
        <StatCard
          title="Patients"
          value={stats.patients}
          icon={Users}
          description="Patients enregistrés"
        />
        
        <StatCard
          title="Médecins"
          value={stats.doctors}
          icon={Stethoscope}
          description="Professionnels de santé"
        />
        
        <StatCard
          title="Consultations"
          value={stats.consultations}
          icon={Calendar}
          description="Consultations totales"
        />
      </div>
    </div>
  );
}