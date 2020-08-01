import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevicesRoutingModule } from './devices-routing.module';
import { DevicesListComponent } from './components/devices-list/devices-list.component';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NgxsModule } from '@ngxs/store';
import { DevicesState } from './state/devices.state';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { DeviceDetailsComponent } from './components/device-details/device-details.component';

@NgModule({
  declarations: [DevicesListComponent, DeviceDetailsComponent],
  imports: [
    CommonModule,
    DevicesRoutingModule,
    NzListModule,
    NzGridModule,
    NzCardModule,
    NzIconModule,
    NzToolTipModule,
    NgxsModule.forFeature(
      [DevicesState]
    )
  ]
})
export class DevicesModule { }
