import { DeviceConfiguration } from './device-configuration.model';

export class Device {
  id: number;
  mac_addr?: string;
  name: string;
  description?: string;
  configuration?: DeviceConfiguration;
  subscribers?: Array<string>;
}
