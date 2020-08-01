import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsListComponent } from './components/notifications-list/notifications-list.component';
import { NgxsModule } from '@ngxs/store';
import { NotificationsState } from './state/notifications.state';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationModule } from 'ng-zorro-antd/notification';


@NgModule({
  declarations: [NotificationsListComponent],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    NzNotificationModule,
    NgxsModule.forFeature([NotificationsState]),
    NzButtonModule,
  ]
})
export class NotificationsModule { }