import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassinstructorPage } from './classinstructor.page';

const routes: Routes = [
  {
    path: '',
    component: ClassinstructorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassinstructorPageRoutingModule {}