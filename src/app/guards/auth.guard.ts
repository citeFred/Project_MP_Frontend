import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CourseService } from '../services/course/course.service';
import { AuthService } from '../services/auth/auth.service';
import { Role, Registration } from '../models/enums/role.enums';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private courseService: CourseService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    try {
      if (!this.authService.isAuthenticated()) {
        await this.router.navigate(['/loginpage']);
        return false;
      }

      const userRole = this.authService.getUserRole();
      console.log('Current user role:', userRole);

      switch (userRole) {
        case Role.ADMIN:
          return this.handleAdminNavigation(state);
        case Role.INSTRUCTOR:
          return this.handleInstructorNavigation(state);
        case Role.STUDENT:
          return this.handleStudentNavigation(route, state);
        default:
          await this.router.navigate(['/loginpage']);
          return false;
      }
    } catch (error) {
      console.error('Navigation guard error:', error);
      await this.router.navigate(['/classnone']);
      return false;
    }
  }

  private handleAdminNavigation(state: RouterStateSnapshot): boolean {
    if (state.url.includes('/classsignup')) {
      return true;
    }
    this.router.navigate(['/classsignup']);
    return false;
  }

  private handleInstructorNavigation(state: RouterStateSnapshot): boolean {
    if (state.url.includes('/classinstructor') || 
        state.url.includes('/classsignup') || 
        state.url.includes('/classnone')) {
      return true;
    }
    this.router.navigate(['/classinstructor']);
    return false;
  }

  private async handleStudentNavigation(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (state.url.includes('/classinstructor')) {
      await this.router.navigate(['/classnone']);
      return false;
    }

    if (state.url.includes('/classsignup') || state.url.includes('/classnone')) {
      return true;
    }

    if (state.url.includes('/classmy')) {
      const courseId = route.paramMap.get('course_id');
      if (!courseId || courseId === '0') {
        console.log('Invalid courseId, redirecting to classnone');
        await this.router.navigate(['/classnone']);
        return false;
      }

      const isApproved = await this.checkApprovalStatus(Number(courseId));
      if (!isApproved) {
        await this.router.navigate(['/classnone']);
        return false;
      }
      return true;
    }

    await this.router.navigate(['/classnone']);
    return false;
  }

  private async checkApprovalStatus(courseId: number): Promise<boolean> {
    const userId = Number(localStorage.getItem('UserId'));
    try {
        if (!courseId || courseId === 0) {
            console.log('유효하지 않은 courseId');
            return false;
        }
        
        if (!userId) {
            console.log('UserId가 없습니다');
            return false;
        }

        const response = await firstValueFrom(
            this.courseService.getCourseWithCourseRegistration(courseId, userId)
        );

        console.log('API 응답:', response);

        if (!response?.data) {
            console.log('응답 데이터가 없습니다');
            return false;
        }

        // course_registration 배열에서 APPROVED 상태를 가진 항목 찾기
        const isApproved = response.data.course_registration.some(
            (registration) =>
                registration.course_registration_status === Registration.APPROVED &&
                registration.user?.user_id === userId
        );

        console.log('승인 상태:', isApproved);
        return isApproved;

    } catch (error) {
        console.error('승인 상태 확인 실패:', error);
        if (error instanceof HttpErrorResponse) {
            switch (error.status) {
                case 401:
                    await this.router.navigate(['/loginpage']);
                    break;
                case 404:
                    console.error('강의를 찾을 수 없습니다');
                    break;
                default:
                    console.error('API 오류:', error);
            }
        }
        return false;
    }
}

}