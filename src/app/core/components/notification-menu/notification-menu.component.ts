import { Component, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { RxState } from '@rx-angular/state';
import { NotificationFacade } from '../../facades/notification.facade';
import { InAppNotification } from '../../models/notification.model';
import { PaginatedList } from '../../models/paginated-list.interface';
import { NotificationService } from '../../services/notification.service';
import { AuthFacade } from 'src/app/auth/facade/auth.facade';
import{ jwtDecode} from 'jwt-decode';

interface NotificationsState {
  handle?: string;
  unreadNotifications: number;
  notifications: any[];
  accessToken: any;
}

const initalState: NotificationsState = {
  notifications: [],
  unreadNotifications: 0,
  accessToken: {}
};

@Component({
  selector: 'app-notification-menu',
  templateUrl: './notification-menu.component.html',
  styleUrls: ['./notification-menu.component.scss'],
})
export class NotificationMenuComponent implements OnInit {
  notifications$ = this.state.select('notifications');
  unreadNotifications$ = this.state.select('unreadNotifications');
  accessToken$ = this.state.select('accessToken');
  decoded :any;
  notifications: any[]= []
userId: any;
  constructor(
    private notificationFacade: NotificationFacade,
    public state: RxState<NotificationsState>,
    private destoryRef: DestroyRef,
    private notificationService: NotificationService,
    private authFacade: AuthFacade
  ) {
    this.state.set(initalState);
    this.state.connect('notifications', this.notificationFacade.myNotifications$);
    this.state.connect(
      'unreadNotifications',
      this.notificationFacade.unreadNotifications$
    );


    this.state.connect('accessToken', this.authFacade.accessToken$);
    this.accessToken$.subscribe((token)=>{
       this.decoded = jwtDecode(token);
       this.userId = this.decoded?.use?.id;
       this.notificationService.registerUser(this.userId);

    })
  }

  ngOnInit(): void {

    this.notificationService.registerUser(this.userId);

    this.notificationFacade.dispatchOnNotification()
    this.notificationFacade.dispatchGetNotifications();
    this.state
      .select('unreadNotifications')
      .pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe(() => this.notificationFacade.dispatchGetNotifications());

    this.notifications$.subscribe((data)=>{
      console.log(data)
    })
  }

  markAllNotificationAsRead() {
    this.notificationFacade.dispatchMarkAllNotificationsRead();
  }

  markNotificationAsRead(notification: InAppNotification) {
    console.log(notification.id)
    this.notificationFacade.dispatchMarkNotificationAsRead([
      notification.id,
    ]);
  }
}
