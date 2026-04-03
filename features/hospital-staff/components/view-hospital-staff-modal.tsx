"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { HospitalStaff } from "@/features/hospital-staff";
import { 
  formatEmploymentStatus, 
  formatSpecialty, 
  formatDepartment, 
  getEmploymentStatusBadge
} from "@/features/hospital-staff/utils/hospital-staff.utils";

interface ViewHospitalStaffModalProps {
  staff: HospitalStaff;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewHospitalStaffModal({ staff, isOpen, onClose }: ViewHospitalStaffModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du membre du personnel</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations principales */}
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">{staff.user_full_name}</h2>
            <div className="flex items-center gap-2">
              <Badge 
                variant={staff.is_active ? "default" : "secondary"}
                className={staff.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {staff.is_active ? 'Actif' : 'Inactif'}
              </Badge>
              <span className="text-sm text-muted-foreground">Matricule: {staff.matricule}</span>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Établissement</label>
                <p className="text-md font-medium mt-1">{staff.health_facility_name}</p>
              </div>
              
              <div>
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Département</label>
                <p className="text-md font-medium mt-1">{staff.department_name}</p>
              </div>

              <div>
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Spécialité</label>
                <div className="mt-1">
                  <Badge variant="secondary" className="capitalize">
                    {formatSpecialty(staff.specialty).toLowerCase()}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Statut d'emploi</label>
                <div className="mt-1">
                  <Badge variant="outline">
                    {staff.employment_status ? formatEmploymentStatus(staff.employment_status) : "Non spécifié"}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Années d'expérience</label>
                <p className="text-md mt-1">{staff.year_of_exp === 0 ? 'Débutant' : `${staff.year_of_exp} ans`}</p>
              </div>

              {staff.order_number && (
                <div>
                  <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Numéro d'ordre</label>
                  <p className="text-md font-mono mt-1">{staff.order_number}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
