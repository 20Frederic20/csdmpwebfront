'use client';

import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AccessDeniedProps {
  resource: string;
  action?: string;
}

export function AccessDenied({ resource, action = 'accéder' }: AccessDeniedProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Accès refusé
          </h2>
          
          <p className="text-gray-600 mb-6">
            Vous n'avez pas la permission de {action} à <span className="font-semibold">{resource}</span>
          </p>
          
          <div className="space-y-3">
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
