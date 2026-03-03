"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { HospitalStaff } from "@/features/hospital-staff";
import { HospitalStaffService } from "@/features/hospital-staff";
import { useAuthToken } from "@/hooks/use-auth-token";

interface PermanentDeleteHospitalStaffModalProps {
  staff: HospitalStaff;
  isOpen: boolean;
  onClose: () => void;
  onStaffDeleted: () => void;
}

export function PermanentDeleteHospitalStaffModal({ 
  staff, 
  isOpen, 
  onClose, 
  onStaffDeleted 
}: PermanentDeleteHospitalStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthToken();

  const handlePermanentDelete = async () => {
    setLoading(true);
    try {
      await HospitalStaffService.permanentlyDeleteHospitalStaff(staff.id_, token || undefined);
      toast.success("Membre du personnel supprimé définitivement avec succès");
      onClose();
      onStaffDeleted();
    } catch (error) {
      console.error('Error permanently deleting hospital staff:', error);
      toast.error("Erreur lors de la suppression définitive du membre du personnel");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Suppression Définitive
          </DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Le membre du personnel sera définitivement supprimé de la base de données.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Alert */}
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-800">
                Attention : Cette action ne peut pas être annulée
              </p>
              <p className="text-xs text-red-600">
                Le membre du personnel <span className="font-semibold">{staff.user_given_name} {staff.user_family_name}</span> sera définitivement supprimé.
              </p>
            </div>
          </div>

          {/* Staff Information */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nom complet:</span>
                <p className="font-medium">{staff.user_given_name} {staff.user_family_name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Matricule:</span>
                <p className="font-medium">{staff.matricule}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Spécialité:</span>
                <p className="font-medium">{staff.specialty}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Département:</span>
                <p className="font-medium">{staff.department_name}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant={staff.is_active ? "default" : "secondary"}>
                {staff.is_active ? "Actif" : "Inactif"}
              </Badge>
              {staff.deleted_at && (
                <Badge variant="destructive">
                  Supprimé
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
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
            onClick={handlePermanentDelete}
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
                Supprimer Définitivement
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
