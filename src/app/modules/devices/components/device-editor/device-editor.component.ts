import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { LGraph, LiteGraph, LGraphCanvas, } from 'litegraph.js';
import { Device } from '../../models/device.model';
import { registerNodes } from './nodes';
import { MCUTypes, WaterLevelConfig } from '../../models/device-configuration.model';
import { ThrowStmt } from '@angular/compiler';


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
    registerNodes();

  }

  ngOnInit(): void {
  }


  private initializeCanvas() {
    this.graph = new LGraph();

    this.canvas = new LGraphCanvas('#deviceCanvas', this.graph);
  }

  private addNodes() {


    if (this.device.configuration.mcuType === MCUTypes.WATER_LEVEL) {
      const cfg = this.device.configuration as WaterLevelConfig;
    } else {

      const nodeConst = LiteGraph.createNode('basic/const');
      nodeConst.pos = [100, 200];
      this.graph.add(nodeConst);
      nodeConst.setValue(4.5);

      const nodeKnob = LiteGraph.createNode('widget/knob');
      nodeKnob.pos = [100, 400];
      this.graph.add(nodeKnob);

      const nodeWaterLevel = LiteGraph.createNode('hydro/water_level');
      nodeWaterLevel.pos = [350, 200];
      this.graph.add(nodeWaterLevel);

      const nodeWatch = LiteGraph.createNode('basic/watch');
      nodeWatch.pos = [700, 200];
      this.graph.add(nodeWatch);

      const nodeWatch1 = LiteGraph.createNode('basic/watch');
      nodeWatch1.pos = [700, 400];
      this.graph.add(nodeWatch1);

      nodeConst.connect(0, nodeWaterLevel, 0);
      nodeKnob.connect(0, nodeWaterLevel, 1);
      nodeWaterLevel.connect(0, nodeWatch, 0);
      nodeWaterLevel.connect(2, nodeWatch1, 0);
    }
    this.graph.start();
  }

  ngAfterViewInit() {
    this.initializeCanvas();
    if (this.device) {
      this.addNodes();
    }
  }

}
