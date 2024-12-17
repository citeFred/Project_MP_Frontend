import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgForOf } from "@angular/common";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course/course.service';
import { AuthService } from '../../services/auth/auth.service';
import { Role } from '../../models/enums/role.enums';

@Component({
   selector: 'app-sidemenu',
   templateUrl: './sidemenu.component.html',
   styleUrls: ['./sidemenu.component.scss'],
   imports: [
       IonicModule,
       RouterLink,
       NgForOf,
       RouterLinkActive,
       CommonModule,
   ],
   providers: [CourseService],
   standalone: true
})
export class SidemenuComponent implements OnInit {
   classesVisible = false;
   projectsVisible = false;
   isLoading = false;
   errorMessage: string = '';
   isAdmin: boolean = false;

   constructor(
       private router: Router,
       private courseService: CourseService,
       private authService: AuthService,
       private toastController: ToastController,
   ) { }

   ngOnInit() {
       this.validateAuthentication();
       this.isAdmin = this.authService.isUserAdmin();
       console.log('Admin status:', this.isAdmin);
   }

   // 토글 메서드
   toggleClasses() {
       this.classesVisible = !this.classesVisible;
   }

   toggleProjects() {
       this.projectsVisible = !this.projectsVisible;
   }

   // 인증 검증
   private validateAuthentication(): void {
       if (!this.authService.isAuthenticated()) {
           this.showToast('인증이 필요합니다.');
           this.router.navigate(['/loginpage']);
       }
   }

   // 알림 메서드
   async showToast(message: string, color: string = 'danger') {
       const toast = await this.toastController.create({
           message,
           duration: 3000,
           position: 'bottom',
           color
       });
       await toast.present();
   }

   // 네비게이션 메서드
   async navigateTo(page: string) {
       const userRole = localStorage.getItem('Role');
       
       try {
           if (page === 'classmy') {
               switch(userRole) {
                   case Role.STUDENT:
                        const courseId = JSON.parse(localStorage.getItem('courseId') || '[]')[0];
                       if (!courseId) {
                           await this.showToast('수강 중인 강좌가 없습니다.');
                           await this.router.navigate(['/classnone']);
                           return;
                       }

                        await this.router.navigate(['/classmy', courseId]);
                        
                       await this.showToast('강의실로 이동합니다.', 'success');
                       break;

                   case Role.INSTRUCTOR:
                       await this.router.navigate(['/classinstructor']);
                       await this.showToast('강사 페이지로 이동합니다.', 'success');
                       break;

                   case Role.ADMIN:
                       await this.router.navigate(['/classsignup']);
                       await this.showToast('수강신청 페이지로 이동합니다.', 'success');
                       break;

                   default:
                       throw new Error('유효하지 않은 사용자 권한입니다.');
               }
           } else if (page === 'classinstructor' && userRole !== Role.INSTRUCTOR) {
               await this.showToast('강사만 접근 가능한 페이지입니다.');
               await this.router.navigate(['/classnone']);
           } else if (page === 'classnone' && userRole === Role.ADMIN) {
               await this.showToast('관리자는 접근할 수 없는 페이지입니다.');
               await this.router.navigate(['/classsignup']);
           } else {
               await this.router.navigate([`/${page}`]);
           }
       } catch (error) {
           console.error('Navigation error:', error);
           await this.showToast(error instanceof Error ? error.message : '페이지 이동 중 오류가 발생했습니다.');
           await this.router.navigate(['/classnone']);
       }
   }
}