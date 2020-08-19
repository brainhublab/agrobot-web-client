import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterModule, RouterStateSnapshot, Routes, UrlTree } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';
import { DeviceDetailsComponent } from './components/device-details/device-details.component';
import { DevicesListComponent } from './components/devices-list/devices-list.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';


@Injectable()
class CanDeactivateDirtyComponent implements CanDeactivate<WorkspaceComponent | DeviceDetailsComponent> {
  confirmModal?: NzModalRef;
  private deactivateSubject = new Subject<boolean>();

  constructor(private modal: NzModalService) { }

  confirm(canDeactivateSubject: Subject<boolean>): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'You have unsaved changes. Do you actually want to discard them?',
      nzContent: 'All unsaved changes will be lost.',
      nzOkText: 'Yes, discard changes',
      nzOkType: 'danger',
      nzCancelText: 'Cancel',
      nzOnOk: () => canDeactivateSubject.next(true),
      nzOnCancel: () => canDeactivateSubject.next(false)
    });
  }

  canDeactivate(
    component: { dirty: boolean },
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.dirty) {
      this.confirm(this.deactivateSubject);
      return this.deactivateSubject.asObservable();
    } else {
      return true;
    }
  }
}

const routes: Routes = [
  {
    path: 'details/:deviceID',
    component: DeviceDetailsComponent,
    canDeactivate: [CanDeactivateDirtyComponent]
  },
  {
    path: 'workspace',
    component: WorkspaceComponent,
    canDeactivate: [CanDeactivateDirtyComponent]
  },
  {
    path: '',
    pathMatch: 'full',
    component: DevicesListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateDirtyComponent]
})
export class DevicesRoutingModule { }
