import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudyroomPageComponent } from './studyroompage.component';
import { StudyroomPage } from './studyroom/studyroom.page';

const routes: Routes = [
  {
    path: '', component: StudyroomPage
  },
  {
    path: 'main',
    component: StudyroomPageComponent
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student-routing.module').then(m => m.StudentRoutingModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudyroomPageRoutingModule {}
