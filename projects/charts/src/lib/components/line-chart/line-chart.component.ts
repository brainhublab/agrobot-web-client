import { Component, OnInit, AfterViewInit, ElementRef, Input } from '@angular/core';

import { Chart } from '@antv/g2';
import { CUSTOM_G2_ACTIONS } from '../../g2/actions/config';
import DataSet from '@antv/data-set';
import { drawUniformLine } from '../../g2/utils';

@Component({
  selector: 'lib-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, AfterViewInit {
  @Input() maxValue: number = null;
  @Input() minValue: number = null;
  @Input() data: Array<{ timestamp: string, value: number }> = [
    { timestamp: '21:59:02 2020-12-31', value: 20 },
    { timestamp: '21:59:03 2020-12-31', value: 20 },
    { timestamp: '21:59:04 2020-12-31', value: 21 },
    { timestamp: '21:59:05 2020-12-31', value: 21 },
    { timestamp: '21:59:06 2020-12-31', value: 22 },
    { timestamp: '21:59:07 2020-12-31', value: 21 },
    { timestamp: '21:59:08 2020-12-31', value: 25 },
    { timestamp: '21:59:09 2020-12-31', value: 27 },
    { timestamp: '21:59:10 2020-12-31', value: 33 },
    { timestamp: '21:59:11 2020-12-31', value: 35 },
    { timestamp: '21:59:12 2020-12-31', value: 30 },
    { timestamp: '21:59:13 2020-12-31', value: 25 },
    { timestamp: '21:59:14 2020-12-31', value: 23 },
    { timestamp: '21:59:15 2020-12-31', value: 24 },
    { timestamp: '21:59:16 2020-12-31', value: 23 },
    { timestamp: '21:59:17 2020-12-31', value: 22 },
    { timestamp: '21:59:18 2020-12-31', value: 20 },
  ];

  @Input() valueFormatter = (val) => {
    return val + ' °C';
  }

  private chart: Chart;

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

    const uniformLinesFormatter = (v: number) => this.valueFormatter(v.toPrecision(3))
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

    // render
    this.chart.render();
  }

}
