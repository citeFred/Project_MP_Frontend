import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AttendanceModalComponent } from './page/studyroompage/student/attendance-modal/attendance-modal.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SidemenuComponent } from './layout/sidemenucomponent/sidemenu.component';
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { ExhibitionComponent } from "./page/exhibitionpage/exhibition/exhibition.component";
import { CourseService } from './services/course/course.service';
import { StudyroomPageModule } from './page/studyroompage/studyroompage.module';
import { MainPageModule } from './page/mainpage/mainpage.module';
import { ExhibitionPageModule } from './page/exhibitionpage/exhibitionpage.module';
import { TopBarComponent } from './layout/top-bar/top-bar.component';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem('token');
}
@NgModule({
  declarations: [AppComponent, AttendanceModalComponent],

  imports: [BrowserModule, ReactiveFormsModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    TopBarComponent,
    SidemenuComponent,
    CommonModule,
    FormsModule,
    ExhibitionComponent,
    StudyroomPageModule,
    MainPageModule,
    ExhibitionPageModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:4200'],
        disallowedRoutes: [],
      },
    }),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, CourseService ],
  bootstrap: [AppComponent],
})
export class AppModule {}