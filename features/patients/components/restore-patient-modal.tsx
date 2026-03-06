import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RotateCcw } from "lucide-react";
import { Patient } from "@/features/patients/types/patients.types";
import { PatientService } from "@/features/patients/services/patients.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { toast } from "sonner";

interface RestorePatientModalProps {
  patient: Patient;
  onPatientRestored: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function RestorePatientModal({ patient, onPatientRestored, isOpen, onClose }: RestorePatientModalProps) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthToken();

  const handleRestore = async () => {
    setLoading(true);

    try {
      await PatientService.restorePatient(patient.id_, token || undefined);
      toast.success(`Patient ${patient.given_name} ${patient.family_name} restauré avec succès`);
      onPatientRestored();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue lors de la restauration du patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la restauration</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir restaurer le patient <strong>{patient.given_name} {patient.family_name}</strong> ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={onClose}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRestore}
            disabled={loading}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? "Restauration..." : "Restaurer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
