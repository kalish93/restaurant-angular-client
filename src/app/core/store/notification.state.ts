import { Injectable } from '@angular/core';
import { StateToken, State, Action, StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { tap } from 'rxjs';
import { InAppNotification } from '../models/notification.model';
import { PaginatedList } from '../models/paginated-list.interface';
import { NotificationService } from '../services/notification.service';
import {
  GetNotification,
  GetNotificationStatus,
  MarkNotificationsAsRead,
  SyncUnreadNotifications,
} from './notifcaction.actions';

export interface NotificationStateModel {
  unreadNotifications: number;
  notifications: PaginatedList<InAppNotification>;
  handle?: string;
}

const NOTIFICATION_STATE_TOKEN = new StateToken<NotificationStateModel>(
  'notification'
);

const defaults: NotificationStateModel = {
  unreadNotifications: 0,
  notifications: { items: [], pageNumber: 1, totalPages: 0, totalCount: 0 },
};

@State<NotificationStateModel>({
  name: NOTIFICATION_STATE_TOKEN,
  defaults: defaults,
})
@Injectable()
export class NotificationState {
  constructor(private notificationService: NotificationService) {}

  @Action(SyncUnreadNotifications)
  syncUnReadNotifications(
    { patchState }: StateContext<NotificationStateModel>,
    { userId }: SyncUnreadNotifications
  ) {
    this.notificationService.startConnection().then(() => {
      this.notificationService.registerEvent(
        userId,
        (n: { unreadNotifications: number }) => {
          patchState({ unreadNotifications: n.unreadNotifications });
        }
      );
    });
  }

  @Action(GetNotificationStatus)
  getUnReadNotifications(
    { patchState }: StateContext<NotificationStateModel>,
    {}: GetNotificationStatus
  ) {
    // return this.notificationService.getNotificationStatus().pipe(
    //   tap((n) => {
    //     patchState({
    //       unreadNotifications: n.unreadNotifications,
    //       handle: n.handle,
    //     });
    //   })
    // );
  }

  @Action(GetNotification)
  getNotifications(
    { patchState }: StateContext<NotificationStateModel>,
    { pageNumber, pageSize }: GetNotification
  ) {
    // return this.notificationService.getNotification(pageNumber, pageSize).pipe(
    //   tap((notifications) => {
    //     patchState({
    //       notifications,
    //     });
    //   })
    // );
  }

  @Action(MarkNotificationsAsRead)
  markNotificationsAsRead(
    { setState, getState }: StateContext<NotificationStateModel>,
    { notificationIds, all }: MarkNotificationsAsRead
  ) {
    return this.notificationService
      .markNotifictionsAsRead(notificationIds, all)
      .pipe(
        tap(() => {
          setState(
            patch({
              unreadNotifications: all
                ? 0
                : getState().unreadNotifications - notificationIds.length,
              notifications: patch({
                items: getState().notifications.items.map((item) => {
                  return { ...item, isViewed: true };
                }),
              }),
            })
          );
        })
      );
  }
}
