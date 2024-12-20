import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
  ],
  standalone: true
})
export class SidemenuComponent {
  classesVisible = false;
  projectsVisible = false;
  AdminMenuesVisible = false;

  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  toggleClasses() {
    this.classesVisible = !this.classesVisible;
  }
  toggleAdminMenues() {
    this.AdminMenuesVisible = !this.AdminMenuesVisible;
  }
  toggleProjects() {
    this.projectsVisible = !this.projectsVisible;
  }

  navigateTo(page: string) {
    this.router.navigate([page]);
  }
}