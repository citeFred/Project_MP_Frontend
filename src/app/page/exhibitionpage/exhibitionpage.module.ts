import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExhibitionPageRoutingModule } from './exhibitionpage-routing.module';
import { ExhibitionDetailsPage } from './exhibition-details/exhibition-details.page';
import { ExhibitionUpdatePage } from './exhibition-update/exhibition-update.page';
import { ExhibitioncreatePage } from './exhibitioncreate/exhibitioncreate.page';
import { ExhibitionmainPage } from './exhibitionmain/exhibitionmain.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ExhibitionPageRoutingModule,
  ],
  declarations: [ExhibitionDetailsPage, ExhibitionUpdatePage, ExhibitioncreatePage, ExhibitionmainPage]
})
export class ExhibitionPageModule {}