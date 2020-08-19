import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { NotificationsState } from '../../state/notifications.state';
import { INotification } from '../../models/notification.model';
import { Observable } from 'rxjs';
import { NotificationsActions } from '../../state/notifications.actions';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {

  @Select(NotificationsState.getNotifications) notifications$: Observable<Array<INotification>>;

  constructor(private store: Store) { }
  ngOnInit(): void {
  }

  seenNotification(notification: INotification) {
    if (!notification.seen) {
      this.store.dispatch(new NotificationsActions.Seen(notification.id));
    }
  }

}
