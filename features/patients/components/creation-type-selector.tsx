"use client";

import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";

interface CreationTypeSelectorProps {
  createUser: boolean;
  onCreateUserChange: (createUser: boolean) => void;
}

export function CreationTypeSelector({ createUser, onCreateUserChange }: CreationTypeSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Button
        type="button"
        variant={createUser ? "default" : "outline"}
        onClick={() => onCreateUserChange(true)}
        className="cursor-pointer flex-1 h-12 py-3 px-4 text-sm font-medium"
      >
        <User className="mr-2 h-4 w-4 shrink-0" />
        <span className="truncate">Créer un utilisateur</span>
      </Button>
      <Button
        type="button"
        variant={!createUser ? "default" : "outline"}
        onClick={() => onCreateUserChange(false)}
        className="cursor-pointer flex-1 h-12 py-3 px-4 text-sm font-medium"
      >
        <Users className="mr-2 h-4 w-4 shrink-0" />
        <span className="truncate">Utilisateur existant</span>
      </Button>
    </div>
  );
}
