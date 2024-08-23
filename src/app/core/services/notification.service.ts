import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as SignalR from '@microsoft/signalr';
import {
  MARK_NOTIFICATION_URL,
  NOTIFICATION_HUB_URL,
  NOTIFICATION_STATUS_URL,
  NOTIFICATION_URL,
} from '../constants/api-endpoints';
import { InAppNotification } from '../models/notification.model';
import { PaginatedList } from '../models/paginated-list.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private hubConnection = new SignalR.HubConnectionBuilder()
    .withUrl(NOTIFICATION_HUB_URL, {})
    .withAutomaticReconnect()
    .build();

  constructor(private http: HttpClient) {}

  startConnection() {
    return this.hubConnection.start();
  }

  registerEvent(eventName: string, callback: (...args: any[]) => void) {
    this.hubConnection.on(eventName, callback);
  }

  stopConnection() {
    this.hubConnection.stop();
  }

  getNotificationStatus() {
    // return this.http.get<{ unreadNotifications: number; handle: string }>(
    //   NOTIFICATION_STATUS_URL
    // );
  }

  getNotification(pageNumber: number = 1, pageSize: number = 10) {
    // return this.http.get<PaginatedList<InAppNotification>>(NOTIFICATION_URL, {
    //   params: new HttpParams()
    //     .set('pageNumber', pageNumber)
    //     .set('pageSize', pageSize),
    // });
  }

  markNotifictionsAsRead(notifcactionIds: string[], all: boolean) {
    return this.http.post(MARK_NOTIFICATION_URL, null, {
      params: new HttpParams().appendAll({
        all,
        notificationIds: notifcactionIds,
      }),
    });
  }
}
