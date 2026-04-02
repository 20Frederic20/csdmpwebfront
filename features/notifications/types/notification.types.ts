export enum NotificationCategory {
  MEDICAL = 'MEDICAL',
  BILLING = 'BILLING',
  SYSTEM = 'SYSTEM'
}

export interface Notification {
  id?: string;
  id_?: string;
  recipient_id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
  action_url?: string | null;
  resource_id?: string | null;
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
}
