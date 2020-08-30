import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { LiteGraph } from 'litegraph.js';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Subscription } from 'rxjs';
import { LiteGraphCanvasComponent } from 'src/app/modules/core/components/canvas.component';
import { NodesManager } from 'src/app/modules/core/litegraph/nodes-manager';
import { SerializedGraph } from 'src/app/modules/core/litegraph/types';
import { IDevice } from 'src/app/modules/core/models/device.model';
import { ApiClientService } from 'src/app/modules/core/services/api/api-client.service';
import { DevicesState } from 'src/app/modules/devices/state/devices.state';
import { MqttNodesService } from '../../services/mqtt-nodes.service';
import { filter, delay } from 'rxjs/operators';


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent extends LiteGraphCanvasComponent implements AfterViewInit, OnDestroy {
  // override
  protected canvasElementID = '#workspaceCanvas';
  /**
   * Loading status
   */
  public loading = true;

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
    private readonly nzMsg: NzMessageService,
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

  private freeze() {
    this.loading = true;
    this.setReadOnly(true);
  }

  private unfreeze() {
    this.loading = false;
    this.setReadOnly(false);
  }

  /**
   * Add LG node for each configured device
   */
  private addConfiguredDevicesNodes() {
    let lastOffset = 30;
    this.freeze();
    const msgID = this.nzMsg.loading('Loading controllers...', { nzDuration: 0 }).messageId;
    this.configuredDevicesSub = this.configuredDevices$.pipe(filter(i => i !== null)).subscribe((devices: Array<IDevice>) => {
      for (const device of devices) {
        const cfg = this.nodesManager.registerWsDeviceNode(device, this.mqttNodes.getDeviceDataObservable(device));
        const deviceNode = LiteGraph.createNode(cfg.type);
        deviceNode.pos = [lastOffset, 200];
        lastOffset += deviceNode.computeSize()[0] + 50;
        this.graph.add(deviceNode);
      }

      this.nzMsg.remove(msgID);
      this.unfreeze();
    });
  }


  /**
   * Save serialized graph
   * TODO: implement (backend & db tables too)
   */
  public async save() {
    const serializedGraph: SerializedGraph = JSON.parse(JSON.stringify(this.graph.serialize()));
    const syncMsgID = this.nzMsg.loading('Syncronizing device configurations...', { nzDuration: 0 }).messageId;
    this.freeze();
    await this.syncDevicesConfigurations(serializedGraph);
    this.dirty = false;
    this.nzMsg.remove(syncMsgID);
    this.unfreeze();
  }

  private async syncDevicesConfigurations(cfg: SerializedGraph) {
    for (const deviceNode of cfg.nodes) {
      const deviceInfo = this.nodesManager.parseDeviceNodeType(deviceNode.type);
      if (deviceInfo && !isNaN(deviceInfo.id)) {
        let device: IDevice = await this.apiClient.getControllerById(deviceInfo.id).pipe(delay(1000)).toPromise();
        const newConfig = this.nodesManager.syncDeviceConfig(device, deviceNode, cfg);

        try {
          device = await this.apiClient.updateController({
            ...device,
            esp_config: newConfig
          }).toPromise();
        } catch (e) {
          console.warn('Error updating controller', e);
          this.nzMsg.error(`Error updating controller ${device.id}:${device.name}`, { nzDuration: 2000 });
        }

      }
    }
  }

}
