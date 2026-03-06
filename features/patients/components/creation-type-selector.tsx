"use client";

import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";

interface CreationTypeSelectorProps {
  createUser: boolean;
  onCreateUserChange: (createUser: boolean) => void;
}

export function CreationTypeSelector({ createUser, onCreateUserChange }: CreationTypeSelectorProps) {
  return (
    <div className="flex gap-4 mb-6">
      <Button
        type="button"
        variant={createUser ? "default" : "outline"}
        onClick={() => onCreateUserChange(true)}
        className="cursor-pointer"
      >
        <User className="mr-2 h-4 w-4" />
        Créer un nouvel utilisateur
      </Button>
      <Button
        type="button"
        variant={!createUser ? "default" : "outline"}
        onClick={() => onCreateUserChange(false)}
        className="cursor-pointer"
      >
        <Users className="mr-2 h-4 w-4" />
        Utiliser un utilisateur existant
      </Button>
    </div>
  );
}
