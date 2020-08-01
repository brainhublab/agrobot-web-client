import { Notification } from '../models/notification.model';

export namespace NotificationsActions {
  export class Add {
    static readonly type = '[NOTIFICATIONS] Add';

    constructor(public notification: Notification) { }
  }

  export class Remove {
    static readonly type = '[NOTIFICATIONS] Remove';

    constructor(public id: number) { }
  }
}

