import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExhibitionUpdatePage } from './exhibition-update.page';

const routes: Routes = [
  {
    path: '',
    component: ExhibitionUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExhibitionUpdatePageRoutingModule {}
