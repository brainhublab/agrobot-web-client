import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { LGraph, LiteGraph, LGraphCanvas, } from 'litegraph.js';
import { Device } from '../../models/device.model';
import { NodesManager } from '../../../shared/litegraph/nodes-manager';

@Component({
  selector: 'app-device-editor',
  templateUrl: './device-editor.component.html',
  styleUrls: ['./device-editor.component.scss']
})
export class DeviceEditorComponent implements OnInit, AfterViewInit {

  @Input() device: Device;
  private graph: LGraph;
  private canvas: LGraphCanvas;
  private nodesManager = new NodesManager([
    'basic/const',
    'basic/boolean',
    'basic/watch',
    'widget/button',
    'widget/combo',
  ]);

  constructor() {
    this.nodesManager.deleteNotAllowedNodes();
  }

  ngOnInit(): void {
  }


  private initializeCanvas() {
    this.graph = new LGraph();

    this.canvas = new LGraphCanvas('#deviceCanvas', this.graph);
  }

  private addNodes() {

    const deviceNodeCfg = this.nodesManager.registerDeviceConfigurationNode(this.device);

    const deviceNode = LiteGraph.createNode(this.nodesManager.getDeviceNodeType(this.device));
    deviceNode.pos = [350, 200];
    this.graph.add(deviceNode);

    this.nodesManager.createSourceNodesForNodeInputs(deviceNode, this.graph);

    this.graph.start();
  }

  ngAfterViewInit() {
    this.initializeCanvas();
    if (this.device) {
      this.addNodes();
    }
  }

}
