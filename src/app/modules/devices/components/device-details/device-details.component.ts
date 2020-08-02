import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { DevicesState } from '../../state/devices.state';
import { map } from 'rxjs/operators';
import { Device } from '../../models/device.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit {
  public device$: Observable<Device>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const deviceID = pm.get('deviceID');
      if (deviceID) {
        this.device$ = this.store.select(DevicesState.getByID)
          .pipe(
            map(ff => ff(parseInt(deviceID)))
          );
      }
    });
  }

}
