import { INodeSlot } from 'litegraph.js';
import { IDevice } from '../models/device.model';

export namespace DeviceConfigurations {
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
  export interface IDeviceConfiguration {
    mcuType: DeviceConfigurations.MCUTypes;
    title: string;
    isConfigured: boolean;
    in?: any;
    out?: any;
    disensers?: any;
  }

  /**
   * Water Level inputs
   */
  export interface IWaterLevelInputs {
    valve: number;
    levelPercents: number;
    PID: {
      agKp: number,
      agKi: number,
      agKd: number,
      consKp: number,
      consKi: number,
      consKd: number
    };
  }

  /**
   * WaterLevel device config
   */
  export class WaterLevelConfig implements IDeviceConfiguration {
    readonly mcuType = DeviceConfigurations.MCUTypes.WATER_LEVEL;
    readonly title = 'Water level';
    isConfigured = true;
    in: IWaterLevelInputs = {
      valve: 100,
      levelPercents: 100,
      PID: {
        agKp: 0.0,
        agKi: 0.0,
        agKd: 0.0,
        consKp: 0.0,
        consKi: 0.0,
        consKd: 0.0

      }
    };
    out = {
      valve: 100,
      waterLevel: 100,
      waterFlowIn: 2000,
      waterFlowOut: 2000,
      PID: {
        agKp: 0.0,
        agKi: 0.0,
        agKd: 0.0,
        consKp: 0.0,
        consKi: 0.0,
        consKd: 0.0

      }
    };
  }

  /**
   * Light control device cfg inputs
   */
  export interface ILightControlInputs {
    lightMode: number;
    targetLigstLevel: number;
    currentTime: string;
    lightIntensityMap: Array<number>;
  }

  /**
   * Light control device config
   */
  export class LightControlConfig implements IDeviceConfiguration {
    public readonly mcuType = DeviceConfigurations.MCUTypes.LIGHT_CONTROL;
    public readonly title = 'Light control';
    public isConfigured = true;
    public in: ILightControlInputs = {
      lightMode: 100,
      targetLigstLevel: 100,
      currentTime: '12:30',
      lightIntensityMap: [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 1, 2, 3,
        4, 5, 9, 13,
        14, 15, 15, 16,
        18, 20, 22, 24,
        28, 32, 36, 40,
        44, 46, 50, 56,
        62, 68, 74, 80,
        86, 92, 98, 100,
        100, 100, 100, 100,
        100, 100, 100, 100,
        100, 94, 88, 82,
        76, 70, 64, 58,
        52, 46, 40, 36,
        32, 28, 24, 20,
        18, 17, 16, 15,
        14, 13, 12, 11,
        10, 10, 5, 5,
        5, 4, 3, 2,
        1, 0, 0, 0,
        0, 0, 0, 0
      ]
    };
    public out = {
      lightMode: 100,
      currentLightLevel: 100,
      targetLightLevel: 100,
      currentTime: '12:30'
    };
  }

  /**
   * Nutrition controlller dispanser
   */
  export interface INutritionControlDispanser {
    in: {
      nutritionMode: number;
      targetConcentration: number;
    };
    out: {
      nutritionMode: number;
      currentConcentration: number;
      targetConcentration: number;
    };
  }

  /**
   * Nutrition controller configuration
   */
  export class NutritionControlConfig implements IDeviceConfiguration {
    readonly mcuType = DeviceConfigurations.MCUTypes.NUTRITION_CONTROL;
    readonly title = 'Nutrition control';
    isConfigured = true;
    dispensers = [
      {
        in: {
          nutritionMode: 100,
          targetConcentration: 100,
        },
        out: {
          nutritionMode: 100,
          currentConcentration: 100,
          targetConcentration: 2000
        }
      },
      {
        in: {
          nutritionMode: 100,
          targetConcentration: 100,
        },
        out: {
          nutritionMode: 100,
          currentConcentration: 100,
          targetConcentration: 2000
        }
      },
      {
        in: {
          nutritionMode: 100,
          targetConcentration: 100,
        },
        out: {
          nutritionMode: 100,
          currentConcentration: 100,
          targetConcentration: 2000
        }
      },
    ];
  }


  /**
   * Default device configurations
   */
  export const defaultDeviceConfigurationTemplates = {
    [DeviceConfigurations.MCUTypes.WATER_LEVEL]: new WaterLevelConfig(),
    [DeviceConfigurations.MCUTypes.LIGHT_CONTROL]: new LightControlConfig(),
    [DeviceConfigurations.MCUTypes.NUTRITION_CONTROL]: new NutritionControlConfig(),
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
    const [inputPropsMap, widgetPropsMap] = DeviceConfigurations.getPropsMaps(device);

    const getDefaultPropValue = (propName: string) => {
      if (widgetPropsMap.has(propName)) {
        return device.esp_config.in[widgetPropsMap.get(propName)];
      } else {
        return null;
      }
    };


    const getDefaultInputValue = (propName: string) => {
      if (inputPropsMap.has(propName)) {
        return device.esp_config.in[inputPropsMap.get(propName)];
      } else {
        return null;
      }
    };


    switch (device.esp_config.mcuType) {
      case DeviceConfigurations.MCUTypes.LIGHT_CONTROL:
        return {
          props: [
            { name: 'mode', type: 'string', label: 'Mode', choises: ['OFF', 'SOLAR', 'TIMER', 'CONTINUOUS'], value: getDefaultPropValue('mode') },
            { name: 'target_level', type: 'number', label: 'Target Level', value: getDefaultPropValue('target_level') },
            { name: 'latitude', type: 'number', label: 'Latitude', value: getDefaultPropValue('latitude') },
            { name: 'longitude ', type: 'number', label: 'Longitude', value: getDefaultPropValue('longitude') },
            { name: 'datetime', type: '', label: 'Curerent Time', value: getDefaultPropValue('datetime') },
          ],
          inputs: [
            { name: 'target_level', type: 'number', label: 'Target Level', value: getDefaultInputValue('target_level') },
            { name: 'datetime', type: 'string', label: 'Curerent Time', value: getDefaultInputValue('datetime') },
          ],
          outputs: [
            { name: 'mode', type: 'string', label: 'Mode', choises: ['OFF', 'SOLAR', 'TIMER', 'CONTINUOUS'] },
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
        }
      case DeviceConfigurations.MCUTypes.WATER_LEVEL:
        return {
          props: [
            { name: 'target_level', type: 'number', label: 'Target Level', value: getDefaultPropValue('target_level')  },
            { name: 'factor', type: 'number', label: 'Factor', value: getDefaultPropValue('factor')  },
            { name: 'valve_state', type: 'boolean', label: 'Valve state', value: getDefaultPropValue('valve_state')  },
          ],
          inputs: [
            { name: 'target_level', type: 'number', label: 'Target Level', value: getDefaultInputValue('target_level') },
          ],
          outputs: [
            { name: 'target_level', type: 'number', label: 'Target level' },
            { name: 'current_level', type: 'number', label: 'Current level' },
            { name: 'current_valve_state', type: 'boolean', label: 'Current valve state' },
            { name: 'flow_sensors_count', type: 'number' },
          ],
          triggers: [
            { type: 'calibrate', name: 'Calibrate', handler: (action, param) => console.log('calibrate', action, param) },
            { type: 'open_gate', name: 'Open gate', handler: (action, param) => console.log('open_gate', action, param) },
            { type: 'close_gate', name: 'Close gate', handler: (action, param) => console.log('close gate', action, param) },
          ],
          executors: [
            { inSlots: [0], outSlot: 0, reducer: (values) => values.shift() },
          ]
        };

      case DeviceConfigurations.MCUTypes.NUTRITION_CONTROL:
        return {
          props: [
            { name: 'mode', type: 'string', label: 'Mode', choises: ['OFF', 'PERIODIC', 'RELATIVE'], value: getDefaultPropValue('mode')  },
            { name: 'concentration ', type: 'number', label: 'Concentration', value: getDefaultPropValue('concentration') },
          ],
          inputs: [
            { name: 'concentration ', type: 'number', label: 'Concentration', value: getDefaultPropValue('concentration') },
          ],
          outputs: [
            { name: 'mode', type: 'string', label: 'Mode', choises: ['OFF', 'PERIODIC', 'RELATIVE'] },
            { name: 'current_concentration', type: 'number', label: 'Current concentration' },
          ],
          triggers: [
          ],
          executors: [
            { inSlots: [0], outSlot: 1, reducer: (values) => values.shift() },
          ]
        };
      default:
        break;
    }
  };

  export const getPropsMaps = (device: IDevice): [Map<string, string>, Map<string, string>] => {
    let inputPropsMap: Map<string, string>;
    let widgetPropsMap: Map<string, string>;
    switch (device.esp_config?.mcuType) {
      case DeviceConfigurations.MCUTypes.WATER_LEVEL:
        inputPropsMap = new Map<string, string>([
        ]);

        widgetPropsMap = new Map<string, string>([
          ['target_level', 'levelPercents'],
          ['valve_state', 'valve'],
          ['mode', 'lightMode']
        ]);
        break;
      case DeviceConfigurations.MCUTypes.LIGHT_CONTROL:
        inputPropsMap = new Map<string, string>([
        ]);

        widgetPropsMap = new Map<string, string>([
          ['target_level', 'targetLigstLevel'],
          ['mode', 'lightMode']
        ]);
        break;
      case DeviceConfigurations.MCUTypes.NUTRITION_CONTROL:
        inputPropsMap = new Map<string, string>([
        ]);

        widgetPropsMap = new Map<string, string>([
          ['concentration', 'targetConcentration'],
          ['mode', 'nutritionMode']
        ]);
        break;
    }

    return [inputPropsMap, widgetPropsMap];
  }
}
