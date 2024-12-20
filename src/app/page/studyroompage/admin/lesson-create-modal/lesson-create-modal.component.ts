import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CourseService } from 'src/app/services/course/course.service';

@Component({
  selector: 'app-lesson-create-modal',
  templateUrl: './lesson-create-modal.component.html',
  styleUrls: ['./lesson-create-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
  ]
})
export class LessonCreateModalComponent implements OnInit {
  lessonVideo: File | null = null; // 출력 비디오 파일
  lessonVideoPreview: string | null = null; // 비디오 미리보기 URL

  lessonForm!: FormGroup;

  classes = [
    // 예시 코스 데이터
    { id: 1, title: 'NestJS 백엔드 웹 서버 개발', instructor: '김강사', isExpanded: false },
    { id: 2, title: 'Angular 프론트엔드 기획과 데이터바인딩', instructor: '최강사', isExpanded: false },
    { id: 3, title: 'Virtual Reality 가상현실 레벨 디자인', instructor: '김강사', isExpanded: false },
    { id: 4, title: 'VR/AR 컴포넌트 프로그래밍', instructor: '이강사', isExpanded: false },
    { id: 5, title: 'Amazon Web Service 배포와 CI/CD', instructor: '김강사', isExpanded: false },
    { id: 6, title: 'Spring/SpringBoot 백엔드 프로그래밍', instructor: '김강사', isExpanded: false },
    { id: 7, title: 'Figma 서비스 기획과 React 프론트엔드 개발', instructor: '최강사', isExpanded: false },
    { id: 8, title: '취업을 위한 포트폴리오/이력서/자소서 다듬기', instructor: '김강사', isExpanded: false },
    { id: 9, title: '기술면접을 대비한 Computer Science 기초', instructor: '김강사', isExpanded: false },
    { id: 10, title: 'Java 프로그래밍 언어 기초', instructor: '김강사', isExpanded: false },
    { id: 11, title: 'C++ 프로그래밍 언어 기초', instructor: '김강사', isExpanded: false },
    { id: 12, title: 'Javascript 프로그래밍 언어 기초', instructor: '최강사', isExpanded: false },
    { id: 13, title: 'Typescript 프로그래밍 언어 기초', instructor: '최강사', isExpanded: false },
    // ... 추가 강의 데이터
    { id: 20, title: '코스 20', instructor: '강사 20', isExpanded: false }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private classService: CourseService, // 서비스 주입
    private alertController: AlertController // AlertController 주입
  ) {
    this.lessonForm = this.formBuilder.group({
      class_id: ['', Validators.required], // 코스 선택 필드 추가
      lesson_title: ['', Validators.required],
      instructor_name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }  

  ngOnInit() {}

  async onSubmit() {
    if (this.lessonForm.valid) {
      const lessonData = this.lessonForm.value;

      try {
        // firstValueFrom을 사용하여 Observable 처리
        const response = await firstValueFrom(this.classService.createCourse(lessonData));
        console.log('Lesson created successfully:', response);

        // 성공 시 Alert 띄우기
        await this.showAlert('성공', '강의가 성공적으로 업로드되었습니다.');
      } catch (error) {
        console.error('Error creating class:', error);
        // 오류 발생 시 Alert 띄우기
        await this.showAlert('실패', '강의 생성에 실패했습니다.');
      }
    }
  }

  // Lesson 비디오 파일 변경 감지
  onLessonVideoChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.lessonVideo = target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          this.lessonVideoPreview = e.target.result as string; // 비디오 미리보기 URL 저장
        }
      };
      reader.readAsDataURL(this.lessonVideo);
    }
  }

  // Alert 생성 메서드
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['확인'],
    });

    await alert.present();
  }
}
