import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ChartsModule } from 'projects/charts/src/src';
import { SharedModule } from '../shared/shared.module';
import { DeviceChartsComponent } from './components/device-charts/device-charts.component';
import { DeviceDetailsComponent } from './components/device-details/device-details.component';
import { DeviceEditorComponent } from './components/device-editor/device-editor.component';
import { DevicesListComponent } from './components/devices-list/devices-list.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { DevicesRoutingModule } from './devices-routing.module';
import { DevicesState } from './state/devices.state';
import { NzMessageModule } from 'ng-zorro-antd/message';


@NgModule({
  declarations: [DevicesListComponent, DeviceDetailsComponent, DeviceEditorComponent, WorkspaceComponent, DeviceChartsComponent],
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
    NzDatePickerModule,
    SharedModule,
    ChartsModule,
    NzMessageModule,
    NgxsModule.forFeature(
      [DevicesState]
    )
  ]
})
export class DevicesModule { }
