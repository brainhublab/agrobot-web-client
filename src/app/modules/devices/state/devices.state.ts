
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Device } from '../models/device.model';
import { DeviceActions } from './devices.actions';

export class DevicesStateModel {
  devices: Device[];
}

@State<DevicesStateModel>({
  name: 'devices',
  defaults: {
    devices: [
      {
        id: 0,
        name: 'Title 1'
      },
      {
        id: 1,
        name: 'Title 2'
      },
      {
        id: 2,
        name: 'Title 3'
      },
      {
        id: 3,
        name: 'Title 4'
      },
      {
        id: 4,
        name: 'Title 5'
      },
      {
        id: 5,
        name: 'Title 6'
      }
    ]
  }
})

export class DevicesState {

  @Selector()
  static getDevices(state: DevicesStateModel) {
    return state.devices;
  }

  @Selector()
  static getByID(state: DevicesStateModel) {
    return (id: number) => {
      return state.devices.find(v => v.id === id);
    };
  }

  @Action(DeviceActions.Add)
  add({ getState, patchState }: StateContext<DevicesStateModel>, { device }: DeviceActions.Add) {
    const state = getState();
    patchState({
      devices: [...state.devices, device]
    });
  }

  @Action(DeviceActions.Remove)
  remove({ getState, patchState }: StateContext<DevicesStateModel>, { id }: DeviceActions.Remove) {
    patchState({
      devices: getState().devices.filter((a, i) => i !== id)
    });
  }

}
