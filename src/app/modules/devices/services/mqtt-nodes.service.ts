import { Injectable } from '@angular/core';
import { UIMqttService } from 'src/app/modules/shared/mqtt/mqtt.service';
import { registerLGObservableSourceNode } from 'src/app/modules/shared/litegraph/observable-source-node';
import { interval } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IDevice } from 'src/app/modules/shared/litegraph/device.model';

@Injectable({
  providedIn: 'root'
})
export class MqttNodesService {

  constructor(
    private readonly uiMqttService: UIMqttService
  ) { }

  registerCustomNodes() {
    const dataObservable = this.getDeviceDataObservable(null);
    registerLGObservableSourceNode(dataObservable);
  }

  public getDeviceDataObservable(device: IDevice) {
    // return this.uiMqttService.observeControllerData(device.mac_addr);
    return interval(1000).pipe(map(_ => (Math.random() * 10).toPrecision(2)));
  }

}
