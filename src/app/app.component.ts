import { Component } from '@angular/core';
import { NzConfigService } from 'ng-zorro-antd/core/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'agro-webclient';

  constructor(
    private readonly nzConfigService: NzConfigService
  ) {
    this.nzConfigService.set('notification', {
      nzMaxStack: 3,
      nzPlacement: 'bottomRight',
    })

  }
}
