import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { LiteGraph } from 'litegraph.js';
import { Observable, Subscription } from 'rxjs';
import { DevicesState } from 'src/app/modules/devices/state/devices.state';
import { LiteGraphCanvasComponent } from 'src/app/modules/shared/canvas.component';
import { IDevice } from 'src/app/modules/shared/litegraph/device.model';
import { NodesManager } from 'src/app/modules/shared/litegraph/nodes-manager';
import { MqttNodesService } from '../../services/mqtt-nodes.service';


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent extends LiteGraphCanvasComponent implements AfterViewInit, OnDestroy {
  // override
  protected canvasElementID = '#workspaceCanvas';

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
    private readonly mqttNodes: MqttNodesService
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
  public save() {
    // const serializedGraph: SerializedGraph = this.graph.serialize();
    this.dirty = false;
  }

  // private async syncDevicesConfigurations(cfg: SerializedGraph): Promise<Array<{ id: number, configuration: DeviceConfiguration }>> {
  //   const deviceConfigs: Array<{ id: number, configuration: DeviceConfiguration }> = [];

  //   for (const deviceNode of cfg.nodes) {
  //     const deviceInfo = this.nodesManager.parseDeviceNodeType(deviceNode.type);
  //     if (deviceInfo && !isNaN(deviceInfo.id)) {
  //       const device: Device = await this.store.select(DevicesState.getByID)
  //         .pipe(
  //           first(),
  //           map(ff => ff(deviceInfo.id))
  //         ).toPromise();
  //       const newConfig = this.nodesManager.syncDeviceConfig(device, deviceNode, cfg);

  //       deviceConfigs.push({ id: device.id, configuration: newConfig });
  //     }
  //   }

  //   return deviceConfigs;
  // }

}
