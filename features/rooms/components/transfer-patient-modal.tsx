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
import { useTransferPatient } from "../hooks/use-rooms";
import { RoomSelect } from "./room-select";

interface TransferPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    patientName: string;
    currentRoomId?: string;
}

export function TransferPatientModal({
    isOpen,
    onClose,
    patientId,
    patientName,
    currentRoomId,
}: TransferPatientModalProps) {
    const { mutateAsync: transferPatient, isPending } = useTransferPatient();
    const [newRoomId, setNewRoomId] = useState("");

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setNewRoomId(""), 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!patientId || !newRoomId) return;

        try {
            await transferPatient({ patient_id: patientId, new_room_id: newRoomId });
            onClose();
        } catch (error) {
            console.error("Error transferring patient:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Transférer le patient</DialogTitle>
                    <DialogDescription>
                        Transférer <span className="font-semibold text-primary">{patientName}</span> vers une nouvelle chambre.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <RoomSelect
                            value={newRoomId}
                            onChange={(val) => setNewRoomId(val || "")}
                            required
                            placeholder="Sélectionner la nouvelle chambre"
                        />
                        {currentRoomId && (
                            <p className="text-xs text-muted-foreground italic">
                                La chambre actuelle sera automatiquement libérée.
                            </p>
                        )}
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
                            disabled={isPending || !newRoomId || newRoomId === currentRoomId}
                        >
                            {isPending && <span className="animate-spin mr-2">⏳</span>}
                            Transférer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
