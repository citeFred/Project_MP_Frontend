import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CourseService } from '../../services/course/course.service';
import { ApiResponse } from "../../models/common/api-response.interface";
import { ModalController } from '@ionic/angular';
import { CourseCreateModalComponent } from "../course-create-modal/course-create-modal.component";
import { UpdateCourseModalComponent } from "../update-course-modal/update-course-modal.component";
import { CourseResponseData } from 'src/app/models/course/courses/course-response.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-title',
  templateUrl: './course-title.component.html',
  styleUrls: ['./course-title.component.scss'],
})
export class CourseTitleComponent implements OnInit {
  courses: CourseResponseData[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  userRole: string = '';
  courseId: number = 0;

  constructor(
    private courseService: CourseService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // 사용자 역할 가져오기
    this.userRole = localStorage.getItem('Role') || '';

    // route.params에서 course_id 가져오기
    this.route.params.subscribe(params => {
      if (params['course_id']) {
        this.courseId = Number(params['course_id']);
        console.log('URL course_id:', this.courseId);
        // courseId를 localStorage에 저장
        localStorage.setItem('courseId', this.courseId.toString());
        this.loadTitleCourses();
      } else {
        // URL에 course_id가 없을 경우 localStorage에서 확인
        const storedCourseId = localStorage.getItem('courseId');
        if (storedCourseId) {
          this.courseId = Number(storedCourseId);
          this.loadTitleCourses();
        } else {
          this.errorMessage = '강좌 ID를 찾을 수 없습니다.';
          console.error('No courseId found in URL or localStorage');
        }
      }
    });
  }

  // 코스에 대한 data 반환
  async loadTitleCourses() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      if (!this.courseId) {
        throw new Error('강좌 ID가 없습니다.');
      }

      console.log('Loading courses for courseId:', this.courseId); // 디버깅 로그

      const response: ApiResponse<CourseResponseData[]> = await firstValueFrom(
        this.courseService.getOneCourses(this.courseId)
      );

      if (!response || !response.data) {
        throw new Error('서버로부터 데이터를 받지 못했습니다.');
      }

      // response.data가 배열이 아닌 단일 객체일 경우 배열로 변환
      if (!Array.isArray(response.data)) {
        this.courses = [response.data];
      } else {
        this.courses = response.data;
      }

      console.log('Loaded courses:', this.courses); // 디버깅 로그

    } catch (error) {
      console.error('Error loading courses:', error);
      this.errorMessage = error instanceof Error ? error.message : '강좌 정보를 불러오는 중 오류가 발생했습니다.';
      this.courses = [];
    } finally {
      this.isLoading = false;
    }
  }

  // 수정 모달 열기
  async openUpdateModal(course: CourseResponseData) {
    try {
      const modal = await this.modalController.create({
        component: UpdateCourseModalComponent,
        cssClass: 'modal',
        componentProps: { course }
      });

      await modal.present();

      // 모달이 닫힐 때 결과 처리
      const { data } = await modal.onWillDismiss();
      if (data?.updated) {
        // 강좌가 업데이트되었다면 목록 새로고침
        await this.loadTitleCourses();
      }
    } catch (error) {
      console.error('Error opening modal:', error);
      this.errorMessage = '모달을 여는 중 오류가 발생했습니다.';
    }
  }

  // 생성 모달 열기
  async openCreateModal() {
    try {
      const modal = await this.modalController.create({
        component: CourseCreateModalComponent,
        cssClass: 'modal'
      });

      await modal.present();

      // 모달이 닫힐 때 결과 처리
      const { data } = await modal.onWillDismiss();
      if (data?.created) {
        // 새 강좌가 생성되었다면 목록 새로고침
        await this.loadTitleCourses();
      }
    } catch (error) {
      console.error('Error opening create modal:', error);
      this.errorMessage = '모달을 여는 중 오류가 발생했습니다.';
    }
  }

  // 에러 메시지 초기화
  clearError() {
    this.errorMessage = '';
  }
}