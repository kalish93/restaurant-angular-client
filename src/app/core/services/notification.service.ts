import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as SignalR from '@microsoft/signalr';
import {
  API_BASE_URL,
  BASE_URL,
  MARK_NOTIFICATION_URL,
  NOTIFICATION_HUB_URL,
  NOTIFICATION_STATUS_URL,
  NOTIFICATION_URL,
} from '../constants/api-endpoints';
import { InAppNotification } from '../models/notification.model';
import { PaginatedList } from '../models/paginated-list.interface';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { GetActiveOrders } from 'src/app/restaurant/store/order/order.actions';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: Socket;

  constructor(private http: HttpClient, private store: Store,
  ) {
    const token = localStorage.getItem('accessToken');

    this.socket = io(BASE_URL, {
      query: { token }
    });
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  registerUser(userId: string) {
    this.socket.emit('register', userId);
  }

  onNotification() {
    return new Observable((observer) => {
      this.socket.on('notification', (data) => {
        console.log('Notification received:', data);
        this.store.dispatch( new GetActiveOrders())
        observer.next(data);
      });
    });
  }


  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${API_BASE_URL}/notifications/unread-count`);
  }

  getNotifications(): Observable<InAppNotification[]> {
    return this.http.get<InAppNotification[]>(`${API_BASE_URL}/notifications`);
  }

  markNotificationsAsRead(): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/notifications/mark-as-read`, {});
  }

  markNotificationAsRead(id: any): Observable<any> {
    return this.http.post<any>(`${API_BASE_URL}/notifications/${id}/mark-as-read`, {});
  }

  callWaiter(data: any): Observable<any> {
    return this.http.post<any>(`${API_BASE_URL}/notifications/call-waiter`, data);
  }
}
