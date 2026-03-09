"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Room } from "../types/rooms.types";
import { useDeleteRoom } from "../hooks/use-rooms";

interface DeleteRoomModalProps {
    room: Room;
    isOpen: boolean;
    onClose: () => void;
}

export function DeleteRoomModal({
    room,
    isOpen,
    onClose,
}: DeleteRoomModalProps) {
    const { mutateAsync: deleteRoom, isPending: isDeleting } = useDeleteRoom();

    const handleDelete = async () => {
        try {
            await deleteRoom(room.id_);
            onClose();
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer la chambre{" "}
                        <span className="font-semibold">{room.name}</span> ?
                        Cette action est irréversible.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Suppression..." : "Supprimer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
