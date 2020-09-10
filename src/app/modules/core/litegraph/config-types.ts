import { INodeSlot } from 'litegraph.js';
import { IDevice } from '../models/device.model';

export namespace DeviceConfigurations {
  type MqttTopicName = string;
  /**
   * Device types
   */
  export enum MCUTypes {
    WATER_LEVEL = 'water_level',
    NUTRITION_CONTROL = 'nutrition_control',
    LIGHT_CONTROL = 'light_control',
  }
  /**
   * Device configuration interface
   */
  export type IDeviceConfiguration = WaterLevelConfig;

  /**
   * WaterLevel device config
   */
  export class WaterLevelConfig {
    in: {
      valve: MqttTopicName,
      level_target: MqttTopicName,
      PID: {
        kp: MqttTopicName,
        ki: MqttTopicName,
        kd: MqttTopicName
      }
    };
    out: {
      valve: MqttTopicName,
      current_level: MqttTopicName,
      level_target: MqttTopicName,
      flow_in: MqttTopicName,
      flow_out: MqttTopicName,
      PID: {
        Kp: MqttTopicName,
        Ki: MqttTopicName,
        Kd: MqttTopicName
      }
    };

  }


  /**
   * Default device configurations
   */
  export const defaultDeviceConfigurationTemplates = {
    [DeviceConfigurations.MCUTypes.WATER_LEVEL]: new WaterLevelConfig(),
  };


  /**
   * Device node slot
   */
  export interface IDeviceNodeSlot extends INodeSlot {
    /**
     * Choices for litegraph combo widget
     */
    choises?: Array<string>;
    value?: any;
  }

  export type DeviceNodeSlots = Array<IDeviceNodeSlot>;

  /**
   * Litegraph device node executor
   * describes how to transform data from specific input slots to one output.
   */
  export interface ILGraphDeviceNodeExecutor {
    /**
     * Input slot indexes
     */
    inSlots: Array<number>;
    /**
     * Out slot idx
     */
    outSlot: number;
    /**
     * Reducer:
     * @param inputValues values from inSlots
     * @returns anything to outSlot
     */
    reducer: (inputValues: Array<any>) => any;
  }


  /**
   * Litegraph device node trigger
   * describes a trigger (i.e. button)
   */
  export interface ILGraphDeviceNodeTrigger {
    type: string;
    name: string;
    /**
     * Trigger handler
     * handles action
     */
    handler: (action, param) => void;
  }


  /**
   * Litegraph device node description
   */
  export interface ILGraphDeviceNodeDescriptor {
    inputs: DeviceNodeSlots;
    props?: DeviceNodeSlots;
    outputs: DeviceNodeSlots;
    triggers: Array<ILGraphDeviceNodeTrigger>;
    executors?: Array<ILGraphDeviceNodeExecutor>;
  }

  export interface ILGraphDeviceNodeDescriptors {
    /**
     * MCUType: ILGraphDeviceNodeDescriptor
     */
    [key: string]: ILGraphDeviceNodeDescriptor;
  }

  /**
   * Device nodes descriptors
   * used by node manager to construct and parse Litegraph serialized value
   */
  export const getDeviceNodeDescription = (device: IDevice): ILGraphDeviceNodeDescriptor => {

    const getDefaultPropValue = (propName: string) => {
      return null;
    };


    const getDefaultInputValue = (propName: string) => {
      return null;
    };


    switch (device.mcuType) {
      case DeviceConfigurations.MCUTypes.WATER_LEVEL:
        return {
          props: [
            { name: 'valve', type: 'boolean', label: 'Valve state', value: getDefaultPropValue('valve') },
            { name: 'level_target', type: 'number', label: 'Target Level', value: getDefaultPropValue('level_target') },
          ],
          inputs: [
            { name: 'valve', type: 'boolean', label: 'Valve state', value: getDefaultPropValue('valve') },
            { name: 'level_target', type: 'number', label: 'Target Level', value: getDefaultPropValue('level_target') },
          ],
          outputs: [
            { name: 'valve', type: 'boolean', label: 'Valve state' },
            { name: 'current_level', type: 'number', label: 'Current level' },
            { name: 'level_target', type: 'number', label: 'Target level' },
            { name: 'flow_in', type: 'number' },
            { name: 'flow_out', type: 'number' },
            { name: 'pid', type: 'json' }
          ],
          triggers: [
            { type: 'calibrate', name: 'Calibrate', handler: (action, param) => console.log('calibrate', action, param) },
            { type: 'open_gate', name: 'Open gate', handler: (action, param) => console.log('open_gate', action, param) },
            { type: 'close_gate', name: 'Close gate', handler: (action, param) => console.log('close gate', action, param) },
          ]
        };
      default:
        break;
    }
  };
}
