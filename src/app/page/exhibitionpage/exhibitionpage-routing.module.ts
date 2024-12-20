import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExhibitionmainPage } from './exhibitionmain/exhibitionmain.page';
import { ExhibitionDetailsPage } from './exhibition-details/exhibition-details.page';
import { ExhibitioncreatePage } from './exhibitioncreate/exhibitioncreate.page';
import { ExhibitionUpdatePage } from './exhibition-update/exhibition-update.page';

const routes: Routes = [
  {
    path: '', component: ExhibitionmainPage
  },
  {
    path: 'main', component: ExhibitionmainPage
  },
  {
    path: 'detail/:id', component: ExhibitionDetailsPage
  },
  {
    path: 'create', component: ExhibitioncreatePage
  },
  {
    path: 'detail/:id/update', component: ExhibitionUpdatePage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExhibitionPageRoutingModule {}