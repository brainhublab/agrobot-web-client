import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsListComponent } from './components/notifications-list/notifications-list.component';


const routes: Routes = [
  { path: 'notifications', component: NotificationsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
