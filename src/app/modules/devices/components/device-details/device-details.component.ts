import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ApiClientService } from 'src/app/modules/core/services/api/api-client.service';
import { DeviceConfigurations } from 'src/app/modules/core/litegraph/config-types';
import { IDevice } from '../../../core/models/device.model';
import { DeviceEditorComponent } from '../device-editor/device-editor.component';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit, OnDestroy {
  public device: IDevice;
  public loading = true;

  @ViewChild('deviceEditor') private deviceEditorComponent: DeviceEditorComponent;

  /**
   * Device id from ActivatedRoute
   */
  private deviceID: number;
  /**
   * ActivatedRoute params subscription
   */
  private paramMapSubscription: Subscription;

  public readonly deviceTypes = [
    { name: 'Water level', value: DeviceConfigurations.MCUTypes.WATER_LEVEL },
    { name: 'Nutrition control', value: DeviceConfigurations.MCUTypes.NUTRITION_CONTROL },
    { name: 'Light control', value: DeviceConfigurations.MCUTypes.LIGHT_CONTROL },
  ];

  /**
   * Are there any unsaved changes
   */
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

  /**
   * UI Configuration template selector changed it's value
   * @param templateValue mcu type
   */
  public onConfigurationTemplateChange(templateValue: DeviceConfigurations.MCUTypes) {
    const conf = DeviceConfigurations.defaultDeviceConfigurationTemplates[templateValue];
    if (!conf) {
      alert('Wrong config'); // TODO
      return;
    }

    this.editDevice({ esp_config: conf });
  }

  /**
   * Removew config
   */
  public removeConfiguration() {
    this.editDevice({ esp_config: null,  graph: null });
  }

  public async editDevice(pDevice: Partial<IDevice>) {
    this.device = await this.apiClient.updateController({
      ...this.device,
      ...pDevice
    }).toPromise();
  }
}
