import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

// @ts-ignore
import { ExhibitionmainPageRoutingModule } from './exhibitionmain-routing.module';

// @ts-ignore
import { ExhibitionmainPage } from './exhibitionmain.page';
import {TopBarComponent} from "../../../component/top-bar/top-bar.component";
import {CardComponent} from "../../../component/cardcomponent/cardcomponent.component";
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExhibitionmainPageRoutingModule,
    TopBarComponent,
    CardComponent,
    HttpClientModule
  ],
  declarations: [ExhibitionmainPage]
})
export class ExhibitionmainPageModule {}
