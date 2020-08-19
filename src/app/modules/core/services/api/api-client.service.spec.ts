/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ApiClientService } from './api-client.service';

describe('Service: ApiClient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiClientService]
    });
  });

  it('should ...', inject([ApiClientService], (service: ApiClientService) => {
    expect(service).toBeTruthy();
  }));
});
