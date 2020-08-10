import { DeviceConfigurations } from './config-types';

/**
 * Device model
 */
export interface Device {
  id: number;
  // tslint:disable-next-line: variable-name
  mac_addr?: string;
  name: string;
  description?: string;
  configuration?: DeviceConfigurations.DeviceConfiguration;
  // tslint:disable-next-line: variable-name
  serialized_graph?: string; // JSON.string of SerializedGraph;
  subscribers?: Array<string>;
}
