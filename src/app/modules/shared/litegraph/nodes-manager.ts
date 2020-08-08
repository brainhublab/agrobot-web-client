import { LiteGraph, LGraph, LGraphNode } from 'litegraph.js';
import { Device } from 'src/app/modules/devices/models/device.model';

import { DEVICE_INPUTS_OUTPUTS, GraphPins, NodeExecutor, DeviceTrigger } from './devicetypes';

export interface NodeConfig {
  type: string;
  title: string;
  props: GraphPins;
  inputs: GraphPins;
  outputs: GraphPins;
  executors?: Array<NodeExecutor>;
  triggers?: Array<DeviceTrigger>;
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
      props: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType].props,
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
        this.addInput(i.name, i.type);
      });

      cfg.props?.forEach(p => {
        if (p.choises?.length > 0) {
          this.addWidget('combo', p.label, p.choises[0], (v) => null, { values: p.choises });
        } else if (p.type === 'number') {
          this.addWidget('number', p.label, 0.5, function (v) { }, { min: 0, max: 100 });
        } else {
          console.warn('Unhandled prop: ', p);
        }
      });

      if (bindingMode) {
        cfg.outputs.forEach(o => {
          this.addOutput(o.name, o.type);
        });
      }

      cfg.triggers.forEach(t => {
        this.addInput(t.name, LiteGraph.ACTION);
        this.button = this.addWidget('button', t.name, 'Button', function (v) { }, {});
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

    // process outputs
    // lastY = startY;
    // node.outputs?.forEach((outputSlot, idx: number) => {
    //   const nodeWatch = LiteGraph.createNode('basic/watch');
    //   nodeWatch.pos = [startY + margin, lastY];
    //   lastY += nodeWatch.``
    //   graph.add(nodeWatch);

    //   node.connect(idx, nodeWatch, 0);
    // });
  }

}

export { NodesManager };
