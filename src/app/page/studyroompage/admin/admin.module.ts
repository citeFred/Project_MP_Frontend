import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdminRoutingModule } from './admin-routing.module';
import { SidemenuComponent } from 'src/app/layout/sidemenucomponent/sidemenu.component';
import { RegistrationAdminPage } from './registration-admin/registration-admin.page';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ClassnonePage } from './classnone/classnone.page';
import { ClassinstructorPage } from './classinstructor/classinstructor.page';
import { ClassListAdminPage } from './class-list-admin/class-list-admin.page';
import { LessonListAdminPage } from './lesson-list-admin/lesson-list-admin.page';
import { VideoCreateModalComponent } from './video-create-modal/video-create-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRoutingModule,
    SidemenuComponent,
    ReactiveFormsModule,
  ],
  declarations: [RegistrationAdminPage, ProjectCreateComponent, ClassnonePage, ClassinstructorPage
    , ClassListAdminPage, LessonListAdminPage, VideoCreateModalComponent
  ]
  // declarations: [LessonListAdminPage, ClassListAdminPage, ClassTitleComponent, DocTopicComponent]
})
export class AdminModule {}
