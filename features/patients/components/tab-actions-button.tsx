"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TabActionsButtonProps {
  onAdd: () => void;
  label?: string;
}

export function TabActionsButton({ onAdd, label = "Ajouter" }: TabActionsButtonProps) {
  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={onAdd}>
      <Plus className="h-4 w-4" />
      {label}
    </Button>
  );
}
