export class GetNotifications {
  static readonly type = '[Notification] Get Notifications';
  constructor() {}
}

export class MarkNotificationsAsRead {
  static readonly type = '[Notification] Mark Notifications As Read';
  constructor() {}
}
export class MarkNotificationAsRead {
  static readonly type = '[Notification] Mark Notification As Read';
  constructor(public notificationId: string) {}
}
export class GetUnreadCount {
  static readonly type = '[Notification] Get Unread Count';
  constructor() {}
}
export class OnNotification{
  static readonly type = `[Notification] ${OnNotification.name}`;
  constructor() {}
}
export class CallWaiter{
  static readonly type = `[Notification] ${CallWaiter.name}`;
  constructor(public data: any) {}
}
