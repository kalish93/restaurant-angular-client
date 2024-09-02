import {
  NotificationState,
  NotificationStateModel,
} from './notification.state';

import { Selector, createPropertySelectors } from '@ngxs/store';

export class NotificationSelector {
  static slices =
    createPropertySelectors<NotificationStateModel>(NotificationState);

  @Selector([NotificationState])
  static stocks(stateModel: NotificationStateModel) {
    return stateModel.myNotifications;
  }

}
