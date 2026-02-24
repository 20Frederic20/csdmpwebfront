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
}

export function ViewHospitalStaffModal({ staff }: ViewHospitalStaffModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start cursor-pointer"
          data-hospital-staff-view={staff.id_}
        >
          <Eye className="h-4 w-4 mr-2" />
          Voir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails du membre du personnel</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-md font-medium text-muted-foreground">ID Personnel</label>
              <p className="font-mono text-md bg-muted px-2 py-1 rounded mt-1">{staff.id_}</p>
            </div>
            <div>
              <label className="text-md font-medium text-muted-foreground">ID Utilisateur</label>
              <p className="font-mono text-md bg-muted px-2 py-1 rounded mt-1">{staff.user_id}</p>
            </div>
            <div>
              <label className="text-md font-medium text-muted-foreground">Matricule</label>
              <p className="font-mono text-md bg-muted px-2 py-1 rounded mt-1">{staff.matricule}</p>
            </div>
            <div>
              <label className="text-md font-medium text-muted-foreground">Statut</label>
              <div className="mt-1">
                <Badge 
                  variant={staff.is_active ? "default" : "secondary"}
                  className={staff.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {staff.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations professionnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-md font-medium text-muted-foreground">Spécialité</label>
                <div className="mt-1">
                  <Badge variant="secondary">
                    {formatSpecialty(staff.specialty)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-md font-medium text-muted-foreground">Département</label>
                <div className="mt-1">
                  <Badge variant="outline">
                    {formatDepartment(staff.department)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-md font-medium text-muted-foreground">Années d'expérience</label>
                <p className="mt-1">{staff.year_of_exp === 0 ? 'Débutant' : `${staff.year_of_exp} ans d'expérience`}</p>
              </div>
              <div>
                <label className="text-md font-medium text-muted-foreground">ID Établissement</label>
                <p className="font-mono text-md bg-muted px-2 py-1 rounded mt-1">{staff.health_facility_id}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
