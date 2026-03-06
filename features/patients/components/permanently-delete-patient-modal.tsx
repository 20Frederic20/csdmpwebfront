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
import { Trash2 } from "lucide-react";
import { Patient } from "@/features/patients/types/patients.types";
import { PatientService } from "@/features/patients/services/patients.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { toast } from "sonner";

interface PermanentlyDeletePatientModalProps {
  patient: Patient;
  onPatientDeleted: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function PermanentlyDeletePatientModal({ patient, onPatientDeleted, isOpen, onClose }: PermanentlyDeletePatientModalProps) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthToken();

  const handlePermanentlyDelete = async () => {
    setLoading(true);

    try {
      await PatientService.permanentlyDeletePatient(patient.id_, token || undefined);
      toast.success(`Patient ${patient.given_name} ${patient.family_name} supprimé définitivement avec succès`);
      onPatientDeleted();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression définitive du patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suppression définitive</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Êtes-vous sûr de vouloir supprimer définitivement le patient{" "}
              <strong>{patient.given_name} {patient.family_name}</strong> ?
            </p>
            <p className="text-red-600 font-semibold">
              ⚠️ Cette action est irréversible et supprimera toutes les données du patient de manière permanente.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={onClose}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handlePermanentlyDelete}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Suppression..." : "Supprimer définitivement"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
