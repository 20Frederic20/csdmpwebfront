"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Edit, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export interface ActionConfig {
  label?: string; // optionnel pour les séparateurs
  icon?: React.ReactNode;
  onClick?: (row: any) => void;
  href?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  disabled?: boolean;
  separator?: boolean;
}

export interface ColumnConfig {
  key: string;
  header: string;
  accessorKey?: string;
  cell?: (row: any) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
}

export interface DataTableActionsProps {
  row: any;
  actions: ActionConfig[];
  canAccess?: (resource: string, action: string) => boolean;
  resourceName?: string;
}

export function DataTableActions({ row, actions, canAccess, resourceName = "resource" }: DataTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        {actions.map((action, index) => {
          if (action.separator) {
            return <DropdownMenuSeparator key={`separator-${index}`} />;
          }

          if (!action.label) {
            return null;
          }

          const menuItem = (
            <DropdownMenuItem
              key={action.label}
              className={`cursor-pointer ${
                action.variant === 'destructive' ? 'text-red-600' :
                action.variant === 'success' ? 'text-green-600' :
                action.variant === 'warning' ? 'text-yellow-600' : ''
              }`}
              onClick={action.onClick ? () => action.onClick!(row.original) : undefined}
              disabled={action.disabled}
            >
              {action.icon && <span className="mr-2 h-4 w-4">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          );

          if (action.href) {
            return (
              <Link href={action.href} key={action.label}>
                {menuItem}
              </Link>
            );
          }

          return menuItem;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function createNameColumn<T extends { id_: string; deleted_at?: string | null }>(
  getName: (item: T) => string,
  getDetailUrl: (item: T) => string,
  options?: {
    showStatus?: boolean;
    statusField?: keyof T;
    getInitial?: (item: T) => string;
    getAvatarColor?: (item: T) => string;
  }
): ColumnDef<T> {
  return {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => {
      const item = row.original;
      const name = getName(item);
      const initial = options?.getInitial ? options.getInitial(item) : name.charAt(0).toUpperCase();
      
      return (
        <Link 
          href={getDetailUrl(item)}
          className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${item.deleted_at ? 'opacity-60' : ''}`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-md font-medium ${
            item.deleted_at
              ? 'bg-gray-100 text-gray-500'
              : options?.statusField && options?.showStatus && !item[options.statusField]
                ? 'bg-gray-100 text-gray-500'
                : options?.getAvatarColor ? options.getAvatarColor(item) : 'bg-blue-100 text-blue-700'
          }`}>
            {initial}
          </div>
          <div>
            <div className="font-medium flex items-center gap-2">
              {name}
              {item.deleted_at && (
                <Badge variant="secondary" className="text-xs">
                  Supprimé
                </Badge>
              )}
              {options?.showStatus && options?.statusField && !item.deleted_at && !item[options.statusField] && (
                <Badge variant="secondary" className="text-xs">
                  Inactif
                </Badge>
              )}
            </div>
            <div className="text-md text-muted-foreground">ID: {item.id_?.substring(0, 8) || 'N/A'}</div>
          </div>
        </Link>
      );
    },
  };
}

export function createDateColumn<T>(
  key: keyof T,
  header: string,
  formatDate: (date: any) => string
): ColumnDef<T> {
  return {
    accessorKey: key as string,
    header,
    cell: ({ row }) => formatDate(row.getValue(key as string)),
  };
}

export function createStatusColumn<T>(
  key: keyof T,
  header: string,
  onToggle?: (id: string) => void,
  getChecked?: (item: T) => boolean
): ColumnDef<T> {
  return {
    accessorKey: key as string,
    header,
    cell: ({ row }) => {
      const item = row.original;
      const checked = getChecked ? getChecked(item) : Boolean(item[key]);
      
      return (
        <Switch
          checked={checked}
          onCheckedChange={() => onToggle?.((item as any).id_ || (item as any).id)}
          className="data-[state=checked]:bg-green-500"
        />
      );
    },
  };
}

export function createActionsColumn<T>(
  actions: (item: T) => ActionConfig[],
  canAccess?: (resource: string, action: string) => boolean,
  resourceName?: string
): ColumnDef<T> {
  return {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const item = row.original;
      const itemActions = actions(item);
      
      return (
        <DataTableActions
          row={row}
          actions={itemActions}
          canAccess={canAccess}
          resourceName={resourceName}
        />
      );
    },
  };
}
