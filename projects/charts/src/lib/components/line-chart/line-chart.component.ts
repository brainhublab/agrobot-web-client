import { Component, OnInit, AfterViewInit, ElementRef, Input } from '@angular/core';

import { Chart, View } from '@antv/g2';
import { CUSTOM_G2_ACTIONS } from '../../g2/actions/config';
import DataSet from '@antv/data-set';
import { drawUniformLine } from '../../g2/utils';
import { interval } from 'rxjs';


export type LineChartDataRow = { timestamp: string, value: number };
export type LineChartData = Array<LineChartDataRow>;

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

  private dv: any;
  @Input() valueFormatter = (val) => val.toPrecision(3);

  private uniformLinesFormatter = (v: number) => this.valueFormatter(v.toPrecision(3));

  constructor(
    private readonly elRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const ds = new DataSet();
    this.dv = ds.createView().source(this.data);

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
    this.chart.data(this.dv.rows);

    // draw lines & points
    this.chart.line().position('timestamp*value').shape('smooth');
    this.chart.point().position('timestamp*value').label('value', (value) => {
      return {
        content: this.valueFormatter(value.toPrecision(3)),
      };
    });

    this.drawAggregateFunValues();

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
    // this.chart.option('slider', {
    //   height: 50,
    // });

    // render
    this.chart.render();

    interval(1000).subscribe(_ => {
      const date = new Date();
      const dateStr = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      this.addDataRow({ timestamp: dateStr, value: Math.random() * 100 });
    });
  }

  /**
   * Adds new data row to existing data view and updates the chart
   * @param row new data row
   */
  addDataRow(row: LineChartDataRow) {
    // TODO: this does not affect the range selected using brush, but affects the slider view
    // the first value is shown, after that the history starts the 'recovery' process
    this.dv.addRow(row);

    this.drawAggregateFunValues();
    this.chart.changeData(this.dv.rows);
  }

  /**
   * Plots several aggregate functions for the current dataview
   */
  private drawAggregateFunValues() {
    const max = this.maxValue ? this.maxValue : this.dv.max('value');
    const min = this.minValue ? this.minValue : this.dv.min('value');
    const mean = this.dv.mean('value');

    this.chart.annotation().clear(true);

    drawUniformLine(this.chart, max, { color: '#ff4d4f', valueFormatter: this.uniformLinesFormatter });
    drawUniformLine(this.chart, min, { color: '#3498db', valueFormatter: this.uniformLinesFormatter });
    drawUniformLine(this.chart, mean, { color: '#d0db34', valueFormatter: this.uniformLinesFormatter });
  }
}
