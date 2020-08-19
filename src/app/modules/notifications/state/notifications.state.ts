import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UIMqttService } from '../../shared/mqtt/mqtt.service';
import { INotification } from '../models/notification.model';
import { NotificationsActions } from './notifications.actions';

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
export class NotificationsState implements NgxsOnInit {

  constructor(
    private readonly nzNotificationService: NzNotificationService,
    private readonly uiMqttService: UIMqttService) { }

  @Selector()
  static getNotifications(state: NotificationsStateModel) {
    return state.notifications;
  }

  ngxsOnInit(ctx: StateContext<NotificationsState>) { }

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
