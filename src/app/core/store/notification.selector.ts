import { createPropertySelectors } from '@ngxs/store';
import {
  NotificationState,
  NotificationStateModel,
} from './notification.state';

export class NotificationSelector {
  static slices =
    createPropertySelectors<NotificationStateModel>(NotificationState);
}
