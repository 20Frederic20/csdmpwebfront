"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { HospitalStaff } from "@/features/hospital-staff";
import { HospitalStaffService } from "@/features/hospital-staff";
import { useAuthToken } from "@/hooks/use-auth-token";

interface DeleteHospitalStaffModalProps {
  staff: HospitalStaff;
  isOpen: boolean;
  onClose: () => void;
  onStaffDeleted: () => void;
}

export function DeleteHospitalStaffModal({ staff, isOpen, onClose, onStaffDeleted }: DeleteHospitalStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthToken();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await HospitalStaffService.deleteHospitalStaff(staff.id_);
      toast.success("Membre du personnel supprimé avec succès");
      onClose();
      onStaffDeleted();
    } catch (error: any) {
      console.error('Error deleting hospital staff:', error);
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Supprimer le membre du personnel
          </DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Veuillez confirmer que vous voulez supprimer ce membre du personnel.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-red-50">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-md font-medium">ID Personnel:</span>
                <span className="font-mono text-md">{staff.id_}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-md font-medium">Matricule:</span>
                <span className="font-mono text-md">{staff.matricule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-md font-medium">Statut:</span>
                <Badge 
                  variant={staff.is_active ? "default" : "secondary"}
                  className={staff.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {staff.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
