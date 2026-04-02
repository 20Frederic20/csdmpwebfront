import { FetchService } from '@/features/core/services/fetch.service';
import { Notification, NotificationsResponse } from '../types/notification.types';

export class NotificationService {
  private static readonly ENDPOINT = 'notifications';

  static async getNotifications(): Promise<Notification[]> {
    try {
      const response = await FetchService.get<Notification[] | NotificationsResponse>(this.ENDPOINT, 'notifications');
      
      if (Array.isArray(response)) {
        return response;
      } else if (response && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  static async markAsRead(id: string | number): Promise<void> {
    try {
      await FetchService.patch(`${this.ENDPOINT}/${id}/read`, undefined, 'mark notification as read');
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  }

  static async markAllAsRead(): Promise<void> {
    try {
      await FetchService.post(`${this.ENDPOINT}/mark-all-read`, undefined, 'mark all notifications as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }
}
