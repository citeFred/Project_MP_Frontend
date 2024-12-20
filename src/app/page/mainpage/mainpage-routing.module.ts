import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPage } from './landingpage/landingpage';
import { IntroduceMetaversePage } from './introduce-metaverse/introduce-metaverse.page';

const routes: Routes = [
  {
    path: '', component: LandingPage
  },
  {
    path: 'main',
    component: LandingPage
  },
  {
    path: 'introduce-metaverse',
    component: IntroduceMetaversePage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPageRoutingModule {}
