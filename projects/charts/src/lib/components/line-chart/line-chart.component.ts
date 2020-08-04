import { Component, OnInit, AfterViewInit, ElementRef, Input } from '@angular/core';

import { Chart } from '@antv/g2';
import { CUSTOM_G2_ACTIONS } from '../../g2/actions/config';
import DataSet from '@antv/data-set';

@Component({
  selector: 'lib-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, AfterViewInit {
  @Input() maxValue: number = null;
  @Input() minValue: number = null;
  private chart: Chart;

  constructor(
    private readonly elRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const data = [
      { year: '2002', value: 100 },
      { year: '2003', value: 120 },
      { year: '2004', value: 250 },
      { year: '2005', value: 440 },
      { year: '2006', value: 50 },
      { year: '2007', value: 520 },
      { year: '2008', value: 225 },
      { year: '2009', value: 70 },
      { year: '2010', value: 120 },
      { year: '2011', value: 140 },
      { year: '2012', value: 80 },
      { year: '2013', value: 250 },
      { year: '2014', value: 280 },
      { year: '2015', value: 400 },
      { year: '2016', value: 400 },
      { year: '2017', value: 800 },
      { year: '2018', value: 1000 }
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    const max = this.maxValue ? this.maxValue : dv.max('value');
    const min = this.minValue ? this.minValue : dv.min('value');

    this.chart = new Chart({
      container: this.elRef.nativeElement,
      autoFit: true,
      height: 500,
      appendPadding: 20,
    });

    this.chart.scale({
      year: {
        range: [0, 1],
      },
      value: {
        nice: true,
      },
    });

    // load data
    this.chart.data(data);

    // draw lines & points
    this.chart.line().position('year*value').label('value').shape('smooth');
    this.chart.point().position('year*value');

    this.addLine(this.chart, max, '#ff4d4f');
    this.addLine(this.chart, min, '#3498db');


    this.chart.axis('value', {
      label: {
        formatter: (val) => {
          return val + ' °C';
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

    // this.chart.legend();

    // render
    this.chart.render();

  }

  private addLine(chart: Chart, value: number, color: string) {
    this.chart.annotation().line({
      start: ['min', value],
      end: ['max', value],
      style: {
        stroke: color,
        lineWidth: 2,
        lineDash: [3, 3]
      },
      text: {
        position: 'end',
        style: {
          fill: '#8c8c8c',
          fontSize: 15,
          fontWeight: 'normal'
        },
        content: value.toString(),
        offsetY: -5,
        offsetX: -50
      }
    });
  }

}
