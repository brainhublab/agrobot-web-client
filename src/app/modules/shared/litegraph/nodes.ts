import { LiteGraph, INodeSlot, LGraph, LGraphNode } from 'litegraph.js';
import { Device } from 'src/app/modules/devices/models/device.model';
import { MCUTypes } from 'src/app/modules/devices/models/device-configuration.model';

const ALLOWED_NODE_TYPES = [
  'basic/const',
  'basic/boolean',
  'basic/watch',
  'widget/button',
  'widget/combo',
];

type GraphPins = Array<INodeSlot>;
type NodeExecutor = { inSlots: Array<number>, outSlot: number, reducer: (v: Array<any>) => any };
export interface NodeConfig {
  type: string;
  title: string;
  inputs: GraphPins;
  outputs: GraphPins;
  executors?: Array<NodeExecutor>;
  triggers?: Array<DeviceTrigger>;
}


interface DeviceTrigger {
  type: string;
  name: string;
  handler: (action, param) => any;
}

interface DevicePins {
  [key: string]: {
    in: GraphPins,
    out: GraphPins,
    triggers: Array<DeviceTrigger>,
    executors?: Array<NodeExecutor>,
  };
}

const MULTITON_NODES: Map<string, LGraphNode> = new Map<string, LGraphNode>();

const registerNode = (cfg: NodeConfig, bindingMode: boolean = false) => {

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
    if (MULTITON_NODES.has(cfg.type)) {
      console.warn('Cannot use same device twice'); // TODO: Notify user
      this.onRemoved = () => { };
      graph.remove(this);
      // highlight previous node
      const previousNode = MULTITON_NODES.get(cfg.type);
      const oldColor = previousNode.color;
      previousNode.color = '#a29bfe';
      setTimeout(() => previousNode.color = oldColor, 200);
      return;
    } else {
      MULTITON_NODES.set(cfg.type, this);
    }
  };


  NodeConstructor.prototype.onRemoved = function () {
    MULTITON_NODES.delete(cfg.type);
  };



  // register in the system
  LiteGraph.registerNodeType(cfg.type, NodeConstructor as any);
};

export const deleteNotAllowedNodes = () => {
  // remove not allowed nodes
  for (const nodeType in LiteGraph.registered_node_types) {
    if (!ALLOWED_NODE_TYPES.find(v => v === nodeType)) {
      delete LiteGraph.registered_node_types[nodeType];
    }
  }


};

const DEVICE_INPUTS_OUTPUTS: DevicePins = {
  [MCUTypes.LIGHT_CONTROL]: {
    in: [
      { name: 'mode', type: 'string', label: 'Mode' },
      { name: 'target_level', type: 'number', label: 'Target Level' },
      { name: 'latitude', type: 'number', label: 'Latitude' },
      { name: 'longitude ', type: 'number', label: 'Longitude' },
      { name: 'datetime', type: '', label: 'Valve state' },
    ],
    out: [
      { name: 'mode', type: 'number', label: 'Mode' },
      { name: 'current_level', type: 'number', label: 'Current level' },
      { name: 'current_valve_state', type: 'boolean', label: 'Current valve state' },
      { name: 'flow_sensors_count', type: 'number' },
    ],
    triggers: [
      { type: 'enable_lights', name: 'Enable Lights', handler: (action, param) => console.log('hhe', action, param) },
      { type: 'disable_lights', name: 'Disable Lights', handler: (action, param) => console.log('hhd', action, param) },
    ],
    executors: [
      { inSlots: [0], outSlot: 0, reducer: (values) => values.shift() },
    ]
  },
  [MCUTypes.NUTRITION_CONTROL]: {
    in: [
      { name: 'target_level', type: 'number', label: 'Target Level' },
      { name: 'latitude', type: 'number', label: 'Latitude' },
      { name: 'longitude ', type: 'number', label: 'Longitude' },
      { name: 'datetime', type: '', label: 'Valve state' },
    ],
    out: [
      { name: 'mode', type: 'number', label: 'Mode' },
      { name: 'current_level', type: 'number', label: 'Current level' },
      { name: 'current_valve_state', type: 'boolean', label: 'Current valve state' },
      { name: 'flow_sensors_count', type: 'number' },
    ],
    triggers: [
    ]
  },
  [MCUTypes.WATER_LEVEL]: {
    in: [
      { name: 'target_level', type: 'number', label: 'Target Level' },
      { name: 'factor', type: 'number', label: 'Factor' },
      { name: 'valve_state', type: 'boolean', label: 'Valve state' },
    ],
    out: [
      { name: 'target_level', type: 'number', label: 'Target level' },
      { name: 'current_level', type: 'number', label: 'Current level' },
      { name: 'current_valve_state', type: 'boolean', label: 'Current valve state' },
      { name: 'flow_sensors_count', type: 'number' },
    ],
    triggers: [
      { type: 'calibrate', name: 'Calibrate', handler: (action, param) => console.log('calibrate', action, param) },
      { type: 'open_gate', name: 'Open gate', handler: (action, param) => console.log('open_gate', action, param) },
      { type: 'close_gate', name: 'Close gate', handler: (action, param) => console.log('close gate', action, param) },
    ]
  }
};

/**
 * Generates litegraph node type
 */
export const getDeviceNodeType = (device: Device): string => {
  return 'device/' + device.name + device.id;
}

export const registerDeviceConfigurationNode = (device: Device) => {
  const cfg = {
    type: getDeviceNodeType(device),
    title: device.name,
    inputs: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType].in,
    outputs: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType].out,
    executors: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType].executors,
    triggers: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType].triggers,
  };
  registerNode(cfg);
  return cfg;
};

export const registerWsDeviceNode = (device: Device) => {
  console.log(device.configuration)
  const cfg = {
    type: getDeviceNodeType(device),
    title: device.name,
    inputs: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType].in,
    outputs: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType].out,
    executors: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType].executors,
    triggers: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType].triggers,
  };
  registerNode(cfg, true);
  return cfg;
};
