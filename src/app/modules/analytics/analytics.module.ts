import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { ChartsModule } from 'projects/charts/src/src';

import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { DevicesStatsComponent } from './components/devices-stats/devices-stats.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@NgModule({
  declarations: [AnalyticsComponent, DevicesStatsComponent],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    ChartsModule,
    NzStatisticModule,
    NzGridModule,
    NzTypographyModule
  ]
})
export class AnalyticsModule { }
