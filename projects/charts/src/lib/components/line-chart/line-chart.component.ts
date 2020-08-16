import { Component, OnInit, AfterViewInit, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

import { Chart, View } from '@antv/g2';
import { CUSTOM_G2_ACTIONS } from '../../g2/actions/config';
import DataSet from '@antv/data-set';
import { drawUniformLine } from '../../g2/utils';
import { interval, BehaviorSubject, Subscription } from 'rxjs';
import { FilterCondition } from '@antv/g2/lib/interface';
import { parse as parseDate } from 'date-fns';
import { skip } from 'rxjs/operators';
import GrammarInteraction from '@antv/g2/lib/interaction/grammar-interaction';


export type LineChartDataRow = { timestamp: string, value: number };
export type LineChartData = Array<LineChartDataRow>;

@Component({
  selector: 'lib-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  private chart: Chart;
  private sliderView: View;
  private mainView: View;

  @Input() maxValue: number = null;
  @Input() minValue: number = null;
  @Input() dateRange: [Date, Date];
  @Input() dataSubject: BehaviorSubject<LineChartData>;
  private dataSub: Subscription;

  private dv: any;
  @Input() valueFormatter = (val) => val.toPrecision(3);

  private uniformLinesFormatter = (v: number) => this.valueFormatter(v.toPrecision(3));

  constructor(
    private readonly elRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    const ds = new DataSet();
    this.dv = ds.createView().source(this.dataSubject.getValue());

    this.chart = new Chart({
      container: this.elRef.nativeElement,
      autoFit: true,
      height: 500,
      appendPadding: 20,
      defaultInteractions: []
    });

    this.initMainView();
    this.initSliderView();

    // render
    this.chart.render();

    this.dataSub = this.dataSubject.pipe(skip(1)).subscribe(newData => {
      newData.forEach(this.addDataRow.bind(this));
    });
  }

  private initMainView() {
    this.mainView = this.chart.createView({
      region: {
        start: {
          x: 0,
          y: 0
        },
        end: {
          x: 1,
          y: 0.7
        }
      },
      padding: [0, 10, 20, 60]
    });

    this.mainView.scale({
      timestamp: {
        range: [0, 1],
      },
      value: {
        nice: true,
      },
    });

    // load data
    this.mainView.data(this.dv.rows);

    // draw lines & points
    this.mainView.line().position('timestamp*value').shape('smooth');
    this.mainView.point().position('timestamp*value').label('value', (value) => {
      return {
        content: this.valueFormatter(value.toPrecision(3)),
      };
    });

    this.drawAggregateFunValues();

    this.mainView.axis('value', {
      label: {
        formatter: this.valueFormatter,
      },
    });

    this.mainView.axis('timestamp', {
      label: {
        formatter: (timestamp) => {
          return timestamp.split(' ').shift();
        },
      },
    });


    // interactions
    this.mainView.interaction(CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON);
    this.mainView.interaction('tooltip');

    this.mainView.tooltip({
      shared: false,
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

  }
  private initSliderView() {
    this.sliderView = this.chart.createView({
      region: {
        start: {
          x: 0,
          y: 0.8
        },
        end: {
          x: 1,
          y: 1
        }
      },
      padding: [0, 10, 20, 60]
    });

    this.sliderView.interaction('sibling-rect-filter');
    this.sliderView.interaction('tooltip');
    this.sliderView.tooltip(true);
    this.sliderView.axis(false);
    this.sliderView.area().position('timestamp*value');

    this.sliderView.data(this.dv.rows);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dateRange?.currentValue !== changes.dateRange?.previousValue) {
      const xScale = this.mainView.getXScale();

      // hide slider rect
      // TODO: can't figure out how to reset the x-rect-mask without having a reference to mask shape
      this.sliderView.removeInteraction('sibling-rect-filter');
      this.sliderView.interaction('sibling-rect-filter');
      // this.sliderView.emit('x-rect-mask:end');
      // const interaction = this.sliderView.interactions['sibling-rect-filter'] as GrammarInteraction;
      // interaction.context.

      // remove all filters
      this.filterView(this.mainView, xScale.field, null);
      this.filterView(this.sliderView, xScale.field, null);

      if (this.dateRange?.length === 2) {
        // filter the view
        const filterFn = (dateString) => {
          if (this.dateRange) {
            const date = parseDate(dateString, 'HH:mm:ss yyyy-MM-dd', new Date());
            return (date >= this.dateRange[0]) && (date <= this.dateRange[1]);
          } else {
            return true;
          }
        };

        this.filterView(this.mainView, xScale.field, filterFn);
        this.filterView(this.sliderView, xScale.field, filterFn);
      }
    }

  }

  private filterView(view: View, field: string, filter: FilterCondition) {
    view.filter(field, filter);
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
    this.mainView.changeData(this.dv.rows);
    this.sliderView.changeData(this.dv.rows);
  }

  /**
   * Plots several aggregate functions for the current dataview
   */
  private drawAggregateFunValues() {
    const max = this.maxValue ? this.maxValue : this.dv.max('value');
    const min = this.minValue ? this.minValue : this.dv.min('value');
    const mean = this.dv.mean('value');

    this.mainView.annotation().clear(true);

    drawUniformLine(this.mainView, max, { color: '#ff4d4f', valueFormatter: this.uniformLinesFormatter });
    drawUniformLine(this.mainView, min, { color: '#3498db', valueFormatter: this.uniformLinesFormatter });
    drawUniformLine(this.mainView, mean, { color: '#d0db34', valueFormatter: this.uniformLinesFormatter });
  }
}
