"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDischargePatient } from "../hooks/use-rooms";

interface DischargePatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    patientName: string;
    roomName: string;
}

export function DischargePatientModal({
    isOpen,
    onClose,
    patientId,
    patientName,
    roomName,
}: DischargePatientModalProps) {
    const { mutateAsync: dischargePatient, isPending } = useDischargePatient();
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setReason(""), 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!patientId) return;

        try {
            await dischargePatient({ patient_id: patientId, reason: reason || null });
            onClose();
        } catch (error) {
            console.error("Error discharging patient:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enregistrer la sortie</DialogTitle>
                    <DialogDescription>
                        Confirmez la sortie de <span className="font-semibold text-primary">{patientName}</span> de la chambre <span className="font-semibold text-primary">{roomName}</span>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Motif de la sortie (optionnel)</Label>
                        <Textarea
                            id="reason"
                            placeholder="Ex: Guérison, Transfert externe..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            disabled={isPending}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isPending || !patientId}
                        >
                            {isPending && <span className="animate-spin mr-2">⏳</span>}
                            Confirmer la sortie
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
