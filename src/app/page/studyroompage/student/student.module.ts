import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SidemenuComponent } from 'src/app/layout/sidemenucomponent/sidemenu.component';
import { ClassJoinPage } from './class-join/class-join.page';
import { ClassMyPage } from './class-my/class-my.page';
import { ProjectmyPage } from './projectmy/projectmy.page';
import { ProjectsearchPage } from './projectsearch/projectsearch.page';
// import { StudentRoutingModule } from './student-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // StudentRoutingModule,
    SidemenuComponent,
    ReactiveFormsModule
  ],
  declarations: [ClassJoinPage, ClassMyPage, ProjectmyPage, ProjectsearchPage]
})
export class StudentModule {}