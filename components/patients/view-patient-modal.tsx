import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Patient } from "@/features/patients/types/patients.types";
import { formatPatientName, formatBirthDate, formatGender, getPatientStatusBadge } from "@/features/patients/utils/patients.utils";
import { PatientMedicalInfo } from "./patient-medical-info";

interface ViewPatientModalProps {
  patient: Patient;
}

export function ViewPatientModal({ patient }: ViewPatientModalProps) {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Pour forcer le rechargement

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Forcer le rechargement des allergies quand le modal s'ouvre
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails du patient</DialogTitle>
          <DialogDescription>
            Informations complètes du patient
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations principales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations personnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom complet</p>
                <p className="text-base">{formatPatientName(patient)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
                <p className="text-base">{formatBirthDate(patient.birth_date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Genre</p>
                <p className="text-base">{formatGender(patient.gender)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Localisation</p>
                <p className="text-base">{patient.location || 'Non spécifiée'}</p>
              </div>
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Statut</h3>
            <div className="flex items-center gap-2">
              <Badge variant={getPatientStatusBadge(patient).variant as "default" | "secondary" | "destructive" | "outline"}>
                {getPatientStatusBadge(patient).label}
              </Badge>
            </div>
          </div>

          {/* Informations système */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations système</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID Patient</p>
                <p className="text-base font-mono text-sm">{patient.id_}</p>
              </div>
              {patient.owner_id && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Propriétaire</p>
                  <p className="text-base font-mono text-sm">{patient.owner_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Informations médicales */}
          <PatientMedicalInfo patientId={patient.id_} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
