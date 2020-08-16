import { Component, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { LGraph, LGraphCanvas, LiteGraph } from 'litegraph.js';
import { Select } from '@ngxs/store';
import { DevicesState } from 'src/app/modules/devices/state/devices.state';
import { Observable, Subscription } from 'rxjs';
import { IDevice } from 'src/app/modules/shared/litegraph/device.model';
import { NodesManager } from 'src/app/modules/shared/litegraph/nodes-manager';
import { SerializedGraph } from 'src/app/modules/shared/litegraph/types';
import { MqttNodesService } from './mqtt-nodes.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit, AfterViewInit, OnDestroy {
  private graph: LGraph;
  private canvas: LGraphCanvas;
  private nodesManager = new NodesManager(
    [
      'basic/const',
      'basic/boolean',
      'basic/watch',
      'widget/button',
      'widget/combo',
    ]
  );
  dirty = false;

  @Select(DevicesState.getConfiguredDevices) configuredDevices$: Observable<Array<IDevice>>;
  private configuredDevicesSub: Subscription;

  width = 1024;
  height = 720;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateSize();
    this.canvas.adjustNodesSize();
  }

  constructor(
    private readonly mqttNodes: MqttNodesService
  ) { }

  ngOnInit(): void {
    this.nodesManager.deleteNotAllowedNodes();
    this.mqttNodes.register();
  }

  ngAfterViewInit() {
    setTimeout(() => this.initializeCanvas(), 10);
  }

  ngOnDestroy(): void {
    if (this.configuredDevicesSub) {
      this.configuredDevicesSub.unsubscribe();
    }
  }

  private updateSize() {
    this.width = window.innerWidth - 0;
    this.height = window.innerHeight - 48;
  }

  private initializeCanvas() {
    this.updateSize();
    this.graph = new LGraph();

    this.canvas = new LGraphCanvas('#workspaceCanvas', this.graph);
    this.canvas.canvas.addEventListener('mousedown', () => {
      // handle changes
      this.dirty = true;
    });
    this.addNodes();
  }

  private addNodes() {
    let lastOffset = 30;
    this.configuredDevicesSub = this.configuredDevices$.subscribe((devices: Array<IDevice>) => {
      devices?.forEach((d, idx) => {
        const cfg = this.nodesManager.registerWsDeviceNode(d);
        const deviceNode = LiteGraph.createNode(cfg.type);
        deviceNode.pos = [lastOffset, 200];
        lastOffset += deviceNode.computeSize()[0] + 50;
        this.graph.add(deviceNode);
      });
    });
  }

  public started = false;

  public toggle() {
    if (this.started) {
      this.graph.stop();
    } else {
      this.graph.start(1000);
    }

    this.started = !this.started;
  }
  public save() {
    const serializedGraph: SerializedGraph = this.graph.serialize();

    console.log('serializd: ', serializedGraph);
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
