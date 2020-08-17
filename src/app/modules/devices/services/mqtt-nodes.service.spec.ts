/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MqttNodesService } from './mqtt-nodes.service';

describe('Service: MqttNodes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MqttNodesService]
    });
  });

  it('should ...', inject([MqttNodesService], (service: MqttNodesService) => {
    expect(service).toBeTruthy();
  }));
});
