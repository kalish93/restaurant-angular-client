export class SyncUnreadNotifications {
  static readonly type = `[Notification] ${SyncUnreadNotifications.name}`;
  constructor(public userId: string) {}
}

export class GetNotificationStatus {
  static readonly type = `[Notification] ${GetNotificationStatus.name}`;
  constructor() {}
}

export class GetNotification {
  static readonly type = `[Notification] ${GetNotificationStatus.name}`;
  constructor(public pageNumber: number, public pageSize: number) {}
}

export class MarkNotificationsAsRead {
  static readonly type = `[Notification] ${MarkNotificationsAsRead.name}`;
  constructor(public notificationIds: string[], public all: boolean = false) {}
}
