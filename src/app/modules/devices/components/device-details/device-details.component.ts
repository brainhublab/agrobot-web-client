import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { DevicesState } from '../../state/devices.state';
import { map } from 'rxjs/operators';
import { Device } from '../../../shared/litegraph/device.model';
import { Observable } from 'rxjs';
import { DeviceActions } from '../../state/devices.actions';
import { DeviceConfigurations } from 'src/app/modules/shared/litegraph/config-types';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit {
  public device$: Observable<Device>;

  private deviceID: number;

  public readonly deviceTemplates = [
    { name: 'Water level', value: DeviceConfigurations.MCUTypes.WATER_LEVEL },
    { name: 'Nutrition control', value: DeviceConfigurations.MCUTypes.NUTRITION_CONTROL },
    { name: 'Light control', value: DeviceConfigurations.MCUTypes.LIGHT_CONTROL },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const deviceID = pm.get('deviceID');
      if (deviceID) {
        this.deviceID = parseInt(deviceID);
        this.device$ = this.store.select(DevicesState.getByID)
          .pipe(
            map(ff => ff(this.deviceID))
          );
      }
    });
  }

  public onTemplateChange(templateValue: DeviceConfigurations.MCUTypes) {
    const conf = DeviceConfigurations.defaultDeviceConfigurationTemplates[templateValue];
    if (!conf) {
      alert('Wrong config'); // TODO
      return;
    }
    this.editDevice({ configuration: conf });
  }

  public removeConfiguration() {
    this.editDevice({ configuration: null });
  }

  public editDevice(pDevice: Partial<Device>) {
    return this.store
      .dispatch(new DeviceActions.Edit(
        this.deviceID,
        pDevice
      ));

  }
}
