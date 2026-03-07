"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

export function ActionButtons({ 
  onEdit, 
  onDelete, 
  editLabel = "Modifier", 
  deleteLabel = "Supprimer" 
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 w-8 p-0"
          title={editLabel}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          title={deleteLabel}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
