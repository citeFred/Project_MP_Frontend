import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPage } from './landingpage/landingpage';
import { IntroduceMetaversePage } from './introduce-metaverse/introduce-metaverse.page';
import { LoginpagePage } from './loginpage/loginpage.page';
import { JoinpagePage } from './joinpage/joinpage.page';

const routes: Routes = [
  {
    path: '',
    component: LandingPage
  },
  {
    path: 'main',
    component: LandingPage
  },
  {
    path: 'introduce-metaverse',
    component: IntroduceMetaversePage
  },
  {
    path: 'loginpage',
    component: LoginpagePage
  },
  {
    path: 'joinpage',
    component: JoinpagePage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPageRoutingModule {}
