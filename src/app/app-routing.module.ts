import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './modules/shared/page-not-found/page-not-found.component';


const routes: Routes = [
  {
    path: 'devices',
    loadChildren: () => import('./modules/devices/devices.module').then(m => m.DevicesModule)
  },
  {
    path: 'workspace',
    loadChildren: () => import('./modules/workspace/workspace.module').then(m => m.WorkspaceModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard'
  },
  {
    path: '**', component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
