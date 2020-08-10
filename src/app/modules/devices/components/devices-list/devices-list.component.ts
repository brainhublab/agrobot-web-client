import { Component, OnInit, HostBinding } from '@angular/core';
import { Device } from '../../../shared/litegraph/device.model';
import { Store, Select } from '@ngxs/store';
import { DeviceActions } from '../../state/devices.actions';
import { DevicesState } from '../../state/devices.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss']
})
export class DevicesListComponent implements OnInit {
  @Select(DevicesState.getDevices) devices$: Observable<Array<Device>>;

  constructor(private store: Store) { }
  ngOnInit(): void {
  }

  addDevice() {
    this.store.dispatch(new DeviceActions.Add({
      id: Math.round(Math.random() * 10),
      name: 'new one',
    }));
  }

}
