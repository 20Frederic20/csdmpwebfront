'use client';

import { Bell, Check, CheckCheck } from "lucide-react";
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
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/features/notifications/hooks/use-notifications.hook";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function NotificationDropdown() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsReadMutation = useMarkNotificationRead();
  const markAllAsReadMutation = useMarkAllNotificationsRead();

  // Handle differences in API schema gracefully (id vs id_)
  const getId = (n: any) => n.id_ || n.id;
  const isUnread = (n: any) => !n.is_read;

  const unreadCount = notifications.filter(isUnread).length;

  const handleMarkAsRead = (id: string | number) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return timeStr;
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch {
      return timeStr;
    }
  };

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
        <div className="flex justify-between items-center pr-2">
            <DropdownMenuLabel className="font-bold text-slate-900">Notifications</DropdownMenuLabel>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs text-vital-green" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAllAsRead();
                }}
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCheck className="mr-1 h-3 w-3" />
                Tout marquer lu
              </Button>
            )}
        </div>
        <DropdownMenuSeparator className="bg-slate-100" />
        
        {isLoading ? (
          <div className="p-4 flex justify-center text-sm text-slate-500">
            <div className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-vital-green animate-spin mr-2" />
            Chargement...
          </div>
        ) : notifications.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => {
              const unread = isUnread(notification);
              const notificationId = getId(notification);
              return (
                <DropdownMenuItem
                  key={notificationId}
                  className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-slate-50 focus:bg-slate-50"
                  onClick={() => {
                    if (unread) handleMarkAsRead(notificationId);
                  }}
                >
                  <div className="flex w-full justify-between items-center gap-2">
                    <span className={`font-bold text-sm truncate ${unread ? 'text-slate-900' : 'text-slate-600'}`}>
                      {notification.title}
                    </span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {formatTime(notification.created_at)}
                    </span>
                  </div>
                  <div className="flex w-full justify-between items-start gap-2">
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {notification.message}
                    </p>
                    {unread && (
                      <div className="shrink-0 flex items-center justify-center mt-0.5">
                         <div className="h-2 w-2 rounded-full bg-vital-green" />
                      </div>
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })}
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
