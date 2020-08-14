import { Injectable } from '@angular/core';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Observable } from 'rxjs';
import { IDevice } from '../litegraph/device.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UIMqttService {
  private controllersObservable$: Observable<IDevice> =
    this.mqttService.observe('UI/receiveNewController').pipe(map((message: IMqttMessage) => {
      return JSON.parse(message.payload.toString()) as IDevice;
    }));

  constructor(private readonly mqttService: MqttService) { }

  public observeControllers() {
    return this.controllersObservable$;
  }

  public observeControllerData(mac: string) {
    return this.mqttService.observe(`UI/ControllerData/${mac}`).pipe(map((message: IMqttMessage) => {
      return JSON.parse(message.payload.toString()) as any;
    }));
  }

  public observeControllerLogs(mac: string) {
    return this.mqttService.observe(`UI/ControllerLogs/${mac}`).pipe(map((message: IMqttMessage) => {
      return JSON.parse(message.payload.toString()) as any;
    }));
  }
}
