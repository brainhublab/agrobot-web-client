import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { map } from 'rxjs/operators';
import { IDevice } from '../litegraph/device.model';

@Injectable({
  providedIn: 'root'
})
export class UIMqttService {
  constructor(private readonly mqttService: MqttService) { }

  /**
   * Generates observable of MessageType instances for a specific topic
   * @param topic mqtt topic
   */
  private observe<MessageType>(topic: string) {
    return this.mqttService.observe(topic).pipe(map((message: IMqttMessage) => {
      return JSON.parse(message.payload.toString()) as MessageType;
    }));
  }

  public observeControllers() {
    return this.observe<IDevice>('UI/receiveNewController');
  }

  public observeControllerData(mac: string) {
    return this.observe<any>(`UI/ControllerData/${mac}`);
  }

  public observeControllerLogs(mac: string) {
    return this.observe<any>(`UI/ControllerLogs/${mac}`);
  }
}
