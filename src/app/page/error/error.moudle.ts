import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { ErrorRoutingModule } from './error-routing.module';
import { BadRequestComponent } from './bad-request/bad-request.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorRoutingModule
  ],
  declarations: [ForbiddenComponent, BadRequestComponent]
})
export class ErrorModule {}