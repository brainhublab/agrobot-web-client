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
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { DeviceDetailsComponent } from './components/device-details/device-details.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { DeviceEditorComponent } from './components/device-editor/device-editor.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DevicesListComponent, DeviceDetailsComponent, DeviceEditorComponent, WorkspaceComponent],
  imports: [
    CommonModule,
    FormsModule,
    DevicesRoutingModule,
    NzListModule,
    NzGridModule,
    NzCardModule,
    NzIconModule,
    NzTagModule,
    NzPageHeaderModule,
    NzTabsModule,
    NzButtonModule,
    NzTypographyModule,
    NzToolTipModule,
    NzDividerModule,
    NzSelectModule,
    NzModalModule,
    NzSpinModule,
    SharedModule,
    NgxsModule.forFeature(
      [DevicesState]
    )
  ]
})
export class DevicesModule { }
