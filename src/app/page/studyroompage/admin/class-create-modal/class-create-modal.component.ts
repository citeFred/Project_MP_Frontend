import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CourseService } from 'src/app/services/course/course.service';

@Component({
  selector: 'app-class-create-modal',
  templateUrl: './class-create-modal.component.html',
  styleUrls: ['./class-create-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
  ]
})
export class ClassCreateModalComponent implements OnInit {
  classForm!: FormGroup;
  generations: number[] = [1, 2, 3, 4]; // 1기~10기까지 기수 초기화(필요시 추가 또는 로직구성)

  constructor(
    private formBuilder: FormBuilder,
    private classService: CourseService, // 서비스 주입
    private alertController: AlertController // AlertController 주입
  ) {
    this.classForm = this.formBuilder.group({
      title: ['', Validators.required],
      instructor: ['', Validators.required],
      description: ['', Validators.required],
      generation: ['', Validators.required],
    });
  }

  ngOnInit() {
  }
  
  async onSubmit() {
    if (this.classForm.valid) {
      const classData = this.classForm.value;
      alert(JSON.stringify(classData));

      try {
        // firstValueFrom을 사용하여 Observable 처리
        const response = await firstValueFrom(this.classService.createCourse(classData));
        console.log('Class created successfully:', response);

        // 성공 시 Alert 띄우기
        await this.showAlert('성공', '코스가 성공적으로 생성되었습니다.');
      } catch (error) {
        console.error('Error creating class:', error);
        // 오류 발생 시 Alert 띄우기
        await this.showAlert('실패', '코스 생성에 실패했습니다.');
      }
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
