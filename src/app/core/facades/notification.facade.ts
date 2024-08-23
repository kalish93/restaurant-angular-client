import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { InAppNotification } from '../models/notification.model';
import { PaginatedList } from '../models/paginated-list.interface';
import {
  GetNotification,
  GetNotificationStatus,
  MarkNotificationsAsRead,
  SyncUnreadNotifications,
} from '../store/notifcaction.actions';
import { NotificationSelector } from '../store/notification.selector';

@Injectable({
  providedIn: 'root',
})
export class NotificationFacade {
  constructor(private store: Store) {}

  dispatchSyncUnreadNotifications(userId: string) {
    this.store.dispatch(new SyncUnreadNotifications(userId));
  }

  dispatchGetNotificationStatus() {
    this.store.dispatch(new GetNotificationStatus());
  }

  dispatchGetNotifications(pageNumber: number, pageSize: number) {
    this.store.dispatch(new GetNotification(pageNumber, pageSize));
  }

  dispatchMarkAllNotificationsRead() {
    this.store.dispatch(new MarkNotificationsAsRead([], true));
  }

  dispatchMarkSomeNotificationsAsRead(ids: string[]) {
    this.store.dispatch(new MarkNotificationsAsRead(ids));
  }

  unreadNotifications$: Observable<number> = this.store.select(
    NotificationSelector.slices.unreadNotifications
  );

  handle$: Observable<string | undefined> = this.store.select(
    NotificationSelector.slices.handle
  );

  notifications$: Observable<PaginatedList<InAppNotification>> =
    this.store.select(NotificationSelector.slices.notifications);
}
