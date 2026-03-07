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
import { Patient, usePermanentlyDeletePatient } from "@/features/patients";
import { toast } from "sonner";

interface PermanentlyDeletePatientModalProps {
  patient: Patient;
  onPatientDeleted: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function PermanentlyDeletePatientModal({ patient, onPatientDeleted, isOpen, onClose }: PermanentlyDeletePatientModalProps) {
  const { mutateAsync: permanentlyDelete, isPending: loading } = usePermanentlyDeletePatient();

  const handlePermanentlyDelete = async () => {
    try {
      await permanentlyDelete(patient.id_);
      onPatientDeleted();
      onClose();
    } catch (err) {
      // Erreur déjà gérée par le hook
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
