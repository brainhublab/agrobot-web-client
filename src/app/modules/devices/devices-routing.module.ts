import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevicesListComponent } from './components/devices-list/devices-list.component';
import { DeviceDetailsComponent } from './components/device-details/device-details.component';


const routes: Routes = [
  {
    path: 'details/:deviceID',
    component: DeviceDetailsComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    component: DevicesListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevicesRoutingModule { }
