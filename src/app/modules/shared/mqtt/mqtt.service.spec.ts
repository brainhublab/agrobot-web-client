/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UIMqttService } from './mqtt.service';

describe('Service: Mqtt', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UIMqttService]
    });
  });

  it('should ...', inject([UIMqttService], (service: UIMqttService) => {
    expect(service).toBeTruthy();
  }));
});
