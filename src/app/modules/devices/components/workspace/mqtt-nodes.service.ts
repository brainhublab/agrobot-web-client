import { Injectable } from '@angular/core';
import { UIMqttService } from 'src/app/modules/shared/mqtt/mqtt.service';
import { registerLGObservableSourceNode } from 'src/app/modules/shared/litegraph/observable-source-node';
import { interval } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MqttNodesService {

  constructor(
    private readonly uiMqttService: UIMqttService
  ) { }

  register() {
    // const deviceObservable = this.uiMqttService.observeControllerData('mac');
    const deviceObservable = interval(1000).pipe(map(_ => (Math.random() * 10).toPrecision(2)));
    registerLGObservableSourceNode(deviceObservable);
  }

}
