import { INodeSlot } from "litegraph.js";
import { MCUTypes } from 'src/app/modules/devices/models/device-configuration.model';

export type GraphPins = Array<INodeSlot>;
export type NodeExecutor = { inSlots: Array<number>, outSlot: number, reducer: (v: Array<any>) => any };

export interface DeviceTrigger {
  type: string;
  name: string;
  handler: (action, param) => any;
}

export interface DevicePins {
  [key: string]: {
    in: GraphPins,
    out: GraphPins,
    triggers: Array<DeviceTrigger>,
    executors?: Array<NodeExecutor>,
  };
}

export const DEVICE_INPUTS_OUTPUTS: DevicePins = {
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
