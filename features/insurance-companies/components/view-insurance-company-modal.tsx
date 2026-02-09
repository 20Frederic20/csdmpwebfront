'use client';

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Building2, Phone, Calendar } from "lucide-react";
import { InsuranceCompany } from "../types/insurance-companies.types";
import { Modal } from "@/components/ui/modal";

interface ViewInsuranceCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: InsuranceCompany;
}

export function ViewInsuranceCompanyModal({ isOpen, onClose, company }: ViewInsuranceCompanyModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails de la compagnie d'assurance" size="md">
      <div key={company.id_}>
        <div className="space-y-6">
        {/* Main Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-6 w-6 text-gray-400" />
            <h3 className="text-xl font-semibold">{company.name}</h3>
            <Badge variant={company.is_active ? "default" : "secondary"}>
              {company.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nom de la compagnie</label>
              <p className="text-lg font-semibold">{company.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Code assureur</label>
              <p className="text-lg font-semibold">{company.insurer_code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Statut</label>
              <div className="mt-1">
                <Badge variant={company.is_active ? "default" : "secondary"}>
                  {company.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">ID Unique</label>
              <p className="text-sm font-mono text-gray-600">{company.id_}</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <h4 className="font-medium">Contact</h4>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Téléphone</label>
            <p className="text-lg">
              {company.contact_phone || (
                <span className="text-gray-400">Non renseigné</span>
              )}
            </p>
          </div>
        </div>

        {/* System Info */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <h4 className="font-medium">Informations système</h4>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">ID Unique</label>
            <p className="text-xs font-mono text-gray-600 break-all">{company.id_}</p>
          </div>
        </div>
      </div>
      </div>
    </Modal>
  );
}
