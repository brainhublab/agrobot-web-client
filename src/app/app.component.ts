import { Component } from '@angular/core';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { UIMqttService } from './modules/shared/mqtt/mqtt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'agro-webclient';

  constructor(
    private readonly nzConfigService: NzConfigService,
    private readonly uiMqttService: UIMqttService
  ) {
    this.nzConfigService.set('notification', {
      nzMaxStack: 3,
      nzPlacement: 'bottomRight',
    });
  }
}
