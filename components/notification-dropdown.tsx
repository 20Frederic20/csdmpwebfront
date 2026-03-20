'use client';

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function NotificationDropdown() {
  const notifications = [
    {
      id: 1,
      title: "Nouveau patient",
      description: "Jean Dupont a été admis en Cardiologie.",
      time: "Il y a 5 min",
      unread: true,
    },
    {
      id: 2,
      title: "Rendez-vous annulé",
      description: "Le RDV de Marie Martin à 14h30 est annulé.",
      time: "Il y a 1h",
      unread: false,
    },
    {
      id: 3,
      title: "Résultat d'analyse",
      description: "Les analyses pour Marc Durand sont disponibles.",
      time: "Il y a 3h",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          <p>Notifications</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-80 bg-white border-slate-100 shadow-lg" align="end">
        <DropdownMenuLabel className="font-bold text-slate-900">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-100" />
        {notifications.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-slate-50 focus:bg-slate-50"
              >
                <div className="flex w-full justify-between items-center">
                  <span className={`font-bold text-sm ${notification.unread ? 'text-slate-900' : 'text-slate-600'}`}>
                    {notification.title}
                  </span>
                  <span className="text-[10px] text-slate-400">{notification.time}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {notification.description}
                </p>
                {notification.unread && (
                  <div className="h-1.5 w-1.5 rounded-full bg-vital-green mt-1" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-slate-500">
            Aucune notification
          </div>
        )}
        <DropdownMenuSeparator className="bg-slate-100" />
        <DropdownMenuItem className="w-full text-center justify-center text-xs text-vital-green font-bold cursor-pointer hover:bg-slate-50">
          Voir toutes les notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
