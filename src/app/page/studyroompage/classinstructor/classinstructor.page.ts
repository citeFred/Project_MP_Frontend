import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../../services/course/course.service';
import { firstValueFrom } from 'rxjs';
import { CourseResponseData } from '../../../models/course/courses/course-response.interface';
import { Role } from '../../../models/enums/role.enums';

@Component({
  selector: 'app-classinstructor',
  templateUrl: './classinstructor.page.html',
  styleUrls: ['./classinstructor.page.scss'],
})
export class ClassinstructorPage implements OnInit {
  userRole: string = '';
  coursesList: CourseResponseData[] = [];

  constructor(
    private router: Router,
    private courseService: CourseService
  ) { }

  async ngOnInit() {
    // 사용자 역할 확인
    this.userRole = localStorage.getItem('Role') || '';
    
    // 강사가 아닌 경우 리디렉션
    if (this.userRole !== Role.INSTRUCTOR) {
      this.router.navigate(['/classsignup']);
      return;
    }

    await this.loadInstructorCourses();
  }

  // 강의 목록 로드
  async loadInstructorCourses() {
    try {
      const response = await firstValueFrom(
        this.courseService.getAllCourses()  // 또는 getInstructorCourses() API가 있다면 사용
      );
      // 현재 강사의 강의만 필터링 (강사 ID로 필터링하는 로직 필요)
      this.coursesList = response.data;
      console.log('강사 강의 목록:', this.coursesList);
    } catch (error) {
      console.error('강의 목록 로드 중 오류 발생:', error);
    }
  }

  // 특정 강의의 classmy 페이지로 이동
  async enterCourse(courseId: number) {
    // const course = this.coursesList.find(c => c.course_id === courseId);
    // if (course) {
    //     // 선택한 courseId만 courseIds 배열에 저장
    //     localStorage.setItem('courseIds', JSON.stringify([courseId]));
    // }
    // 해당 강의의 classmy 페이지로 라우팅
    await this.router.navigate(['/classmy', courseId]);
  }
}