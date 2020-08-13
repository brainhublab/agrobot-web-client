import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { IDevice } from '../../../shared/litegraph/device.model';
import { Subscription } from 'rxjs';
import { DeviceConfigurations } from 'src/app/modules/shared/litegraph/config-types';
import { DeviceEditorComponent } from '../device-editor/device-editor.component';
import { ApiClientService } from 'src/app/modules/shared/api/api-client.service';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit, OnDestroy {
  public device: IDevice;
  public loading = true;

  @ViewChild('deviceEditor') deviceEditorComponent: DeviceEditorComponent;

  private deviceID: number;
  private paramMapSubscription: Subscription;

  public readonly deviceTemplates = [
    { name: 'Water level', value: DeviceConfigurations.MCUTypes.WATER_LEVEL },
    { name: 'Nutrition control', value: DeviceConfigurations.MCUTypes.NUTRITION_CONTROL },
    { name: 'Light control', value: DeviceConfigurations.MCUTypes.LIGHT_CONTROL },
  ];

  public get dirty() {
    return this.deviceEditorComponent?.dirty;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly apiClient: ApiClientService
  ) { }

  ngOnInit(): void {
    this.paramMapSubscription = this.route.paramMap.subscribe(pm => {
      const deviceID = pm.get('deviceID');
      if (deviceID) {
        this.deviceID = parseInt(deviceID);
        this.apiClient.getControllerById(this.deviceID)
          .pipe(first()).subscribe(d => {
            this.device = d;
            this.loading = false;
          });
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

    this.editDevice({ esp_config: conf });
  }

  public removeConfiguration() {
    this.editDevice({ esp_config: null });
  }

  public async editDevice(pDevice: Partial<IDevice>) {
    this.device = await this.apiClient.updateController({
      ...this.device,
      ...pDevice
    }).toPromise();
  }
}
