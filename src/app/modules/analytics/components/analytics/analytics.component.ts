import { Component, OnInit } from '@angular/core';
import { LineChartData } from 'projects/charts/src/lib/components/line-chart/line-chart.component';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  public waterLevelData: LineChartData = [
    { timestamp: '21:59:02 2020-12-31', value: 20 },
    { timestamp: '21:59:03 2020-12-31', value: 21 },
    { timestamp: '21:59:04 2020-12-31', value: 21 },
    { timestamp: '21:59:05 2020-12-31', value: 21 },
    { timestamp: '21:59:06 2020-12-31', value: 22 },
    { timestamp: '21:59:07 2020-12-31', value: 21 },
    { timestamp: '21:59:08 2020-12-31', value: 19 },
    { timestamp: '21:59:09 2020-12-31', value: 17 },
    { timestamp: '21:59:10 2020-12-31', value: 16 },
    { timestamp: '21:59:11 2020-12-31', value: 15 },
    { timestamp: '21:59:12 2020-12-31', value: 18 },
    { timestamp: '21:59:13 2020-12-31', value: 20 },
    { timestamp: '21:59:14 2020-12-31', value: 22 },
    { timestamp: '21:59:15 2020-12-31', value: 21 },
    { timestamp: '21:59:16 2020-12-31', value: 21 },
    { timestamp: '21:59:17 2020-12-31', value: 22 },
    { timestamp: '21:59:18 2020-12-31', value: 21 },
  ];

  public tempData: LineChartData = [

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

  constructor() { }

  ngOnInit(): void {
  }

  waterLevelFormatter = (v) => v + ' cm';
  tempFormatter = (v) => v + ' °C';

}
