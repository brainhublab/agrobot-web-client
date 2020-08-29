import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LiteGraph } from 'litegraph.js';
import { Observable, Subscription } from 'rxjs';
import { DevicesState } from 'src/app/modules/devices/state/devices.state';
import { LiteGraphCanvasComponent } from 'src/app/modules/core/components/canvas.component';
import { IDevice } from 'src/app/modules/core/models/device.model';
import { NodesManager } from 'src/app/modules/core/litegraph/nodes-manager';
import { MqttNodesService } from '../../services/mqtt-nodes.service';
import { SerializedGraph } from 'src/app/modules/core/litegraph/types';
import { DeviceConfigurations } from 'src/app/modules/core/litegraph/config-types';
import { first, map } from 'rxjs/operators';
import { ApiClientService } from 'src/app/modules/core/services/api/api-client.service';


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent extends LiteGraphCanvasComponent implements AfterViewInit, OnDestroy {
  // override
  protected canvasElementID = '#workspaceCanvas';
  public loading = false;

  /**
   * Nodes manager instance
   */
  private nodesManager = new NodesManager(
    [
      'basic/const',
      'basic/boolean',
      'basic/watch',
      'widget/button',
      'widget/combo',
    ]
  );

  /**
   * Configured devices observable
   */
  @Select(DevicesState.getConfiguredDevices) configuredDevices$: Observable<Array<IDevice>>;
  /**
   * configuredDevices$ subscription
   */
  private configuredDevicesSub: Subscription;

  constructor(
    private readonly mqttNodes: MqttNodesService,
    private readonly store: Store,
    private readonly apiClient: ApiClientService,
  ) {
    super();

    this.nodesManager.deleteNotAllowedNodes();
    this.mqttNodes.registerCustomNodes();
  }

  ngOnDestroy(): void {
    if (this.configuredDevicesSub) {
      this.configuredDevicesSub.unsubscribe();
    }
  }

  // override
  protected afterGraphInitialized() {
    this.addConfiguredDevicesNodes();
  }

  /**
   * Add LG node for each configured device
   */
  private addConfiguredDevicesNodes() {
    let lastOffset = 30;
    this.configuredDevicesSub = this.configuredDevices$.subscribe((devices: Array<IDevice>) => {
      devices?.forEach((d, idx) => {
        const cfg = this.nodesManager.registerWsDeviceNode(d, this.mqttNodes.getDeviceDataObservable(d));
        const deviceNode = LiteGraph.createNode(cfg.type);
        deviceNode.pos = [lastOffset, 200];
        lastOffset += deviceNode.computeSize()[0] + 50;
        this.graph.add(deviceNode);
      });
    });
  }


  /**
   * Save serialized graph
   * TODO: implement (backend & db tables too)
   */
  public async save() {
    const serializedGraph: SerializedGraph = JSON.parse(JSON.stringify(this.graph.serialize()));
    await this.syncDevicesConfigurations(serializedGraph);
    this.dirty = false;
  }

  private async syncDevicesConfigurations(cfg: SerializedGraph) {
    this.loading = true;

    for (const deviceNode of cfg.nodes) {
      const deviceInfo = this.nodesManager.parseDeviceNodeType(deviceNode.type);
      if (deviceInfo && !isNaN(deviceInfo.id)) {
        let device: IDevice = await this.apiClient.getControllerById(deviceInfo.id).toPromise();
        const newConfig = this.nodesManager.syncDeviceConfig(device, deviceNode, cfg);

        try {
          device = await this.apiClient.updateController({
            ...device,
            esp_config: newConfig
          }).toPromise();
        } catch (e) {
          console.warn('Error updating controller', e);
        }

      }
    }
    this.loading = false;
  }

}
