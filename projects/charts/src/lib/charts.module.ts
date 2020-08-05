import { NgModule } from '@angular/core';
import { LineChartComponent } from './components/line-chart/line-chart.component';

// import custom g2 actions
import './g2/actions';
// custom chapes
import './g2/shapes';


@NgModule({
  declarations: [LineChartComponent],
  imports: [
  ],
  exports: [LineChartComponent]
})
export class ChartsModule { }
