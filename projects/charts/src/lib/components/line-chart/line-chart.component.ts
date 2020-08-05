import { Component, OnInit, AfterViewInit, ElementRef, Input } from '@angular/core';

import { Chart, View } from '@antv/g2';
import { CUSTOM_G2_ACTIONS } from '../../g2/actions/config';
import DataSet from '@antv/data-set';
import { drawUniformLine } from '../../g2/utils';


export type LineChartData = Array<{ timestamp: string, value: number }>;

@Component({
  selector: 'lib-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, AfterViewInit {
  private chart: Chart;
  private slider: View;

  @Input() maxValue: number = null;
  @Input() minValue: number = null;
  @Input() data: LineChartData = [];

  @Input() valueFormatter = (val) => val;

  constructor(
    private readonly elRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const ds = new DataSet();
    const dv = ds.createView().source(this.data);
    const max = this.maxValue ? this.maxValue : dv.max('value');
    const min = this.minValue ? this.minValue : dv.min('value');
    const mean = dv.mean('value');

    this.chart = new Chart({
      container: this.elRef.nativeElement,
      autoFit: true,
      height: 500,
      appendPadding: 20,
    });

    this.chart.scale({
      timestamp: {
        range: [0, 1],
      },
      value: {
        nice: true,
      },
    });

    // load data
    this.chart.data(dv.rows);

    // draw lines & points
    this.chart.line().position('timestamp*value').label('value').shape('smooth');
    this.chart.point().position('timestamp*value');

    const uniformLinesFormatter = (v: number) => this.valueFormatter(v.toPrecision(3));
    drawUniformLine(this.chart, max, { color: '#ff4d4f', valueFormatter: uniformLinesFormatter });
    drawUniformLine(this.chart, min, { color: '#3498db', valueFormatter: uniformLinesFormatter });
    drawUniformLine(this.chart, mean, { color: '#d0db34', valueFormatter: uniformLinesFormatter });

    this.chart.axis('value', {
      label: {
        formatter: this.valueFormatter,
      },
    });

    this.chart.axis('timestamp', {
      label: {
        formatter: (timestamp) => {
          return timestamp.split(' ').shift();
        },
      },
    });


    // interactions
    this.chart.interaction(CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON);
    // this.chart.interaction('view-zoom');

    this.chart.tooltip({
      shared: true,
      showCrosshairs: true,
      crosshairs: {
        type: 'x',
        line: {
          style: {
            lineDash: [4],
          },
        },
        follow: false
      }
    });

    // slider
    this.slider = this.chart.option('slider', {
      height: 50,
    });

    // render
    this.chart.render();
  }

}
