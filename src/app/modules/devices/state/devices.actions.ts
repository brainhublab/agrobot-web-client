import { Device as DeviceModel } from '../models/device.model';

export namespace DeviceActions {
  export class Add {
    static readonly type = '[DEVICE] Add';

    constructor(public device: DeviceModel) { }
  }

  export class Remove {
    static readonly type = '[DEVICE] Remove';

    constructor(public id: number) { }
  }
}

