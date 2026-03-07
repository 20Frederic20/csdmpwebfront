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
import { Patient, useRestorePatient } from "@/features/patients";
import { toast } from "sonner";

interface RestorePatientModalProps {
  patient: Patient;
  onPatientRestored: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function RestorePatientModal({ patient, onPatientRestored, isOpen, onClose }: RestorePatientModalProps) {
  const { mutateAsync: restorePatient, isPending: loading } = useRestorePatient();

  const handleRestore = async () => {
    try {
      await restorePatient(patient.id_);
      onPatientRestored();
      onClose();
    } catch (err) {
      // Erreur déjà gérée par le hook
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
