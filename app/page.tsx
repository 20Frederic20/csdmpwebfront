'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthToken } from '@/hooks/use-auth-token';
import { 
  Users, 
  Stethoscope, 
  Heart, 
  Shield, 
  Activity,
  Clock,
  CheckCircle,
  ArrowRight,
  User,
  UserCheck,
  Briefcase,
  LogIn,
  UserCircle,
  ChevronDown,
  LogOut,
  Settings
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState('doctor');
  const router = useRouter();
  const { token } = useAuthToken();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  const handleLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    // Rediriger vers la page d'accueil
    router.push('/');
  };

  // Statistiques mockées pour le teaser
  const stats = {
    patients: 1248,
    appointments: 89,
    doctors: 67,
    facilities: 12
  };

  const features = [
    {
      icon: Shield,
      title: "Traçabilité totale",
      description: "Suivi complet et sécurisé de tous les parcours patients"
    },
    {
      icon: Users,
      title: "Collaboration fluide",
      description: "Coordination efficace entre tous les acteurs de santé"
    },
    {
      icon: Activity,
      title: "Gestion centralisée",
      description: "Toutes les informations médicales au même endroit"
    },
    {
      icon: Clock,
      title: "Gain de temps",
      description: "Optimisation des processus administratifs et médicaux"
    }
  ];

  const userTypes = [
    {
      id: 'doctor',
      icon: Stethoscope,
      title: "Espace Docteur",
      description: "Consultez les dossiers patients, gérez vos consultations et prescriptions",
      color: "bg-green-50 border-green-200 text-green-700"
    },
    {
      id: 'staff',
      icon: UserCheck,
      title: "Personnel Soignant",
      description: "Accès aux informations patients, planning et coordination des soins",
      color: "bg-purple-50 border-purple-200 text-purple-700"
    },
    {
      id: 'hr',
      icon: Briefcase,
      title: "Portail RH",
      description: "Gestion du personnel et des ressources hospitalières",
      color: "bg-orange-50 border-orange-200 text-orange-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header avec bouton de connexion */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CSDMP</span>
            </div>
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <UserCircle className="h-4 w-4" />
                  Mon compte
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        router.push('/dashboard');
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <UserCircle className="h-4 w-4" />
                      Tableau de bord
                    </button>
                    <button
                      onClick={() => {
                        router.push('/dashboard/settings');
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Paramètres
                    </button>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Se connecter
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-green-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-blue-100 p-4 rounded-2xl">
                <Heart className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              CSDMP : Votre Carnet de Santé Complet
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Plateforme professionnelle pour les médecins et le personnel de santé. Coordination efficace des parcours patients et traitement sécurisé des données médicales.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {userTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                    activeTab === type.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  <type.icon className="h-5 w-5" />
                  {type.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Teaser */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vue d'ensemble en temps réel
            </h2>
            <p className="text-gray-600">
              Un aperçu rapide de l'activité du système de santé
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-900">{stats.patients}</span>
              </div>
              <h3 className="font-semibold text-blue-900">Patients suivis</h3>
              <p className="text-blue-700 text-sm">Dossiers actifs</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <div className="flex items-center justify-between mb-4">
                <Clock className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-green-900">{stats.appointments}</span>
              </div>
              <h3 className="font-semibold text-green-900">Rendez-vous aujourd'hui</h3>
              <p className="text-green-700 text-sm">Consultations programmées</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <Stethoscope className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold text-purple-900">{stats.doctors}</span>
              </div>
              <h3 className="font-semibold text-purple-900">Médecins actifs</h3>
              <p className="text-purple-700 text-sm">Professionnels disponibles</p>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
              <div className="flex items-center justify-between mb-4">
                <Activity className="h-8 w-8 text-orange-600" />
                <span className="text-2xl font-bold text-orange-900">{stats.facilities}</span>
              </div>
              <h3 className="font-semibold text-orange-900">Établissements</h3>
              <p className="text-orange-700 text-sm">Hôpitaux et cliniques</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir CSDMP ?
            </h2>
            <p className="text-gray-600">
              Une solution complète pour la gestion moderne des soins de santé
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 group-hover:shadow-md transition-shadow">
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Detail Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Conçue pour les professionnels de santé
            </h2>
            <p className="text-gray-600">
              Une interface dédiée aux médecins et au personnel soignant pour une gestion optimisée
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTypes.map((type) => (
              <div
                key={type.id}
                className={`p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                  activeTab === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
                onClick={() => setActiveTab(type.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${type.color}`}>
                    <type.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                    <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
                      Accéder à l'espace
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">CSDMP</span>
              </div>
              <p className="text-gray-400 text-sm">
                Carnet de Santé et Dossier Médical Patient - Solution complète pour la gestion moderne des soins.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Gestion des patients</li>
                <li>Prise de rendez-vous</li>
                <li>Dossiers médicaux</li>
                <li>Coordination des soins</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Sécurité</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Conformité RGPD</li>
                <li>Données chiffrées</li>
                <li>Sauvegarde sécurisée</li>
                <li>Contrôle d'accès</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Assistance 24/7</li>
                <li>Formation utilisateur</li>
                <li>Documentation</li>
                <li>Contact technique</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 CSDMP. Tous droits réservés. | Conformité RGPD et sécurité des données de santé.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
