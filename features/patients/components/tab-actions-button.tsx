"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TabActionsButtonProps {
  onAdd: () => void;
  label?: string;
}

export function TabActionsButton({ onAdd, label = "Ajouter" }: TabActionsButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {label}
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle entrée
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
