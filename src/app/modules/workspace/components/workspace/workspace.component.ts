import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { LGraph, LGraphCanvas } from 'litegraph.js';
import './nodes';
import { Select } from '@ngxs/store';
import { DevicesState } from 'src/app/modules/devices/state/devices.state';
import { Observable } from 'rxjs';
import { Device } from 'src/app/modules/devices/models/device.model';
import { registerDeviceNode, deleteNotAllowedNodes } from './nodes';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit, AfterViewInit {
  private graph: LGraph;
  private canvas: LGraphCanvas;

  @Select(DevicesState.getDevices) configuredDevices$: Observable<Array<Device>>;

  width = 1024;
  height = 720;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateSize();
    this.canvas.adjustNodesSize();
  }

  constructor() { }

  ngOnInit(): void {
    deleteNotAllowedNodes();
    this.configuredDevices$.subscribe((devices: Array<Device>) => {
      console.log(devices);
      devices?.forEach(registerDeviceNode);
    });
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
  }

}
