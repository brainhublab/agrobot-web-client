import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { endOfDay, endOfHour, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek, subHours, subMinutes } from 'date-fns';
import { LineChartData } from 'projects/charts/src/lib/components/line-chart/line-chart.component';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { DeviceConfigurations } from 'src/app/modules/core/litegraph/config-types';
import { IDevice } from 'src/app/modules/core/models/device.model';
import { UIMqttService } from 'src/app/modules/core/services/mqtt/mqtt.service';


const addZ = (n) => n < 10 ? '0' + n : '' + n;


const INITIAL_DATA: LineChartData = [
  { timestamp: '21:59:02 2020-08-01', value: 20 },
  { timestamp: '21:59:03 2020-08-01', value: 21 },
  { timestamp: '21:59:04 2020-08-01', value: 21 },
  { timestamp: '21:59:05 2020-08-01', value: 21 },
  { timestamp: '21:59:06 2020-08-01', value: 22 },
  { timestamp: '21:59:07 2020-08-01', value: 21 },
  { timestamp: '21:59:08 2020-08-01', value: 19 },
  { timestamp: '21:59:09 2020-08-01', value: 17 },
  { timestamp: '21:59:10 2020-08-01', value: 16 },
  { timestamp: '21:59:11 2020-08-01', value: 15 },
  { timestamp: '21:59:12 2020-08-01', value: 18 },
  { timestamp: '21:59:13 2020-08-01', value: 20 },
  { timestamp: '21:59:14 2020-08-01', value: 22 },
  { timestamp: '21:59:15 2020-08-01', value: 21 },
  { timestamp: '21:59:16 2020-08-01', value: 21 },
  { timestamp: '21:59:17 2020-08-01', value: 22 },
  { timestamp: '21:59:18 2020-08-01', value: 21 },
];


@Component({
  selector: 'app-device-charts',
  templateUrl: './device-charts.component.html',
  styleUrls: ['./device-charts.component.scss']
})
export class DeviceChartsComponent implements OnInit, OnDestroy {
  public readonly mcuTypes = DeviceConfigurations.MCUTypes;
  private deviceDataSub: Subscription;
  @Input() readonly device: IDevice;

  /**
   * Date range for data filtering
   */
  public dateRange: [Date, Date];

  /**
   * Static date picker templates
   */
  public readonly datePickerRanges = {
    'Last 10 min': [subMinutes(new Date(), 10), endOfHour(new Date())],
    'Last 30 min': [subMinutes(new Date(), 30), endOfHour(new Date())],
    'Last hour': [subHours(new Date(), 1), endOfHour(new Date())],
    'Last 3 hours': [subHours(new Date(), 3), endOfHour(new Date())],
    Today: [startOfDay(new Date()), endOfDay(new Date())],
    'This week': [startOfWeek(new Date()), endOfWeek(new Date())],
    'This Month': [startOfMonth(new Date()), endOfMonth(new Date())],
  };

  /**
   * Device data source
   */
  public dataSubject = new BehaviorSubject<LineChartData>(INITIAL_DATA);


  constructor(
    private readonly uiMqttService: UIMqttService
  ) { }

  ngOnInit(): void {
    this.observeDeviceData();
  }

  ngOnDestroy(): void {
    if (this.deviceDataSub) {
      this.deviceDataSub.unsubscribe();
    }
  }

  waterLevelFormatter = (v) => v + ' cm';
  tempFormatter = (v) => v + ' °C';

  /**
   * Subscribes to device data and propagates it to the data subject
   */
  private observeDeviceData() {
    // this.deviceDataSub = this.uiMqttService
    //   .observeControllerData(this.device.mac_addr)
    this.deviceDataSub = interval(2000)
      .subscribe(_ => {
        const date = new Date();
        const dateStr = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getFullYear()}-${addZ(date.getMonth() + 1)}-${date.getDate()}`;

        this.dataSubject.next([
          { timestamp: dateStr, value: Math.random() * 100 }
        ]);
      });
  }

  /**
   * Called on UI data range selector value change
   * @param range new date range for filtering
   */
  public onDateRangeChange(range: Date[]): void {
    if (range.length < 2) {
      this.dateRange = null;
      return;
    }
    const start = range[0];
    const end = range[1];

    // TODO: maybe reload data?
    this.dateRange = [start, end];
  }
}
