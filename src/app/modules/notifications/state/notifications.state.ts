
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { INotification } from '../models/notification.model';
import { NotificationsActions } from './notifications.actions';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Injectable } from '@angular/core';

export class NotificationsStateModel {
  notifications: INotification[];
}

@State<NotificationsStateModel>({
  name: 'notifications',
  defaults: {
    notifications: [
      {
        id: 0,
        title: 'Notification 0',
        description: 'Test notification',
        seen: false
      },
    ]
  }
})

@Injectable()
export class NotificationsState {

  constructor(private readonly nzNotificationService: NzNotificationService) { }

  @Selector()
  static getNotifications(state: NotificationsStateModel) {
    return state.notifications;
  }

  @Action(NotificationsActions.Add)
  add({ getState, patchState }: StateContext<NotificationsStateModel>, { notification }: NotificationsActions.Add) {
    const state = getState();
    patchState({
      notifications: [...state.notifications, notification],
    });

    this.nzNotificationService.create(
      'info',
      notification.title,
      notification.description
    );
  }

  @Action(NotificationsActions.Remove)
  remove({ getState, patchState }: StateContext<NotificationsStateModel>, { id }: NotificationsActions.Remove) {
    patchState({
      notifications: getState().notifications.filter((a, i) => i !== id)
    });
  }

  @Action(NotificationsActions.Seen)
  makeSeen({ getState, patchState }: StateContext<NotificationsStateModel>, { id }: NotificationsActions.Seen) {
    patchState({
      notifications: getState().notifications.map(n => {
        if (n.id === id) {
          return {
            ...n,
            seen: true
          };
        }

        return n;
      })
    });
  }

}
