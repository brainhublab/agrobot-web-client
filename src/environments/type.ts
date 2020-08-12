import { IMqttServiceOptions } from 'ngx-mqtt';

export interface IAppEnv {
  production: boolean;
  mqtt: IMqttServiceOptions;
  api: {
    url: string;
    token: string;
  }
}
