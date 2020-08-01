import { DeviceConfiguration } from './device-configuration.model';

export class Device {
  id: string;
  title: string;
  configured?: boolean;
  configurationJSON?: DeviceConfiguration;
}
