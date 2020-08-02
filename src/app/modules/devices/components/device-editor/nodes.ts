import { LiteGraph } from 'litegraph.js';


const ALLOWED_NODE_TYPES = [
  'basic/const',
  'basic/watch',
  'widget/knob',
];

// custom nodes

/**
 * Water level node
 */

// node constructor class
function WaterLevelNode() {
  this.addInput('valve', 'number');
  this.addInput('levelPercents', 'number');
  this.addOutput('valve', 'number');
  this.addOutput('waterLevel', 'number');
  this.addOutput('waterFlowIn', 'number');
  this.addOutput('waterFlowOut', 'number');
  this.properties = { precision: 1 };
}

// name to show
WaterLevelNode.title = 'Water level';

// function to call when the node is executed
WaterLevelNode.prototype.onExecute = function () {
  let A = this.getInputData(0);
  if (A === undefined) {
    A = 0;
  }
  let B = this.getInputData(1);
  if (B === undefined) {
    B = 0;
  }
  this.setOutputData(0, A + B);
  this.setOutputData(1, A - B);
  this.setOutputData(2, A * B);
  this.setOutputData(3, A / B);
};


export const registerNodes = () => {
  // remove not allowed nodes
  for (const nodeType in LiteGraph.registered_node_types) {
    if (!ALLOWED_NODE_TYPES.find(v => v === nodeType)) {
      delete LiteGraph.registered_node_types[nodeType];
    }
  }

  // register in the system
  LiteGraph.registerNodeType('hydro/water_level', WaterLevelNode as any);

};
