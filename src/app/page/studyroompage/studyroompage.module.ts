import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SidemenuComponent } from 'src/app/layout/sidemenucomponent/sidemenu.component';
import { TopBarComponent } from 'src/app/layout/top-bar/top-bar.component';
import { Studymain } from './studymain/studymain.page';
import { StudyroomPageRoutingModule } from './studyroompage-routing.module';
import { AdminModule } from './admin/admin.module';
import { StudentModule } from './student/student.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TopBarComponent,
    SidemenuComponent,
    ReactiveFormsModule,
    StudyroomPageRoutingModule,
    AdminModule,
    StudentModule
  ],
  declarations: [Studymain]
})
export class StudyroomPageModule {}