import { DeviceConfigurations } from './config-types';
import { IBaseModel } from '../base.model';

/**
 * Device model
 */
export interface IDevice extends IBaseModel {
  // tslint:disable-next-line: variable-name
  mac_addr?: string;
  name: string;
  description?: string;
  configuration?: DeviceConfigurations.IDeviceConfiguration;
  // tslint:disable-next-line: variable-name
  serialized_graph?: string; // JSON.string of SerializedGraph;
  subscribers?: Array<string>;
}
