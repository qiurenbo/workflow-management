import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './list/detail/detail.component';
import { StatsComponent } from './stats/stats.component';
import { ConfigComponent } from './config/config.component';
import { ProjectComponent } from './project/project.component';
import { CameraComponent } from './camera/camera.component';
const routes: Routes = [
  { path: 'list', component: ListComponent },
  {
    path: 'detail',
    component: DetailComponent,
  },
  {
    path: 'stats',
    component: StatsComponent,
  },

  {
    path: 'projects',
    component: ProjectComponent,
  },
  {
    path: 'cameras',
    component: CameraComponent,
  },

  {
    path: 'config',
    component: ConfigComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
