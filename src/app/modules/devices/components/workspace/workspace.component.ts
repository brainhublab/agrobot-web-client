import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { LiteGraph, Vector2 } from 'litegraph.js';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Subscription } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { LiteGraphCanvasComponent } from 'src/app/modules/core/components/canvas.component';
import { NodesManager } from 'src/app/modules/core/litegraph/nodes-manager';
import { SerializedGraph } from 'src/app/modules/core/litegraph/types';
import { IDevice } from 'src/app/modules/core/models/device.model';
import { ApiClientService } from 'src/app/modules/core/services/api/api-client.service';
import { DevicesState } from 'src/app/modules/devices/state/devices.state';
import { MqttNodesService } from '../../services/mqtt-nodes.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent extends LiteGraphCanvasComponent implements AfterViewInit, OnDestroy {
  editingDevice: IDevice = null;

  // override
  protected canvasElementID = 'workspaceCanvas';
  /**
   * Loading status
   */
  public loading = true;

  /**
   * Nodes manager instance
   */
  public nodesManager = new NodesManager(
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

  public nodes: Array<string> = [];
  constructor(
    private readonly mqttNodes: MqttNodesService,
    private readonly nzMsg: NzMessageService,
    private readonly apiClient: ApiClientService,
  ) {
    super();

    this.nodesManager.deleteNotAllowedNodes();
    this.mqttNodes.registerCustomNodes();
    this.nodes = Object.keys(LiteGraph.registered_node_types).sort((a, b) => a.localeCompare(b));
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
        // const deviceNode = LiteGraph.createNode(cfg.type);
        // deviceNode.pos = [lastOffset, 200];
        // lastOffset += deviceNode.computeSize()[0] + 50;
        // this.graph.add(deviceNode);
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

  public droppedItemOnCanvas(event) {
    console.log('dropped canvas: ', event);
  }

  public onControllerDropped($event: CdkDragEnd) {
    const bb = $event.source.element.nativeElement.getBoundingClientRect();
    const pos: Vector2 = [bb.x + $event.distance.x, bb.y + $event.distance.y];
    const el = document.elementFromPoint(pos[0], pos[1]);
    if (el.id === this.canvasElementID) {
      const device = $event.source.data as IDevice;
      // const cfg = this.nodesManager.registerWsDeviceNode(device, this.mqttNodes.getDeviceDataObservable(device));
      const deviceNode = LiteGraph.createNode(this.nodesManager.getDeviceNodeType(device));
      deviceNode.pos = this.canvas.convertCanvasToOffset(pos);
      // 0 += deviceNode.computeSize()[0] + 50;
      this.graph.add(deviceNode);
    } else {
      console.log(el);
    }
  }

  public onNodeDropped($event: CdkDragEnd) {
    const bb = $event.source.element.nativeElement.getBoundingClientRect();
    const pos: Vector2 = [bb.x + $event.distance.x, bb.y + $event.distance.y];
    const el = document.elementFromPoint(pos[0], pos[1]);
    if (el.id === this.canvasElementID) {
      const nodeType = $event.source.data as string;

      const newNode = LiteGraph.createNode(nodeType);
      newNode.pos = this.canvas.convertCanvasToOffset(pos);
      this.graph.add(newNode);
    } else {
      console.log(el);
    }
  }

  public getDeviceNodeType(device: IDevice) {
    return this.nodesManager.getDeviceNodeType(device);
  }

  public editDevice(device: IDevice) {
    this.editingDevice = device;
  }
}
