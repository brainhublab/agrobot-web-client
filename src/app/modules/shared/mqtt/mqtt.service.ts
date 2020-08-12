import { Injectable } from '@angular/core';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { IDevice } from '../litegraph/device.model';

@Injectable({
  providedIn: 'root'
})
export class UIMqttService {
  private subscription: Subscription;
  public message: string;

  constructor(
    private readonly mqttService: MqttService) {
    const topic = 'UI/receiveNewController';

    this.subscription = this.mqttService.observe(topic).subscribe((message: IMqttMessage) => {
      const d = JSON.parse(message.payload.toString()) as IDevice;
      console.log(d);
    });

    console.log('subscribed')

    // this.unsafePublish(topic, 'ahahhaha');
    // this.subscription.unsubscribe();

  }

  public unsafePublish(topic: string, message: string) {
    this.mqttService.unsafePublish(topic, message, { qos: 1, retain: true });
  }
}
