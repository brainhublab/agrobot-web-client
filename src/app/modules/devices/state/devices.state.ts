
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { IDevice } from '../../shared/litegraph/device.model';
import { DeviceActions } from './devices.actions';
import { DeviceConfigurations } from '../../shared/litegraph/config-types';

export class DevicesStateModel {
  devices: IDevice[];
}

@State<DevicesStateModel>({
  name: 'devices',
  defaults: {
    devices: [
      {
        id: 0,
        name: 'Light cocntrol dev 1',
        mac_addr: '3b:6e:82:1c:1f:ca',
        description: 'first device ever',
        configuration: DeviceConfigurations.defaultDeviceConfigurationTemplates[DeviceConfigurations.MCUTypes.LIGHT_CONTROL]
      },
      {
        id: 1,
        name: 'Title 2',
        mac_addr: 'd6:4e:e8:63:fa:41',
        configuration: DeviceConfigurations.defaultDeviceConfigurationTemplates[DeviceConfigurations.MCUTypes.WATER_LEVEL]
      },
      {
        id: 2,
        name: 'Title 3',
        mac_addr: '28:d4:0c:67:0f:4d',
        configuration: DeviceConfigurations.defaultDeviceConfigurationTemplates[DeviceConfigurations.MCUTypes.NUTRITION_CONTROL]
      },
      {
        id: 3,
        name: 'Title 4',
        mac_addr: 'b5:47:a5:f3:78:20'
      },
      {
        id: 4,
        name: 'Title 5',
        mac_addr: 'bf:1a:5e:5c:52:09'
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
  static getConfiguredDevices(state: DevicesStateModel) {
    return state.devices.filter(v => v?.configuration?.isConfigured);
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

  @Action(DeviceActions.Edit)
  edit({ getState, patchState }: StateContext<DevicesStateModel>, { id, pDevice }: DeviceActions.Edit) {
    patchState({
      devices: getState().devices.map(device => {
        if (device.id === id) {
          return {
            ...device,
            ...pDevice
          };
        }
        return device;
      })
    });
  }

}
