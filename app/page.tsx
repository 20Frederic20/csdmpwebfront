"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Shield, 
  Users, 
  Calendar, 
  FileText, 
  Plus, 
  Search, 
  Bell, 
  LogOut, 
  Settings, 
  Stethoscope, 
  Heart,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Lock,
  User,
  Clock,
  Briefcase,
  UserCheck,
  ChevronDown,
  Database,
  Zap,
  LayoutDashboard,
  LogIn,
  UserCircle
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '../lib/utils';
import { GlassCard, Button, Badge } from '../components/UI';
import { MOCK_PATIENTS, MOCK_STAFF, Patient, Staff } from '../types';
import { useAuthToken } from '../hooks/use-auth-token';
import Link from 'next/link';

// --- Components ---

const Navbar = ({ onLoginClick, user, onLogout }: { onLoginClick: () => void, user: any, onLogout: () => void }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.href = '/'}>
        <div className="w-10 h-10 rounded-xl bg-vital-green flex items-center justify-center shadow-lg">
          <Activity className="text-white w-6 h-6" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-foreground">
          CS<span className="text-vital-green">DMP</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <a href="#" className="hover:text-vital-green transition-colors">Services</a>
        <a href="#" className="hover:text-vital-green transition-colors">Sécurité</a>
        <a href="#" className="hover:text-vital-green transition-colors">Hôpitaux</a>
        <a href="#" className="hover:text-vital-green transition-colors">À propos</a>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-card border border-border hover:border-vital-green/30 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-vital-green flex items-center justify-center font-bold text-xs text-white">
                {user.initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold leading-none text-foreground">{user.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{user.role}</p>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isDropdownOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border shadow-xl overflow-hidden z-[60]"
                >
                  <div className="p-2">
                    <Link href="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent rounded-xl transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                      Tableau de bord
                    </Link>
                    <Link href="/profile" className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent rounded-xl transition-colors">
                      <User className="w-4 h-4 text-muted-foreground" />
                      Profil
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => {
                        onLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Se déconnecter
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="outline" className="px-8 flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Connexion
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

const Hero = ({ onStart }: { onStart: () => void }) => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-background">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge>Santé Numérique, Sécurisée & Accessible</Badge>
          <h1 className="text-5xl md:text-8xl font-bold mt-6 leading-[1.1] tracking-tight text-foreground">
            Le Sanctuaire de vos <br />
            <span className="text-vital-green">Données Vitales</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Une gestion hospitalière réinventée. Un registre digital inspiré par le soin,
            propulsé par la technologie, dédié à la vie.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button onClick={onStart} className="px-10 py-4 text-lg">Découvrir le Prototype</Button>
            <button className="flex items-center gap-2 font-display font-medium hover:text-vital-green transition-colors group">
              Voir la vidéo de présentation
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-vital-green transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-vital-green/10 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
};

const LoginModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: (role: 'admin' | 'patient') => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/90 backdrop-blur-xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-card border border-border shadow-xl rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Accès Sécurisé</h2>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-accent hover:border-vital-green/30 transition-all cursor-pointer group"
                 onClick={() => onLogin('admin')}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-vital-green/10 flex items-center justify-center group-hover:bg-vital-green/20 transition-colors">
                  <Shield className="w-6 h-6 text-vital-green" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Espace Hospitalier</h3>
                  <p className="text-sm text-muted-foreground">Administration & Personnel Médical</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-accent hover:border-vital-green/30 transition-all cursor-pointer group"
                 onClick={() => onLogin('patient')}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-soft-teal/10 flex items-center justify-center group-hover:bg-soft-teal/20 transition-colors">
                  <User className="w-6 h-6 text-soft-teal" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Espace Patient</h3>
                  <p className="text-sm text-muted-foreground">Dossier Personnel & Tuteurs</p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            Chiffrement de bout en bout activé
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'staff' | 'departments'>('overview');

  const departments = [
    { name: "Cardiologie", head: "Dr. Aris", patients: 142, status: "Optimal" },
    { name: "Neurologie", head: "Dr. Vance", patients: 89, status: "Surchargé" },
    { name: "Pédiatrie", head: "Dr. Chen", patients: 210, status: "Optimal" },
    { name: "Urgences", head: "Dr. Ross", patients: 56, status: "Critique" }
  ];

  return (
    <div className="pt-24 px-6 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord Hospitalier</h1>
          <p className="text-medical-muted mt-1">Gestion centrale de l'établissement</p>
        </div>
        <div className="flex gap-3">
          <div className="flex p-1 bg-white/5 rounded-lg border border-white/10">
            <button 
              onClick={() => setActiveAdminTab('overview')}
              className={cn("px-4 py-1.5 rounded-md text-xs font-medium transition-all", activeAdminTab === 'overview' ? "bg-vital-green text-medical-bg" : "text-medical-muted")}
            >
              Vue d'ensemble
            </button>
            <button 
              onClick={() => setActiveAdminTab('staff')}
              className={cn("px-4 py-1.5 rounded-md text-xs font-medium transition-all", activeAdminTab === 'staff' ? "bg-vital-green text-medical-bg" : "text-medical-muted")}
            >
              Personnel
            </button>
            <button 
              onClick={() => setActiveAdminTab('departments')}
              className={cn("px-4 py-1.5 rounded-md text-xs font-medium transition-all", activeAdminTab === 'departments' ? "bg-vital-green text-medical-bg" : "text-medical-muted")}
            >
              Départements
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeAdminTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <GlassCard className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-vital-green/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-vital-green" />
                </div>
                <div>
                  <p className="text-xs text-medical-muted uppercase tracking-wider">Patients Actifs</p>
                  <p className="text-2xl font-mono font-bold">1,284</p>
                </div>
              </GlassCard>
              <GlassCard className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-soft-teal/10 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-soft-teal" />
                </div>
                <div>
                  <p className="text-xs text-medical-muted uppercase tracking-wider">Consultations / Jour</p>
                  <p className="text-2xl font-mono font-bold">42</p>
                </div>
              </GlassCard>
              <GlassCard className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-glow/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-glow" />
                </div>
                <div>
                  <p className="text-xs text-medical-muted uppercase tracking-wider">Disponibilité Lits</p>
                  <p className="text-2xl font-mono font-bold">88%</p>
                </div>
              </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <GlassCard className="h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Dossiers Récents</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                      <input 
                        type="text" 
                        placeholder="Rechercher un patient..." 
                        className="bg-medical-bg border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-vital-green/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-medical-muted text-xs uppercase tracking-wider border-b border-white/5">
                          <th className="pb-4 font-medium">Patient</th>
                          <th className="pb-4 font-medium">ID</th>
                          <th className="pb-4 font-medium">Statut</th>
                          <th className="pb-4 font-medium">Dernière Visite</th>
                          <th className="pb-4 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {MOCK_PATIENTS.map(p => (
                          <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 font-medium">{p.name}</td>
                            <td className="py-4 font-mono text-sm text-medical-muted">{p.id}</td>
                            <td className="py-4"><Badge status={p.status}>{p.status}</Badge></td>
                            <td className="py-4 text-sm text-medical-muted">{p.lastVisit}</td>
                            <td className="py-4 text-right">
                              <button className="text-vital-green hover:underline text-sm">Voir Dossier</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </div>

              <div className="space-y-6">
                <GlassCard>
                  <h2 className="text-xl font-bold mb-6">Personnel de Garde</h2>
                  <div className="space-y-4">
                    {MOCK_STAFF.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-vital-green/20 flex items-center justify-center text-vital-green font-bold">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{s.name}</p>
                            <p className="text-xs text-medical-muted">{s.role} • {s.department}</p>
                          </div>
                        </div>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          s.status === 'Active' ? "bg-vital-green" : "bg-medical-muted"
                        )} />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-6 text-sm" onClick={() => setActiveAdminTab('staff')}>Gérer le personnel</Button>
                </GlassCard>

                <GlassCard className="bg-gradient-to-br from-vital-green/20 to-transparent">
                  <h3 className="font-bold mb-2">Alerte Système</h3>
                  <p className="text-sm text-medical-muted mb-4">Mise à jour de la base de données sécurisée prévue à 02:00 UTC.</p>
                  <div className="flex items-center gap-2 text-xs text-vital-green">
                    <Shield className="w-3 h-3" /> Protégé par AES-256
                  </div>
                </GlassCard>
              </div>
            </div>
          </motion.div>
        )}

        {activeAdminTab === 'staff' && (
          <motion.div
            key="staff"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Gestion du Personnel</h2>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Ajouter un membre
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_STAFF.map(s => (
                  <div key={s.id} className="p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-vital-green/30 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-vital-green/10 flex items-center justify-center text-vital-green font-bold text-xl">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold">{s.name}</h3>
                        <p className="text-sm text-medical-muted">{s.role}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-medical-muted">
                      <div className="flex justify-between">
                        <span>Département</span>
                        <span className="text-medical-text">{s.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Statut</span>
                        <Badge status={s.status === 'Active' ? 'Stable' : 'Critical'}>{s.status}</Badge>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5 flex gap-2">
                      <Button variant="outline" className="flex-1 text-xs py-2">Modifier</Button>
                      <Button variant="outline" className="flex-1 text-xs py-2 text-red-400 hover:bg-red-500/10">Suspendre</Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeAdminTab === 'departments' && (
          <motion.div
            key="departments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {departments.map((dept, idx) => (
                <GlassCard key={idx} className="group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold group-hover:text-vital-green transition-colors">{dept.name}</h3>
                      <p className="text-medical-muted">Chef de service: {dept.head}</p>
                    </div>
                    <Badge status={dept.status === 'Optimal' ? 'Stable' : dept.status === 'Surchargé' ? 'Warning' : 'Critical'}>
                      {dept.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-xs text-medical-muted uppercase mb-1">Patients</p>
                      <p className="text-2xl font-mono font-bold">{dept.patients}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-xs text-medical-muted uppercase mb-1">Capacité</p>
                      <p className="text-2xl font-mono font-bold">92%</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">Gérer l'unité</Button>
                    <Button variant="outline" className="flex-1">Rapports</Button>
                  </div>
                </GlassCard>
              ))}
              <GlassCard className="border-dashed border-white/20 flex flex-col items-center justify-center p-12 text-center hover:border-vital-green/50 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-vital-green/10 transition-colors">
                  <Plus className="w-8 h-8 text-medical-muted group-hover:text-vital-green transition-colors" />
                </div>
                <h3 className="font-bold text-xl mb-2">Nouveau Département</h3>
                <p className="text-sm text-medical-muted">Ajouter une unité de soin à l'établissement</p>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PatientDashboard = () => {
  const patient = MOCK_PATIENTS[0];
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState<'form' | 'success'>('form');

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep('success');
    setTimeout(() => {
      setIsBooking(false);
      setBookingStep('form');
    }, 3000);
  };

  return (
    <div className="pt-24 px-6 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold">Bienvenue, {patient.name}</h1>
          <p className="text-medical-muted mt-1">Votre historique de santé en un clin d'œil</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter un Tuteur
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setIsBooking(true)}>
            <Calendar className="w-4 h-4" /> Prendre RDV
          </Button>
        </div>
      </div>

      {/* Appointment Modal */}
      <AnimatePresence>
        {isBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBooking(false)}
              className="absolute inset-0 bg-medical-bg/90 backdrop-blur-xl" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <GlassCard className="p-8 border-vital-green/20">
                {bookingStep === 'form' ? (
                  <>
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-bold">Prendre Rendez-vous</h2>
                      <button onClick={() => setIsBooking(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <form onSubmit={handleBooking} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs text-medical-muted uppercase">Spécialité</label>
                        <select className="w-full bg-medical-bg border border-white/10 rounded-xl p-3 text-sm focus:border-vital-green/50 outline-none">
                          <option>Cardiologie</option>
                          <option>Médecine Générale</option>
                          <option>Neurologie</option>
                          <option>Pédiatrie</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs text-medical-muted uppercase">Date</label>
                          <input type="date" className="w-full bg-medical-bg border border-white/10 rounded-xl p-3 text-sm focus:border-vital-green/50 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-medical-muted uppercase">Heure</label>
                          <input type="time" className="w-full bg-medical-bg border border-white/10 rounded-xl p-3 text-sm focus:border-vital-green/50 outline-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-medical-muted uppercase">Motif (Optionnel)</label>
                        <textarea className="w-full bg-medical-bg border border-white/10 rounded-xl p-3 text-sm focus:border-vital-green/50 outline-none h-24 resize-none" placeholder="Décrivez brièvement votre besoin..."></textarea>
                      </div>
                      <Button type="submit" className="w-full py-4">Confirmer la demande</Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-vital-green/10 flex items-center justify-center mx-auto mb-6">
                      <UserCheck className="w-10 h-10 text-vital-green" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Demande Envoyée !</h2>
                    <p className="text-medical-muted mb-8">
                      Votre demande de rendez-vous a été transmise au secrétariat. 
                      Vous recevrez une confirmation par SMS et Email sous peu.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-vital-green">
                      <Shield className="w-4 h-4" /> Sécurisé par The Vital Record
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="text-center">
            <div className="w-24 h-24 rounded-full bg-vital-green/10 border-2 border-vital-green/30 mx-auto flex items-center justify-center mb-4 relative">
              <User className="w-12 h-12 text-vital-green" />
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-glow border-4 border-medical-card flex items-center justify-center">
                <Shield className="w-3 h-3 text-medical-bg" />
              </div>
            </div>
            <h2 className="text-xl font-bold">{patient.name}</h2>
            <p className="text-sm text-medical-muted mb-6">ID: {patient.id}</p>
            
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-medical-muted uppercase">Âge</p>
                <p className="font-mono font-bold">{patient.age} ans</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-medical-muted uppercase">Groupe</p>
                <p className="font-mono font-bold text-vital-green">{patient.bloodType}</p>
              </div>
            </div>

            <div className="mt-6 text-left">
              <p className="text-xs text-medical-muted uppercase mb-3">Allergies</p>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map(a => (
                    <span key={a} className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-[10px] border border-red-500/20">
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-medical-muted italic">Aucune allergie connue</span>
                )}
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-vital-green" />
              Membres Rattachés
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-soft-teal/20 flex items-center justify-center text-soft-teal text-xs font-bold">L</div>
                <div>
                  <p className="text-xs font-bold">Lucas Dupont</p>
                  <p className="text-[10px] text-medical-muted">Fils • 8 ans</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-soft-teal/20 flex items-center justify-center text-soft-teal text-xs font-bold">M</div>
                <div>
                  <p className="text-xs font-bold">Marie Dupont</p>
                  <p className="text-[10px] text-medical-muted">Mère • 72 ans</p>
                </div>
              </div>
              <button className="w-full py-2 text-[10px] uppercase tracking-wider text-medical-muted hover:text-vital-green transition-colors border-t border-white/5 mt-2">
                + Ajouter un membre
              </button>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <GlassCard>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-vital-green" />
                Historique Médical
              </h2>
              <div className="flex gap-2">
                <Badge>Tout</Badge>
                <Badge>Analyses</Badge>
                <Badge>Consultations</Badge>
              </div>
            </div>

            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
              {patient.records.map((record, idx) => (
                <div key={record.id} className="relative pl-12 group">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-medical-card border border-white/10 flex items-center justify-center z-10 group-hover:border-vital-green transition-colors">
                    {record.type === 'Consultation' ? <Stethoscope className="w-5 h-5 text-vital-green" /> : <Activity className="w-5 h-5 text-soft-teal" />}
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-vital-green/20 transition-all">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-mono text-medical-muted uppercase tracking-widest">{record.date}</span>
                        <h4 className="font-bold text-lg">{record.type}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{record.doctor}</p>
                        <p className="text-xs text-medical-muted">Praticien référent</p>
                      </div>
                    </div>
                    <p className="text-sm text-medical-muted leading-relaxed">
                      {record.notes}
                    </p>
                    {record.results && (
                      <div className="mt-4 p-3 rounded-xl bg-vital-green/5 border border-vital-green/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-vital-green/10 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-vital-green" />
                          </div>
                          <span className="text-xs font-medium">Résultats d'analyse disponibles</span>
                        </div>
                        <button className="text-xs text-vital-green hover:underline font-bold">Télécharger PDF</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="bg-gradient-to-br from-soft-teal/10 to-transparent">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-soft-teal" />
                Suivi Vital
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-xs text-medical-muted">Rythme Cardiaque</p>
                  <p className="text-xl font-mono font-bold">72 <span className="text-xs font-normal text-medical-muted">BPM</span></p>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-soft-teal w-[72%]" />
                </div>
                <div className="flex justify-between items-end mt-6">
                  <p className="text-xs text-medical-muted">Tension Artérielle</p>
                  <p className="text-xl font-mono font-bold">12/8 <span className="text-xs font-normal text-medical-muted">mmHg</span></p>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-vital-green w-[60%]" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="flex flex-col justify-center items-center text-center p-8 border-dashed border-vital-green/30">
              <div className="w-16 h-16 rounded-full bg-vital-green/10 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-vital-green" />
              </div>
              <h3 className="font-bold mb-2">Prochain Rendez-vous</h3>
              <p className="text-sm text-medical-muted mb-6">Vous n'avez aucun rendez-vous planifié pour le moment.</p>
              <Button variant="outline" className="w-full">Prendre rendez-vous</Button>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

const Solutions = () => {
  const [activeTab, setActiveTab] = useState<'doctor' | 'patient'>('doctor');

  const doctorFeatures = [
    {
      icon: Shield,
      title: "Traçabilité totale",
      description: "Chaque action médicale est enregistrée dans un registre immuable et sécurisé."
    },
    {
      icon: Stethoscope,
      title: "Dossier Médical Unifié",
      description: "Accès instantané à l'historique complet du patient, des analyses aux prescriptions."
    },
    {
      icon: Briefcase,
      title: "Flux de Travail Optimisé",
      description: "Réduisez la charge administrative pour vous concentrer sur le soin."
    }
  ];

  const patientFeatures = [
    {
      icon: Heart,
      title: "Contrôle de vos Données",
      description: "Vous êtes le seul propriétaire de votre carnet de santé digital."
    },
    {
      icon: Users,
      title: "Gestion Familiale",
      description: "Centralisez les dossiers de vos enfants et aînés en toute simplicité."
    },
    {
      icon: Clock,
      title: "Suivi en Temps Réel",
      description: "Recevez vos résultats et rappels de rendez-vous instantanément."
    }
  ];

  const features = activeTab === 'doctor' ? doctorFeatures : patientFeatures;

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Une Solution pour Chaque Acteur</h2>
        <div className="inline-flex p-1 bg-white/5 rounded-full border border-white/10">
          <button 
            onClick={() => setActiveTab('doctor')}
            className={cn(
              "px-8 py-2.5 rounded-full text-sm font-medium transition-all",
              activeTab === 'doctor' ? "bg-vital-green text-medical-bg shadow-lg" : "text-medical-muted hover:text-medical-text"
            )}
          >
            Hôpitaux & Staff
          </button>
          <button 
            onClick={() => setActiveTab('patient')}
            className={cn(
              "px-8 py-2.5 rounded-full text-sm font-medium transition-all",
              activeTab === 'patient' ? "bg-vital-green text-medical-bg shadow-lg" : "text-medical-muted hover:text-medical-text"
            )}
          >
            Patients & Familles
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatePresence mode="wait">
          {features.map((f, idx) => (
            <motion.div
              key={`${activeTab}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className="h-full flex flex-col gap-4 group hover:border-vital-green/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-vital-green/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-vital-green" />
                </div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="text-medical-muted text-sm leading-relaxed">
                  {f.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { label: "Patients", value: "1,248", icon: Users },
    { label: "Rendez-vous", value: "89", icon: Calendar },
    { label: "Médecins", value: "67", icon: Stethoscope },
    { label: "Établissements", value: "12", icon: Shield }
  ];

  return (
    <section className="py-12 px-6 border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, idx) => (
          <div key={idx} className="text-center">
            <p className="text-3xl md:text-4xl font-mono font-bold text-vital-green mb-2">{s.value}</p>
            <p className="text-xs text-medical-muted uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Main App ---

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-medical-bg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-vital-green flex items-center justify-center">
              <Activity className="text-medical-bg w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              CS<span className="text-vital-green">DMP</span>
            </span>
          </div>
          <p className="text-medical-muted max-w-sm leading-relaxed mb-8">
            La plateforme de santé nouvelle génération qui place la sécurité et l'humain au cœur du système médical.
          </p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-vital-green transition-colors cursor-pointer">
              <Shield className="w-5 h-5 text-medical-muted" />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-vital-green transition-colors cursor-pointer">
              <Lock className="w-5 h-5 text-medical-muted" />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-6">Plateforme</h4>
          <ul className="space-y-4 text-sm text-medical-muted">
            <li><a href="#" className="hover:text-vital-green transition-colors">Solutions Hôpitaux</a></li>
            <li><a href="#" className="hover:text-vital-green transition-colors">Espace Patient</a></li>
            <li><a href="#" className="hover:text-vital-green transition-colors">Sécurité & RGPD</a></li>
            <li><a href="#" className="hover:text-vital-green transition-colors">API & Intégrations</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Société</h4>
          <ul className="space-y-4 text-sm text-medical-muted">
            <li><a href="#" className="hover:text-vital-green transition-colors">À propos</a></li>
            <li><a href="#" className="hover:text-vital-green transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-vital-green transition-colors">Mentions Légales</a></li>
            <li><a href="#" className="hover:text-vital-green transition-colors">Confidentialité</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-medical-muted">© 2026 The Vital Record. Tous droits réservés.</p>
        <div className="flex items-center gap-2 text-xs text-vital-green">
          <div className="w-2 h-2 rounded-full bg-vital-green vital-pulse" />
          Systèmes Opérationnels
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [view, setView] = useState<'landing' | 'admin' | 'patient'>('landing');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { token, saveToken, clearToken, user } = useAuthToken();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Check for existing token and set view
    if (token) {
      // In a real app, we'd verify the token and get the role
      // For this prototype, we'll default to 'admin' if token exists
      // but let's keep it simple and just stay on landing if not explicitly set
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [token]);

  const handleLogin = (role: 'admin' | 'patient') => {
    saveToken(`mock_token_${role}`);
    setView(role);
    setIsLoginOpen(false);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    queryClient.clear();
    clearToken();
    setView('landing');
  };

  return (
    <div className="min-h-screen relative">
      <div className="noise" />
      
      <Navbar 
        onLoginClick={() => {}} 
        user={user} 
        onLogout={handleLogout} 
      />

      <main>
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hero onStart={() => setIsLoginOpen(true)} />
              <Stats />
              <Solutions />
              
              {/* Trust Section */}
              <section className="py-20 px-6 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-8">Ils nous font confiance</h2>
                  <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                    <div className="text-2xl font-display font-bold tracking-widest">HOSPITAL_CENTRAL</div>
                    <div className="text-2xl font-display font-bold tracking-widest">MED_TECH_AFRICA</div>
                    <div className="text-2xl font-display font-bold tracking-widest">GLOBAL_HEALTH</div>
                    <div className="text-2xl font-display font-bold tracking-widest">VITAL_LABS</div>
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="py-32 px-6 text-center">
                <GlassCard className="max-w-4xl mx-auto py-16 px-8 bg-gradient-to-br from-vital-green/10 to-transparent border-vital-green/20">
                  <h2 className="text-4xl font-bold mb-6">Prêt à moderniser votre établissement ?</h2>
                  <p className="text-medical-muted mb-10 max-w-xl mx-auto">
                    Rejoignez la révolution de la santé numérique. Contactez nos experts pour une démonstration personnalisée.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="px-12">Contacter un expert</Button>
                    <Button variant="outline">En savoir plus</Button>
                  </div>
                </GlassCard>
              </section>
            </motion.div>
          )}

          {view === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <AdminDashboard />
            </motion.div>
          )}

          {view === 'patient' && (
            <motion.div
              key="patient"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <PatientDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
