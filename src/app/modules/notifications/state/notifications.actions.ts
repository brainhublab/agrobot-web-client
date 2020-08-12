import { INotification } from '../models/notification.model';

export namespace NotificationsActions {
  export class Add {
    static readonly type = '[NOTIFICATIONS] Add';

    constructor(public notification: INotification) { }
  }

  export class Remove {
    static readonly type = '[NOTIFICATIONS] Remove';

    constructor(public id: number) { }
  }

  export class Seen {
    static readonly type = '[NOTIFICATIONS] Seen';

    constructor(public id: number) { }
  }
}

