import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectmyPageRoutingModule } from './projectmy-routing.module';

import {SidemenuComponent} from "../../../component/sidemenucomponent/sidemenu.component";
import { ProjectmyPage } from './projectmy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectmyPageRoutingModule,
    SidemenuComponent
  ],
  declarations: [ProjectmyPage]  // 컴포넌트를 declarations에 추가
})
export class ProjectmyPageModule {}
