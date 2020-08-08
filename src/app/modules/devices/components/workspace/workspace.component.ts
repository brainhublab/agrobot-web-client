import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { LGraph, LGraphCanvas, LiteGraph } from 'litegraph.js';
import { Select } from '@ngxs/store';
import { DevicesState } from 'src/app/modules/devices/state/devices.state';
import { Observable } from 'rxjs';
import { Device } from 'src/app/modules/devices/models/device.model';
import { NodesManager } from 'src/app/modules/shared/litegraph/nodes';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit, AfterViewInit {
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
  @Select(DevicesState.getConfiguredDevices) configuredDevices$: Observable<Array<Device>>;

  width = 1024;
  height = 720;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateSize();
    this.canvas.adjustNodesSize();
  }

  constructor() { }

  ngOnInit(): void {
    this.nodesManager.deleteNotAllowedNodes();
  }

  ngAfterViewInit() {
    setTimeout(() => this.initializeCanvas(), 10);
  }

  private updateSize() {
    this.width = window.innerWidth - 0;
    this.height = window.innerHeight - 48;
  }

  private initializeCanvas() {
    this.updateSize();
    this.graph = new LGraph();

    this.canvas = new LGraphCanvas('#workspaceCanvas', this.graph);
    let lastOffset = 30;
    this.configuredDevices$.subscribe((devices: Array<Device>) => {
      console.log(devices);
      devices?.forEach((d, idx) => {
        const cfg = this.nodesManager.registerWsDeviceNode(d);
        const deviceNode = LiteGraph.createNode(cfg.type);
        deviceNode.pos = [lastOffset, 200];
        lastOffset += deviceNode.computeSize()[0] + 50;
        this.graph.add(deviceNode);
      });
    });

  }

}
