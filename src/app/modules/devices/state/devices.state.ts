
import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { IDevice } from '../../shared/litegraph/device.model';
import { DeviceActions } from './devices.actions';
import { Injectable } from '@angular/core';
import { ApiClientService } from '../../shared/api/api-client.service';

export class DevicesStateModel {
  loading: boolean;
  devices: IDevice[];
  devicesById: Map<number, IDevice>;
}

@State<DevicesStateModel>({
  name: 'devices',
  defaults: {
    loading: false,
    devices: [],
    devicesById: new Map<number, IDevice>(),
  }
})
@Injectable()
export class DevicesState implements NgxsOnInit {

  constructor(
    private apiClient: ApiClientService
  ) { }


  @Selector()
  static getDevices(state: DevicesStateModel) {
    return state.devices;
  }

  @Selector()
  static getLoading(state: DevicesStateModel) {
    return state.loading;
  }

  @Selector()
  static getConfiguredDevices(state: DevicesStateModel) {
    return state.devices.filter(v => v?.esp_config?.isConfigured);
  }

  @Selector()
  static getByID(state: DevicesStateModel) {
    return (id: number) => state.devicesById.get(id);
  }

  ngxsOnInit(ctx: StateContext<DevicesState>) {
    ctx.dispatch(new DeviceActions.Reload());
  }


  @Action(DeviceActions.Add)
  add({ getState, patchState }: StateContext<DevicesStateModel>, { device }: DeviceActions.Add) {
    const state = getState();
    patchState({
      devices: [...state.devices, device]
    });
  }

  @Action(DeviceActions.Reload)
  async reload({ getState, patchState }: StateContext<DevicesStateModel>, { }: DeviceActions.Reload) {
    patchState({ loading: true });
    try {
      const devices = await this.apiClient.getControllers().toPromise();
      patchState({
        devices,
        loading: false,
      });
    } catch (e) {
      console.warn('Error reloading devices: ', e);
      patchState({
        loading: false
      });
    }
  }

  @Action(DeviceActions.LoadById)
  async loadById({ getState, patchState }: StateContext<DevicesStateModel>, { id }: DeviceActions.LoadById) {
    try {
      const device = await this.apiClient.getControllerById(id).toPromise();
      patchState({
        devicesById: getState().devicesById.set(id, device),
        loading: false,
      });
    } catch (e) {
      console.warn('Error reloading device: ', e);
      patchState({
        loading: false
      });
    }
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
