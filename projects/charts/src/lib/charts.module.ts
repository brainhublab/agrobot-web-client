import { NgModule } from '@angular/core';
import { ChartsComponent } from './charts.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';

// import custom g2 actions
import './g2/actions';
// custom chapes
import './g2/shapes';


@NgModule({
  declarations: [ChartsComponent, LineChartComponent],
  imports: [
  ],
  exports: [ChartsComponent, LineChartComponent]
})
export class ChartsModule { }
