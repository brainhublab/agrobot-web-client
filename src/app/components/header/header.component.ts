import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationsState } from 'src/app/modules/notifications/state/notifications.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  notificationsCounter$: Observable<number>;
  constructor(
    private readonly store: Store
  ) { }

  ngOnInit(): void {
    this.notificationsCounter$ = this.store.select(NotificationsState.getNotifications).pipe(map(nl => nl?.filter(v => !v.seen).length));
  }

}
