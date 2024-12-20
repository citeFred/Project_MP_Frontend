import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Studymain } from './studymain/studymain.page';

const routes: Routes = [
  {
    path: '', component: Studymain
  },
  {
    path: 'main', component: Studymain
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudyroomPageRoutingModule {}