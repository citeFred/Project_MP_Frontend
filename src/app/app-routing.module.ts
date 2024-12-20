import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    loadChildren: () => import('./page/mainpage/mainpage.module').then(m => m.MainPageModule)
  },
  {
    path: 'studyroom',
    loadChildren: () => import('./page/studyroompage/studyroompage.module').then(m => m.StudyroomPageModule)
  },
  {
    path: 'exhibition',
    loadChildren: () => import('./page/exhibitionpage/exhibitionpage.module').then(m => m.ExhibitionPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}