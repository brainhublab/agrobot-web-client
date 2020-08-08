import { LiteGraph, LGraph, LGraphNode } from 'litegraph.js';
import { Device } from 'src/app/modules/devices/models/device.model';

import { DEVICE_INPUTS_OUTPUTS, GraphPins, NodeExecutor, DeviceTrigger } from './devicetypes';

export interface NodeConfig {
  type: string;
  title: string;
  inputs: GraphPins;
  outputs: GraphPins;
  executors?: Array<NodeExecutor>;
  triggers?: Array<DeviceTrigger>;
}

/**
 * Generates litegraph node type
 */


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

  public registerDeviceConfigurationNode = (device: Device) => {
    const cfg = this.getNodeConfig(device);
    this.registerNode(cfg);
    return cfg;
  }

  public registerWsDeviceNode = (device: Device) => {
    const cfg = this.getNodeConfig(device);
    this.registerNode(cfg, true);
    return cfg;
  }

  private getNodeConfig(device: Device): NodeConfig {
    return {
      type: this.getDeviceNodeType(device),
      title: `${device.name} (${device.configuration.mcuType}, ${device.id})`,
      inputs: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType].in,
      outputs: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType].out,
      executors: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType].executors,
      triggers: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType].triggers,
    };
  }

  public getDeviceNodeType = (device: Device): string => {
    return `${device.configuration.mcuType}/${device.name}-${device.id}`;
  }

  public deleteNotAllowedNodes = () => {
    // remove not allowed nodes
    for (const nodeType in LiteGraph.registered_node_types) {
      if (!this.allowedNodeTypes.find(v => v === nodeType)) {
        delete LiteGraph.registered_node_types[nodeType];
      }
    }
  }

  private registerNode(cfg: NodeConfig, bindingMode: boolean = false) {
    const that = this;
    function NodeConstructor() {

      cfg.inputs.forEach(i => {
        if (i.type === 'string') {
          this.addWidget("combo", i.label, "red", (v) => null, { values: ["red", "green", "blue"] });
        } else if (i.type === 'number') {
          this.addWidget("number", i.label, 0.5, function (v) { }, { min: 0, max: 100 });
        }
        else {
          this.addInput(i.name, i.type);
        }
      });

      if (bindingMode) {
        cfg.outputs.forEach(o => {
          this.addOutput(o.name, o.type);
        });
      }

      cfg.triggers.forEach(t => {
        this.addInput(t.name, LiteGraph.ACTION);
        this.button = this.addWidget("button", t.name, "Buttos", function (v) { }, {});
      });
    }

    NodeConstructor.title = cfg.title;

    // setup execution
    NodeConstructor.prototype.onExecute = function () {
      // for each executor
      cfg.executors?.forEach((ex) => {
        // get values (arguments for a reducer)
        const values = ex.inSlots.map(slotIdx => this.getInputData(slotIdx));
        this.setOutputData(ex.outSlot, ex.reducer(values));
      });
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

}

export { NodesManager };
