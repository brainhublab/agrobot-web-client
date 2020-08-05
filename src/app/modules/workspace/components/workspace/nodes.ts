import { LiteGraph } from 'litegraph.js';
import { Device } from 'src/app/modules/devices/models/device.model';
import { MCUTypes } from 'src/app/modules/devices/models/device-configuration.model';


const ALLOWED_NODE_TYPES = [];

// custom nodes

type GraphPins = Array<{ name: string, type: 'number' | 'string' }>;

export interface NodeConfig {
  type: string;
  title: string;
  inputs: GraphPins;
  outputs: GraphPins;
  onExecute?: () => any;
}


const registerNode = (cfg: NodeConfig) => {

  function NodeConstructor() {
    cfg.inputs.forEach(i => {
      this.addInput(i.name, i.type);
    });

    cfg.outputs.forEach(o => {
      this.addOutput(o.name, o.type);
    });
  }

  NodeConstructor.title = cfg.title;

  NodeConstructor.prototype.onExecute = cfg.onExecute;
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


interface DevicePins {
  [key: string]: {
    in: GraphPins,
    out: GraphPins
  };
}

const DEVICE_INPUTS_OUTPUTS: DevicePins = {
  [MCUTypes.LIGHT_CONTROL]: {
    in: [
      { name: 'in1', type: 'number' },
      { name: 'in2', type: 'number' },
    ],
    out: [
      { name: 'out1', type: 'number' },
    ]
  },
  [MCUTypes.NUTRITION_CONTROL]: {
    in: [
      { name: 'in1', type: 'number' },
      { name: 'in2', type: 'number' },
      { name: 'in3', type: 'number' },
      { name: 'in4', type: 'number' },
    ],
    out: [
      { name: 'out1', type: 'number' },
      { name: 'out2', type: 'number' },
      { name: 'out3', type: 'number' },
    ]
  },
  [MCUTypes.WATER_LEVEL]: {
    in: [
      { name: 'in1', type: 'number' },
      { name: 'in2', type: 'number' },
      { name: 'in3', type: 'number' },
    ],
    out: [
      { name: 'out1', type: 'number' },
      { name: 'out2', type: 'number' },
    ]
  }
}

export const registerDeviceNode = (device: Device) => {
  console.log('register node', device);
  registerNode({
    type: 'device/' + device.name + device.id,
    title: device.name,
    inputs: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType || MCUTypes.LIGHT_CONTROL].in,
    outputs: DEVICE_INPUTS_OUTPUTS[device.configuration?.mcuType || MCUTypes.LIGHT_CONTROL].out,
  });
};
