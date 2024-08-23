import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { RxState } from '@rx-angular/state';
import { take } from 'rxjs';
import { NotificationFacade } from '../../facades/notification.facade';

interface NotificationButtonState {
  unreadNotifications: number;
  handle?: string;
}

const initalState: NotificationButtonState = {
  unreadNotifications: 0,
};

@Component({
  selector: 'app-notification-button',
  templateUrl: './notification-button.component.html',
  styleUrls: ['./notification-button.component.scss'],
})
export class NotificationButtonComponent implements OnInit, OnDestroy {
  @Output() openNotificationMenu: EventEmitter<void> = new EventEmitter<void>();

  unreadNotifications$ = this.state.select('unreadNotifications');

  constructor(
    private notificationFacade: NotificationFacade,
    public state: RxState<NotificationButtonState>
  ) {
    this.state.set(initalState);
    this.state.connect('handle', this.notificationFacade.handle$);
    this.state.connect(
      'unreadNotifications',
      this.notificationFacade.unreadNotifications$
    );
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.notificationFacade.dispatchGetNotificationStatus();

    this.state.select('handle').subscribe((handle) => {
      if (handle)
        this.notificationFacade.dispatchSyncUnreadNotifications(handle);
    });
  }
}
