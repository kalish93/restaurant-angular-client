import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { InAppNotification } from '../models/notification.model';
import { PaginatedList } from '../models/paginated-list.interface';
import {

  CallWaiter,
  GetNotifications,
  GetUnreadCount,
  MarkNotificationAsRead,
  MarkNotificationsAsRead,
  OnNotification,
} from '../store/notifcaction.actions';
import { NotificationSelector } from '../store/notification.selector';

@Injectable({
  providedIn: 'root',
})
export class NotificationFacade {
  constructor(private store: Store) {}


  dispatchGetNotifications() {
    this.store.dispatch(new GetNotifications());
  }

  dispatchMarkAllNotificationsRead() {
    this.store.dispatch(new MarkNotificationsAsRead());
  }

  dispatchOnNotification() {
    this.store.dispatch(new OnNotification());
  }

  dispatchUnreadNotificationsCount() {
    this.store.dispatch(new GetUnreadCount());
  }

  dispatchMarkNotificationAsRead(id:any) {
    this.store.dispatch(new MarkNotificationAsRead(id));
  }

  dispatchCallWaiter(data:any) {
    this.store.dispatch(new CallWaiter(data));
  }

  unreadNotifications$: Observable<number> = this.store.select(
    NotificationSelector.slices.unreadNotifications
  );

  handle$: Observable<string | undefined> = this.store.select(
    NotificationSelector.slices.handle
  );

  myNotifications$: Observable<any[]> =
    this.store.select(NotificationSelector.slices.myNotifications);
}
