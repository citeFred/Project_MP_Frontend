  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';

  import { IonicModule } from '@ionic/angular';

  import { RegistrationAdminPageRoutingModule } from './registration-admin-routing.module';

  import { RegistrationAdminPage } from './registration-admin.page';

  @NgModule({
    imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      RegistrationAdminPageRoutingModule
    ],
    declarations: [RegistrationAdminPage]
  })
  export class RegistrationAdminPageModule {}
