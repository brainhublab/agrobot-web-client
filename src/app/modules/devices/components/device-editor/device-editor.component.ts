import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { LGraph, LiteGraph, LGraphCanvas, } from 'litegraph.js';
import { Device } from '../../models/device.model';
import { deleteNotAllowedNodes, registerDeviceConfigurationNode, getDeviceNodeType } from '../../../shared/litegraph/nodes';


const inputNodeTypesMap = {
  number: 'basic/const',
  boolean: 'basic/boolean',
  [LiteGraph.ACTION]: 'widget/button',
  string: 'widget/combo',
};

@Component({
  selector: 'app-device-editor',
  templateUrl: './device-editor.component.html',
  styleUrls: ['./device-editor.component.scss']
})
export class DeviceEditorComponent implements OnInit, AfterViewInit {

  @Input() device: Device;
  private graph: LGraph;
  private canvas: LGraphCanvas;

  constructor() {
    deleteNotAllowedNodes();
  }

  ngOnInit(): void {
  }


  private initializeCanvas() {
    this.graph = new LGraph();

    this.canvas = new LGraphCanvas('#deviceCanvas', this.graph);
  }

  private addNodes() {

    const deviceNodeCfg = registerDeviceConfigurationNode(this.device);

    const deviceNode = LiteGraph.createNode(getDeviceNodeType(this.device));
    deviceNode.pos = [350, 200];
    this.graph.add(deviceNode);


    // process inputs
    deviceNode.inputs?.forEach((inputSlot, idx: number) => {
      const nodeType = inputNodeTypesMap[inputSlot.type];
      if (nodeType) {
        const inputSourceNode = LiteGraph.createNode(nodeType);
        inputSourceNode.pos = [100, 100 * (idx + 1)];
        this.graph.add(inputSourceNode);
        if (nodeType === 'basic/const') {
          inputSourceNode.setValue(4.5);
        } else if (nodeType === 'widget/button') {
          inputSourceNode.size = [150, 50];
          inputSourceNode.properties.text = inputSlot.name.split(' ').shift();
        } else if (nodeType === 'widget/combo') {
          // inputSourceNode.removeOutput(1);

          // inputSourceNode.addProperty('value', 'Z', 'string');
          // inputSourceNode.inputs.
          // inputSourceNode.addProperty('values', 'X;Y;Z', 'string');
        }

        inputSourceNode.connect(0, deviceNode, idx);
      } else {
        console.warn('Unhandled slot type: ', inputSlot);
      }
    });

    // process outputs
    deviceNode.outputs?.forEach((outputSlot, idx: number) => {
      const nodeWatch = LiteGraph.createNode('basic/watch');
      nodeWatch.pos = [700, 100 * (idx + 1)];
      this.graph.add(nodeWatch);

      deviceNode.connect(idx, nodeWatch, 0);
    });

    this.graph.start();
  }

  ngAfterViewInit() {
    this.initializeCanvas();
    if (this.device) {
      this.addNodes();
    }
  }

}
