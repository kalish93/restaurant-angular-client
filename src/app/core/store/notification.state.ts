import { Injectable } from '@angular/core';
import { StateToken, State, Action, StateContext, Store } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { tap } from 'rxjs';
import { InAppNotification } from '../models/notification.model';
import { PaginatedList } from '../models/paginated-list.interface';
import { NotificationService } from '../services/notification.service';
import {
  CallWaiter,
  GetNotifications,
  GetUnreadCount,
  MarkNotificationAsRead,
  MarkNotificationsAsRead,
  OnNotification,
} from './notifcaction.actions';
import { OperationStatusService } from '../services/operation-status/operation-status.service';
import { successStyle } from '../services/operation-status/status-style-names';

export interface NotificationStateModel {
  unreadNotifications: number;
  myNotifications: any[];
  handle?: string;
}

const NOTIFICATION_STATE_TOKEN = new StateToken<NotificationStateModel>(
  'notification'
);

const defaults: NotificationStateModel = {
  unreadNotifications: 0,
  myNotifications: [],
};

@State<NotificationStateModel>({
  name: NOTIFICATION_STATE_TOKEN,
  defaults: defaults,
})
@Injectable()
export class NotificationState {
  constructor(private notificationService: NotificationService, private store: Store, private operationStatusService: OperationStatusService) {}



  @Action(GetNotifications)
  getNotifications(
    { patchState }: StateContext<NotificationStateModel>,
    {  }: GetNotifications
  ) {
    return this.notificationService.getNotifications().pipe(
      tap((notifications) => {
        patchState({
          myNotifications: notifications,
        });
      })
    );
  }

  @Action(GetUnreadCount)
  getUnreadNotifications(
    { patchState }: StateContext<NotificationStateModel>,
    {  }: GetUnreadCount
  ) {
    return this.notificationService.getUnreadCount().pipe(
      tap((result) => {
        patchState({
          unreadNotifications: result,
        });
      })
    );
  }

  @Action(MarkNotificationsAsRead)
  markNotificationsAsRead(
    { patchState, getState }: StateContext<NotificationStateModel>,
    {  }: MarkNotificationsAsRead
  ) {
    return this.notificationService.markNotificationsAsRead().pipe(
      tap(() => {
        const notifications = getState().myNotifications.map((notification) => ({
          ...notification,
          status: 'read',
        }));
        patchState({
          myNotifications: notifications,
          unreadNotifications: 0,
        });
      })
    );
  }

  @Action(OnNotification)
onNotification(
  { setState, getState }: StateContext<NotificationStateModel>,
  {  }: OnNotification
) {
  return this.notificationService
    .onNotification()
    .pipe(
      tap((data) => {
        const currentNotifications = getState().myNotifications || []; // Ensure it's an array
        console.log('Current Notifications:', currentNotifications);

        setState(
          patch({
            myNotifications: [data, ...currentNotifications],
            unreadNotifications: getState().unreadNotifications + 1
          })
        );
      })
    );
}

@Action(MarkNotificationAsRead)
markNotificationAsRead(
  { setState, getState }: StateContext<NotificationStateModel>,
  { notificationId }: MarkNotificationAsRead
) {
  return this.notificationService.markNotificationAsRead(notificationId).pipe(
    tap((updatedNotification) => {
      // Get the current state
      const state = getState();
      // Update the notifications list by replacing the old notification with the updated one
      const updatedNotifications = state.myNotifications.map(notification =>
        notification.id === updatedNotification.id ? updatedNotification : notification
      );

      setState({
        unreadNotifications: state.unreadNotifications - 1,
        myNotifications: updatedNotifications
      });
    })
  );
}

@Action(CallWaiter)
callWaiter(
  { setState, getState }: StateContext<NotificationStateModel>,
  { data }: CallWaiter
) {
  return this.notificationService.callWaiter(data).pipe(
    tap((updatedNotification) => {

      setState(
        patch({

        })

      );
      this.operationStatusService.displayStatus('Waiters are notified, some one will be here shortly.', successStyle)

    })
  );
}


}
