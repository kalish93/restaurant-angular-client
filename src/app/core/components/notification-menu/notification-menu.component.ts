import { Component, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { RxState } from '@rx-angular/state';
import { NotificationFacade } from '../../facades/notification.facade';
import { InAppNotification } from '../../models/notification.model';
import { PaginatedList } from '../../models/paginated-list.interface';

interface NotificationsState {
  handle?: string;
  unreadNotifications: number;
  notifications: PaginatedList<InAppNotification>;
}

const initalState: NotificationsState = {
  notifications: { items: [], pageNumber: 1, totalPages: 0, totalCount: 0 },
  unreadNotifications: 0,
};

@Component({
  selector: 'app-notification-menu',
  templateUrl: './notification-menu.component.html',
  styleUrls: ['./notification-menu.component.scss'],
})
export class NotificationMenuComponent implements OnInit {
  notifications$ = this.state.select('notifications');
  unreadNotifications$ = this.state.select('unreadNotifications');

  constructor(
    private notificationFacade: NotificationFacade,
    public state: RxState<NotificationsState>,
    private destoryRef: DestroyRef
  ) {
    this.state.set(initalState);
    this.state.connect('notifications', this.notificationFacade.notifications$);
    this.state.connect(
      'unreadNotifications',
      this.notificationFacade.unreadNotifications$
    );
  }

  ngOnInit(): void {
    this.notificationFacade.dispatchGetNotifications(1, 10);
    this.state
      .select('unreadNotifications')
      .pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe(() => this.notificationFacade.dispatchGetNotifications(1, 10));
  }

  paginateNotifications(event: PageEvent) {
    this.notificationFacade.dispatchGetNotifications(
      event.pageIndex + 1,
      event.pageSize
    );
  }

  markAllNotificationAsRead() {
    this.notificationFacade.dispatchMarkAllNotificationsRead();
  }

  markNotificationAsRead(notification: InAppNotification) {
    this.notificationFacade.dispatchMarkSomeNotificationsAsRead([
      notification.id,
    ]);
  }
}
