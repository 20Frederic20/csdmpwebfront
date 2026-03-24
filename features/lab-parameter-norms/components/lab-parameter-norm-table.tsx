"use client";

import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Activity } from "lucide-react";
import { LabParameterNorm } from "../types/lab-parameter-norms.types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface LabParameterNormTableProps {
  norms: LabParameterNorm[];
  onEdit: (norm: LabParameterNorm) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export function LabParameterNormTable({ 
  norms, 
  onEdit, 
  onDelete, 
  isLoading,
  canUpdate,
  canDelete
}: LabParameterNormTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (norms.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Aucune norme de laboratoire trouvée.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-100 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="font-semibold">Paramètre</TableHead>
            <TableHead className="font-semibold">Genre</TableHead>
            <TableHead className="font-semibold">Âge (Mois)</TableHead>
            <TableHead className="font-semibold">Valeurs de Réf.</TableHead>
            <TableHead className="font-semibold">Unité</TableHead>
            <TableHead className="font-semibold">Statut</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {norms.map((norm) => (
            <TableRow key={norm.id} className="hover:bg-slate-50/50 transition-colors">
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">{norm.parameter_code}</span>
                  <span className="text-xs text-muted-foreground">{norm.display_name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize bg-white">
                  {norm.gender === 'male' ? 'Homme' : norm.gender === 'female' ? 'Femme' : 'Tous'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {norm.age_min_months} - {norm.age_max_months}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded">
                    {norm.min_value}
                  </span>
                  <span className="text-slate-400">-</span>
                  <span className="text-blue-600 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded">
                    {norm.max_value}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-slate-600">{norm.unit}</span>
              </TableCell>
              <TableCell>
                {norm.is_pregnant ? (
                  <Badge className="bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100">
                    Enceinte (T{norm.trimester})
                  </Badge>
                ) : (
                  <span className="text-slate-400 text-xs">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    {canUpdate && (
                      <DropdownMenuItem onClick={() => onEdit(norm)} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                    )}
                    {canDelete && (
                      <DropdownMenuItem 
                        onClick={() => onDelete(norm.id)} 
                        className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
