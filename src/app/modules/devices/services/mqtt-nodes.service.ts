import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDevice } from 'src/app/modules/shared/litegraph/device.model';
import { registerLGObservableSourceNode } from 'src/app/modules/shared/litegraph/observable-source-node';
import { UIMqttService } from 'src/app/modules/shared/mqtt/mqtt.service';

@Injectable({
  providedIn: 'root'
})
export class MqttNodesService {

  constructor(
    private readonly uiMqttService: UIMqttService
  ) { }

  /**
   * Registers mqtt nodes
   */
  registerCustomNodes() {
    const dataObservable = this.getDeviceDataObservable(null);
    registerLGObservableSourceNode(dataObservable);
  }

  /**
   * Generates data observable for a given device
   * @param device controller
   * @returns Observable
   */
  public getDeviceDataObservable(device: IDevice) {
    // return this.uiMqttService.observeControllerData(device.mac_addr);
    return interval(1000).pipe(map(_ => (Math.random() * 10).toPrecision(2)));
  }

}
