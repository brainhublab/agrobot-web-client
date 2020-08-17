import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { LiteGraph } from 'litegraph.js';
import lodash from 'lodash';
import { ApiClientService } from 'src/app/modules/shared/api/api-client.service';
import { LiteGraphCanvasComponent } from 'src/app/modules/shared/canvas.component';
import { SerializedGraph } from 'src/app/modules/shared/litegraph/types';
import { DeviceConfigurations } from '../../../shared/litegraph/config-types';
import { IDevice } from '../../../shared/litegraph/device.model';
import { NodesManager } from '../../../shared/litegraph/nodes-manager';
import { MqttNodesService } from '../../services/mqtt-nodes.service';


@Component({
  selector: 'app-device-editor',
  templateUrl: './device-editor.component.html',
  styleUrls: ['./device-editor.component.scss']
})
export class DeviceEditorComponent extends LiteGraphCanvasComponent implements AfterViewInit {
  // override
  protected canvasElementID = '#deviceCanvas';

  /**
   * Device instance
   */
  @Input() device: IDevice;
  /**
   * Event fired after device changes
   */
  @Output() deviceChange = new EventEmitter<IDevice>();

  /**
   * Loading indicator
   */
  public loading = false;

  // nm
  private nodesManager = new NodesManager([
    'basic/const',
    'basic/boolean',
    'basic/watch',
    'widget/button',
    'widget/combo',
  ]);

  constructor(
    private readonly elRef: ElementRef,
    private readonly apiClient: ApiClientService,
    private readonly mqttNodesService: MqttNodesService
  ) {
    super();
    this.nodesManager.deleteNotAllowedNodes();
  }

  // override
  protected recalculateCanvasSize() {
    this.width = this.elRef.nativeElement.offsetWidth;
    this.height = this.elRef.nativeElement.offsetHeight;
  }

  // override
  protected onCanvasMouseDownSideEffect() {
    // handle changes
    const serializedGraph = JSON.parse(JSON.stringify(this.graph.serialize()));
    if (!lodash.isEqual(this.device.graph, serializedGraph)) {
      this.dirty = true;
    }
  }

  // override
  protected afterGraphInitialized() {
    if (this.device) {
      this.constructGraph();
    }
  }

  /**
   * Save serialized graph configuration
   */
  public async save() {
    const serializedGraph: SerializedGraph = JSON.parse(JSON.stringify(this.graph.serialize()));
    const syncedDeviceConfiguration = this.syncDeviceConfiguration(this.device, serializedGraph);

    try {
      this.loading = true;
      this.device = await this.apiClient.updateController({
        ...this.device,
        graph: serializedGraph, esp_config: syncedDeviceConfiguration
      }).toPromise();


      this.deviceChange.emit(this.device);
      this.loading = false;
      this.dirty = false;
    } catch (e) {
      console.warn('Error updating controller', e);
    }
    // .dispatch(new DeviceActions.Edit(
    // )).pipe(first()).subscribe(_ => this.dirty = false);
  }

  /**
   * Generated new device configuration using serialized graph & previous device configuration
   * @param device device instance
   * @param serializedGraph lg serialized graph
   * @returns new device configuration
   */
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
    this.nodesManager.registerDeviceConfigurationNode(
      this.device,
      this.mqttNodesService.getDeviceDataObservable(this.device)
    );

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

  }


}
