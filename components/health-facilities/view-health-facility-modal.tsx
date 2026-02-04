"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { HealthFacility } from "@/features/health-facilities";
import { getFacilityTypeBadge, getHealthFacilityStatusBadge } from "@/features/health-facilities/utils/health-facility.utils";

interface ViewHealthFacilityModalProps {
  facility: HealthFacility;
}

export function ViewHealthFacilityModal({ facility }: ViewHealthFacilityModalProps) {
  const [open, setOpen] = useState(false);

  const facilityTypeBadge = getFacilityTypeBadge(facility.facility_type);
  const statusBadge = getHealthFacilityStatusBadge(facility.is_active);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start cursor-pointer"
          data-health-facility-view={facility.id_}
        >
          <Eye className="h-4 w-4 mr-2" />
          Voir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de l'établissement de santé</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-md font-medium text-muted-foreground">ID Établissement</label>
              <p className="font-mono text-md bg-muted px-2 py-1 rounded mt-1">{facility.id_}</p>
            </div>
            <div>
              <label className="text-md font-medium text-muted-foreground">Code</label>
              <p className="font-mono text-md bg-muted px-2 py-1 rounded mt-1">{facility.code}</p>
            </div>
            <div>
              <label className="text-md font-medium text-muted-foreground">Nom</label>
              <p className="font-medium mt-1">{facility.name}</p>
            </div>
            <div>
              <label className="text-md font-medium text-muted-foreground">Statut</label>
              <div className="mt-1">
                <Badge 
                  variant={statusBadge.variant as "default" | "secondary" | "destructive" | "outline"}
                  className={statusBadge.className}
                >
                  {statusBadge.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations détaillées</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-md font-medium text-muted-foreground">Type d'établissement</label>
                <div className="mt-1">
                  <Badge variant={facilityTypeBadge.variant as "default" | "secondary" | "destructive" | "outline"}>
                    {facilityTypeBadge.label}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-md font-medium text-muted-foreground">ID Administrateur</label>
                <p className="font-mono text-md bg-muted px-2 py-1 rounded mt-1">
                  {facility.admin_user_id || 'Non défini'}
                </p>
              </div>
              <div>
                <label className="text-md font-medium text-muted-foreground">District</label>
                <p className="mt-1">{facility.district || 'Non défini'}</p>
              </div>
              <div>
                <label className="text-md font-medium text-muted-foreground">Région</label>
                <p className="mt-1">{facility.region || 'Non défini'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-md font-medium text-muted-foreground">Téléphone</label>
                <p className="mt-1">{facility.phone || 'Non défini'}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
