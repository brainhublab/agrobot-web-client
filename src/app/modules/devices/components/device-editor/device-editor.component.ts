import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { LGraph, LiteGraph, LGraphCanvas } from 'litegraph.js';
import { IDevice } from '../../../shared/litegraph/device.model';
import { NodesManager } from '../../../shared/litegraph/nodes-manager';
import { Store } from '@ngxs/store';
import { DeviceActions } from '../../state/devices.actions';
import { DevicesState } from '../../state/devices.state';
import { map, first } from 'rxjs/operators';
import { DeviceConfigurations } from '../../../shared/litegraph/config-types';
import { SerializedGraph } from 'src/app/modules/shared/litegraph/types';


@Component({
  selector: 'app-device-editor',
  templateUrl: './device-editor.component.html',
  styleUrls: ['./device-editor.component.scss']
})
export class DeviceEditorComponent implements OnInit, AfterViewInit {

  @Input() width = 1024;
  @Input() height = 720;
  @Input() device: IDevice;
  @Output() graphChanged = new EventEmitter<SerializedGraph>();

  public dirty = false;

  private graph: LGraph;
  private canvas: LGraphCanvas;
  private nodesManager = new NodesManager([
    'basic/const',
    'basic/boolean',
    'basic/watch',
    'widget/button',
    'widget/combo',
  ]);

  constructor(
    private readonly elRef: ElementRef,
    private readonly store: Store,
  ) {
    this.nodesManager.deleteNotAllowedNodes();
  }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.adjustCanvasSize();
    this.canvas.adjustNodesSize();
  }

  private adjustCanvasSize() {
    this.width = this.elRef.nativeElement.offsetWidth;
    this.height = this.elRef.nativeElement.offsetHeight;
  }

  /**
   * Init Lgraph and canvas
   */
  private initializeCanvas() {
    this.adjustCanvasSize();
    this.graph = new LGraph();

    this.canvas = new LGraphCanvas('#deviceCanvas', this.graph);
    this.canvas.canvas.addEventListener('mousedown', () => {
      // handle changes
      this.dirty = true;
    });
  }

  /**
   * Save serialized graph configuration
   */
  public save() {
    const serializedGraph: SerializedGraph = JSON.parse(JSON.stringify(this.graph.serialize()));
    const syncedDeviceConfiguration = this.syncDeviceConfiguration(this.device, serializedGraph);


    return this.store
      .dispatch(new DeviceActions.Edit(
        this.device.id,
        { graph: serializedGraph, esp_config: syncedDeviceConfiguration }
      )).pipe(first()).subscribe(_ => this.dirty = false);
  }

  private syncDeviceConfiguration(device: IDevice, serializedGraph: SerializedGraph): DeviceConfigurations.IDeviceConfiguration {
    const deviceNode = serializedGraph.nodes.find(n => this.nodesManager.parseDeviceNodeType(n.type)?.id === device.id);

    const deviceInfo = this.nodesManager.parseDeviceNodeType(deviceNode.type);
    if (deviceInfo && !isNaN(deviceInfo.id)) {
      const newConfig = { ...this.nodesManager.syncDeviceConfig(device, deviceNode, serializedGraph) };
      return newConfig;
    } else {
      return null;
    }

  }
  /**
   * Restore or construct graph for the device
   */
  private constructGraph() {
    this.nodesManager.registerDeviceConfigurationNode(this.device);

    if (this.device.graph?.nodes) {
      // use old graph
      this.graph.configure(this.device.graph);
    } else {
      // construct new one
      const deviceNode = LiteGraph.createNode(this.nodesManager.getDeviceNodeType(this.device));
      deviceNode.pos = [350, 200];
      this.graph.add(deviceNode);

      this.nodesManager.createSourceNodesForNodeInputs(deviceNode, this.graph);
    }

    this.graph.start();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeCanvas();
      if (this.device) {
        this.constructGraph();
      }
    }, 10);
  }

}
