import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MainPageRoutingModule } from './mainpage-routing.module';
import { JoinpagePage } from './joinpage/joinpage.page';
import { LoginpagePage } from './loginpage/loginpage.page';
import { LandingPage } from './landingpage/landingpage';
import { IntroduceMetaversePage } from './introduce-metaverse/introduce-metaverse.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MainPageRoutingModule,
  ],
  declarations: [LandingPage, IntroduceMetaversePage, JoinpagePage, LoginpagePage]
})
export class MainPageModule {}