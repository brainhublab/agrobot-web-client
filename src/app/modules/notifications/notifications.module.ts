import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NotificationsListComponent } from './components/notifications-list/notifications-list.component';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsState } from './state/notifications.state';



@NgModule({
  declarations: [NotificationsListComponent],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    NzNotificationModule,
    NzListModule,
    NgxsModule.forFeature([NotificationsState]),
    NzButtonModule,
  ]
})
export class NotificationsModule { }
