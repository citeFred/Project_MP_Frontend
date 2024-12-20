import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SidemenuComponent } from 'src/app/layout/sidemenucomponent/sidemenu.component';
import { AdminModule } from './admin/admin.module';
import { StudentModule } from './student/student.module';
import { StudyroomPageRoutingModule } from './studyroompage-routing.module';
import { StudyroomPageComponent } from './studyroompage.component';
import { TopBarComponent } from 'src/app/layout/top-bar/top-bar.component';
import { StudyroomPage } from './studyroom/studyroom.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TopBarComponent,
    SidemenuComponent,
    ReactiveFormsModule,
    AdminModule,
    StudentModule,
    StudyroomPageRoutingModule,
  ],
  declarations: [StudyroomPage, StudyroomPageComponent]
})
export class StudyroomPageModule {}