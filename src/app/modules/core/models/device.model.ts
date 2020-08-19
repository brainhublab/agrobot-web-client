import { DeviceConfigurations } from '../litegraph/config-types';
import { IBaseModel } from './base.model';
import { SerializedGraph } from '../litegraph/types';

/**
 * Device model
 */
export interface IDevice extends IBaseModel {
  // tslint:disable-next-line: variable-name
  mac_addr?: string;
  name: string;
  description?: string;
  // tslint:disable-next-line: variable-name
  esp_config?: DeviceConfigurations.IDeviceConfiguration;
  graph?: SerializedGraph;
  subscribers?: Array<string>;
}
