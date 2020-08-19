import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';


@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    NzResultModule,
  ],
  exports: [
    PageNotFoundComponent
  ]
})
export class SharedModule { }
