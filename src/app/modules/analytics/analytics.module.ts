import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { ChartsModule } from 'projects/charts/src/src';


@NgModule({
  declarations: [AnalyticsComponent],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    ChartsModule,
  ]
})
export class AnalyticsModule { }
