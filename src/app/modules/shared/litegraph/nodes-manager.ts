import { LiteGraph, LGraph, LGraphNode, SerializedLGraphNode } from 'litegraph.js';
import { IDevice } from 'src/app/modules/shared/litegraph/device.model';
import { DeviceConfigurations } from './config-types';
import { SerializedGraph } from './types';
import { Observable } from 'rxjs';

type INodeData = string;

interface INodeConfig extends DeviceConfigurations.ILGraphDeviceNodeDescriptor {
  type: string;
  title: string;
  mac: string;
}


const sourceNodeTypes = {
  number: 'basic/const',
  boolean: 'basic/boolean',
  [LiteGraph.ACTION]: 'widget/button',
  string: 'widget/combo',
};



class NodesManager {
  private readonly multitonNodes: Map<string, LGraphNode> = new Map<string, LGraphNode>();

  constructor(
    private allowedNodeTypes = [
      'basic/const',
      'basic/boolean',
      'basic/watch',
      'widget/button',
      'widget/combo',
    ]
  ) {

  }

  public registerDeviceConfigurationNode = (device: IDevice, dataObservable?: Observable<string>) => {
    const cfg = this.getNodeConfig(device);
    this.registerNode(cfg, false, dataObservable);
    return cfg;
  }

  public registerWsDeviceNode = (device: IDevice, dataObservable?: Observable<string>) => {
    const cfg = this.getNodeConfig(device);
    this.registerNode(cfg, true, dataObservable);
    return cfg;
  }

  private getNodeConfig(device: IDevice): INodeConfig {
    const deviceNodeDescriptor = DeviceConfigurations.DEVICE_NODES_DESCRIPTORS[device.esp_config?.mcuType];
    return {
      type: this.getDeviceNodeType(device),
      title: `${device.name} (${device.esp_config.mcuType}, ${device.id})`,
      mac: device.mac_addr,
      ...deviceNodeDescriptor,
    };
  }

  public getDeviceNodeType = (device: IDevice): string => {
    return `${device.esp_config.mcuType}/${device.id}`;
  }


  public parseDeviceNodeType = (type: string): { mcuType: DeviceConfigurations.MCUTypes, id: number } => {
    const spl = type.split('/');
    const mcuType = Object.values(DeviceConfigurations.MCUTypes).find(x => x === spl[0]);

    const result = {
      mcuType,
      id: parseInt(spl[1]),
    };

    return !isNaN(result.id) ? result : null;
  }

  public deleteNotAllowedNodes = () => {
    // remove not allowed nodes
    // TODO: Re-register deleted nodes
    for (const nodeType in LiteGraph.registered_node_types) {
      if (!this.allowedNodeTypes.find(v => v === nodeType)) {
        delete LiteGraph.registered_node_types[nodeType];
      }
    }
  }

  private registerNode(cfg: INodeConfig, bindingMode: boolean = false, dataObservable?: Observable<INodeData>) {
    const that = this;
    function NodeConstructor() {
      // always serialize widgets
      this.serialize_widgets = true;
      this._dataSubscription = null;
      this._last_received_data = '';

      // add inputs
      cfg.inputs.forEach(i => {
        this.addInput(i.name, i.type);
      });

      if (!bindingMode) {
        // add props using widgets
        cfg.props?.forEach(p => {
          if (p.choises?.length > 0) {
            this.addWidget('combo', p.label, p.choises[0], (v) => null, { values: p.choises });
          } else if (p.type === 'number') {
            // TODO: min, max, default
            this.addWidget('number', p.label, 0.5, (v) => null, { min: 0, max: 100 });
          } else {
            console.warn('Unhandled prop: ', p);
          }
        });
      }

      if (bindingMode) {
        // add outputs
        cfg.outputs.forEach(o => {
          this.addOutput(o.name, o.type);
        });
      }

      // add triggers
      cfg.triggers.forEach(t => {
        // input trigger , handled by onAction function
        this.addInput(t.name, LiteGraph.ACTION);
        if (!bindingMode) {
          // widget trigger
          this.button = this.addWidget('button', t.name, 'Button', t.handler, {});
        }
      });
    }

    NodeConstructor.title = cfg.title;


    NodeConstructor.prototype.subscribeToData = function () {
      if (dataObservable) {
        const that = this;
        this._dataSubscription = dataObservable.subscribe(data => {
          that.boxcolor = '#AFA';
          that.triggerSlot(0, data);
          that._last_received_data = data;
        });
      }
    };

    // setup execution
    NodeConstructor.prototype.onExecute = function () {
      // process data subscription
      if (!this._dataSubscription) {
        this.subscribeToData();
      } else {
        // TODO: parse string and setOuputData for each output slot using mqtt msg
        this.setOutputData(0, this._last_received_data);
      }

      // for each executor
      // cfg.executors?.forEach((ex) => {
      //   // get values (arguments for a reducer)
      //   const values = ex.inSlots.map(slotIdx => this.getInputData(slotIdx));
      //   const result = ex.reducer(values);
      //   console.log(`set ${ex.outSlot} to `, result);
      //   this.setOutputData(ex.outSlot, result);
      // });

      this.boxcolor = this.boxcolor == '#AFA' ? '#6C6' : '#AFA';
    };


    NodeConstructor.prototype.onAction = function (action, param) {
      const trigger = cfg.triggers.find(v => v.name === action);
      if (trigger) {
        trigger.handler(action, param);
      }
    };

    NodeConstructor.prototype.onAdded = function (graph: LGraph) {
      if (that.multitonNodes.has(cfg.type)) {
        console.warn('Cannot use same device twice'); // TODO: Notify user
        this.onRemoved = () => { };
        graph.remove(this);
        // highlight previous node
        const previousNode = that.multitonNodes.get(cfg.type);
        const oldColor = previousNode.color;
        previousNode.color = '#a29bfe';
        setTimeout(() => previousNode.color = oldColor, 200);
        return;
      } else {
        that.multitonNodes.set(cfg.type, this);
      }
    };


    NodeConstructor.prototype.onRemoved = function () {
      that.multitonNodes.delete(cfg.type);
    };

    // register in the system
    LiteGraph.registerNodeType(cfg.type, NodeConstructor as any);
  }

  public createSourceNodesForNodeInputs(node: LGraphNode, graph: LGraph) {
    const startX = node.pos[0];
    const startY = node.pos[1];
    const margin = 50;

    let lastY = startY;
    // process inputs
    node.inputs?.forEach((inputSlot, idx: number) => {
      const nodeType = sourceNodeTypes[inputSlot.type];
      if (nodeType) {
        const inputSourceNode = LiteGraph.createNode(nodeType);

        graph.add(inputSourceNode);
        if (nodeType === 'basic/const') {
          inputSourceNode.setValue(4.5);
        } else if (nodeType === 'widget/button') {
          inputSourceNode.size = [150, 50];
          inputSourceNode.properties.text = inputSlot.name.split(' ').shift();
        }

        inputSourceNode.pos = [startX - inputSourceNode.size[0] - margin, lastY];
        lastY += inputSourceNode.size[1] + margin;

        inputSourceNode.connect(0, node, idx);
      } else {
        console.warn('Unhandled slot type: ', inputSlot);
      }
    });
  }

  private syncDeviceInputs(deviceNode: SerializedLGraphNode, cfg: SerializedGraph, propMap: Map<string, string>) {
    const result: object = {};
    for (const input of deviceNode.inputs) {
      // [link.id, link.origin_id, link.origin_slot, link.target_id, link.target_slot, link.type]
      // we are the target node
      const link = cfg.links.find(l => l[0] === input.link);
      if (!link) {
        // empty input, let's check the next one
        continue;
      }
      const sourceNode = cfg.nodes.find(n => n.id === link[1]);
      result[propMap.get(input.name)] = sourceNode.properties.value;
    }

    return result;
  }

  /**
   * Generates new device config based on serialized graph
   * @param device Device item
   * @param deviceNode serialized node associated with the device
   * @param serializedGraph serialized graph
   * @returns New device configuration
   */
  public syncDeviceConfig(
    device: IDevice,
    deviceNode: SerializedLGraphNode,
    serializedGraph: SerializedGraph
  ): DeviceConfigurations.IDeviceConfiguration {
    const oldConfig = { ...device.esp_config };
    let newInConfig: any;

    if (device.esp_config.mcuType === DeviceConfigurations.MCUTypes.WATER_LEVEL) {
      const propsMap = new Map<string, string>([
        ['target_level', 'levelPercents'],
        ['valve_state', 'valve'],

      ]);

      const syncedInputs = this.syncDeviceInputs(deviceNode, serializedGraph, propsMap);

      newInConfig = {
        ...oldConfig.in,
        ...syncedInputs,
      };
    } else if (device.esp_config.mcuType === DeviceConfigurations.MCUTypes.LIGHT_CONTROL) {
      // TODO: rename these in / out cfgs, their names are confusing in ctx of graph nodes
      const propsMap = new Map<string, string>([
        ['target_level', 'targetLigstLevel']
      ]);
      const syncedInputs = this.syncDeviceInputs(deviceNode, serializedGraph, propsMap);

      const newLightInConfig: Partial<DeviceConfigurations.ILightControlInputs> = { ...oldConfig.in };
      // Update Mode
      newLightInConfig.lightMode = deviceNode.widgets_values[
        DeviceConfigurations.DEVICE_NODES_DESCRIPTORS[DeviceConfigurations.MCUTypes.LIGHT_CONTROL]
          .props.findIndex(v => v.name === 'mode')
      ];

      newInConfig = {
        ...newLightInConfig,
        ...syncedInputs,
      };
    } else if (device.esp_config.mcuType === DeviceConfigurations.MCUTypes.NUTRITION_CONTROL) {
      // TODO;
    }


    const newConfig: DeviceConfigurations.IDeviceConfiguration = {
      ...oldConfig, // preserve old
      in: {
        ...oldConfig.in, // preserve old cfgs
        ...newInConfig,
      },
      isConfigured: true
    };

    return newConfig;

  }

}

export { NodesManager };
