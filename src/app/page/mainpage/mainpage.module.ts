import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MainPageRoutingModule } from './mainpage-routing.module';
import { IntroduceMetaversePage } from './introduce-metaverse/introduce-metaverse.page';
import { JoinpagePage } from './joinpage/joinpage.page';
import { LoginpagePage } from './loginpage/loginpage.page';
import { FirstpagePage } from './firstpage/firstpage.page';
import { LandingPage } from './landingpage/landingpage';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MainPageRoutingModule,
  ],
  declarations: [FirstpagePage, IntroduceMetaversePage, JoinpagePage, LoginpagePage, LandingPage]
})
export class MainPageModule {}