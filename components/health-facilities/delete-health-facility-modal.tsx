"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { HealthFacility } from "@/features/health-facilities";
import { HealthFacilityService } from "@/features/health-facilities";
import { useAuthToken } from "@/hooks/use-auth-token";
import { getHealthFacilityStatusBadge } from "@/features/health-facilities/utils/health-facility.utils";

interface DeleteHealthFacilityModalProps {
  facility: HealthFacility;
  onFacilityDeleted: () => void;
}

export function DeleteHealthFacilityModal({ facility, onFacilityDeleted }: DeleteHealthFacilityModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthToken();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await HealthFacilityService.deleteHealthFacility(facility.id_, token || undefined);
      toast.success("Établissement supprimé avec succès");
      setOpen(false);
      onFacilityDeleted();
    } catch (error: any) {
      console.error('Error deleting health facility:', error);
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = getHealthFacilityStatusBadge(facility.is_active);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start cursor-pointer text-red-600 hover:text-red-700"
          data-health-facility-delete={facility.id_}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Supprimer l'établissement de santé
          </DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Veuillez confirmer que vous voulez supprimer cet établissement de santé.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-red-50">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-md font-medium">ID Établissement:</span>
                <span className="font-mono text-md">{facility.id_}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-md font-medium">Nom:</span>
                <span className="font-mono text-md">{facility.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-md font-medium">Code:</span>
                <span className="font-mono text-md">{facility.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-md font-medium">Statut:</span>
                <Badge 
                  variant={statusBadge.variant as "default" | "secondary" | "destructive" | "outline"}
                  className={statusBadge.className}
                >
                  {statusBadge.label}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? "Suppression..." : "Supprimer définitivement"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
