import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IDevice } from '../../../shared/litegraph/device.model';
import { DeviceActions } from '../../state/devices.actions';
import { DevicesState } from '../../state/devices.state';

@Component({
  selector: 'app-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss']
})
export class DevicesListComponent implements OnInit {
  @Select(DevicesState.getDevices) devices$: Observable<Array<IDevice>>;
  @Select(DevicesState.getLoading) loading$: Observable<boolean>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.store.dispatch(new DeviceActions.Reload());
  }

}
