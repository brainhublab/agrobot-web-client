import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { DevicesState } from '../../state/devices.state';
import { map } from 'rxjs/operators';
import { IDevice } from '../../../shared/litegraph/device.model';
import { Observable, Subscription } from 'rxjs';
import { DeviceActions } from '../../state/devices.actions';
import { DeviceConfigurations } from 'src/app/modules/shared/litegraph/config-types';
import { DeviceEditorComponent } from '../device-editor/device-editor.component';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit, OnDestroy {
  public device$: Observable<IDevice>;
  @ViewChild('deviceEditor') deviceEditorComponent: DeviceEditorComponent;

  private deviceID: number;
  private paramMapSubscription: Subscription;

  public readonly deviceTemplates = [
    { name: 'Water level', value: DeviceConfigurations.MCUTypes.WATER_LEVEL },
    { name: 'Nutrition control', value: DeviceConfigurations.MCUTypes.NUTRITION_CONTROL },
    { name: 'Light control', value: DeviceConfigurations.MCUTypes.LIGHT_CONTROL },
  ];

  public get dirty() {
    return this.deviceEditorComponent.dirty;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
  ) { }

  ngOnInit(): void {
    this.paramMapSubscription = this.route.paramMap.subscribe(pm => {
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

  ngOnDestroy() {
    if (this.paramMapSubscription) { this.paramMapSubscription.unsubscribe(); }
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

  public editDevice(pDevice: Partial<IDevice>) {
    return this.store
      .dispatch(new DeviceActions.Edit(
        this.deviceID,
        pDevice
      ));

  }
}
