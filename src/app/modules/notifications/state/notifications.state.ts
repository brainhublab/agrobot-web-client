
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Notification } from '../models/notification.model';
import { NotificationsActions } from './notifications.actions';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Injectable } from '@angular/core';

export class NotificationsStateModel {
  notifications: Notification[];
}

@State<NotificationsStateModel>({
  name: 'notifications',
  defaults: {
    notifications: [
      {
        title: 'Notification 0',
        description: 'Test notification'
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

}
