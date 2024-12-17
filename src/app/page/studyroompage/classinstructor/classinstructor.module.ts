import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassinstructorPageRoutingModule } from './classinstructor-routing.module';

import { ClassinstructorPage } from './classinstructor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassinstructorPageRoutingModule
  ],
  declarations: [ClassinstructorPage]
})
export class ClassinstructorPageModule {}