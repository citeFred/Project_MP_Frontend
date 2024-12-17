import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../../services/course/course.service'; // 서비스 import
import { CommonModule } from '@angular/common';
import { AlertController, ModalController } from '@ionic/angular'; // AlertController import
import { firstValueFrom } from 'rxjs'; // firstValueFrom import
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-course-create-modal',
  templateUrl: './course-create-modal.component.html',
  styleUrls: ['./course-create-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ReactiveFormsModule,  // 추가된 부분
    CommonModule,

  ]
})


export class CourseCreateModalComponent implements OnInit {
  courseForm!: FormGroup;
  @Input() selectedGeneration: string = '3기';

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService, // 서비스 주입
    private modalController: ModalController,
    private alertController: AlertController // AlertController 주입
  ) {
    this.courseForm = this.formBuilder.group({
      course_title: ['', Validators.required],
      instructor_name: ['', Validators.required],
      description: ['', Validators.required],
      generation: [this.selectedGeneration, Validators.required], // generation 필드 추가
    });
  }

  refreshPage() {
    window.location.reload();
  }

  // Alert 표시 메서드
  async showAlert(header: string, message: string, refresh: boolean = false) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: '확인',
          handler: () => {
            if (refresh) {
              this.modalController.dismiss(true);
              this.refreshPage();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.courseForm.valid) {
      const courseData = this.courseForm.value;

      try {
        // firstValueFrom을 사용하여 Observable 처리
        const response = await firstValueFrom(this.courseService.createCourse(courseData));
        console.log('Course created successfully:', response);

        // 성공 시 Alert 띄우기
        await this.showAlert('성공', '클래스가 성공적으로 생성되었습니다.', true);
      } catch (error) {
        console.error('Error creating course:', error);
        // 오류 발생 시 Alert 띄우기
        await this.showAlert('실패', '클래스 생성에 실패했습니다.');
      }
    }
  }
}