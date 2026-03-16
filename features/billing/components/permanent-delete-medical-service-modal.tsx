"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { MedicalService } from "../types/medical-service.types";
import { usePermanentDeleteMedicalService } from "../hooks/use-medical-services";

interface PermanentDeleteMedicalServiceModalProps {
  service: MedicalService;
  isOpen: boolean;
  onClose: () => void;
}

export function PermanentDeleteMedicalServiceModal({
  service,
  isOpen,
  onClose,
}: PermanentDeleteMedicalServiceModalProps) {
  const { mutateAsync: deleteService, isPending } = usePermanentDeleteMedicalService();

  const handleDelete = async () => {
    try {
      await deleteService(service.id);
      onClose();
    } catch (error) {
      // Error is handled by the hook's toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Suppression définitive
          </DialogTitle>
          <DialogDescription className="text-red-600 font-semibold">
            ATTENTION: Cette action est irréversible.
          </DialogDescription>
          <DialogDescription>
            Voulez-vous vraiment supprimer définitivement le service "<strong>{service.label}</strong>" ?
            Toutes les données associées seront perdues.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-md bg-red-50 p-4 space-y-2 border border-red-100">
            <div className="flex justify-between text-sm">
              <span className="text-red-700">Code:</span>
              <span className="font-medium text-red-900">{service.code}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-700">ID:</span>
              <span className="font-mono text-xs text-red-900">{service.id}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Suppression brute..." : "Confirmer la suppression définitive"}
            {!isPending && <Trash2 className="ml-2 h-4 w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
