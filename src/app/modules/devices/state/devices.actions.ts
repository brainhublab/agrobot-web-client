import { IDevice as DeviceModel } from '../../core/models/device.model';

export namespace DeviceActions {
  export class Reload {
    static readonly type = '[DEVICE] Reload';
    constructor() { }
  }

  export class LoadById {
    static readonly type = '[DEVICE] LoadById';
    constructor(public id: number) { }
  }

  export class Add {
    static readonly type = '[DEVICE] Add';

    constructor(public device: DeviceModel) { }
  }

  export class Remove {
    static readonly type = '[DEVICE] Remove';

    constructor(public id: number) { }
  }

  export class Edit {
    static readonly type = '[DEVICE] Edit';

    constructor(public id: number, public pDevice: Partial<DeviceModel>) { }
  }
}

