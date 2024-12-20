// video-create-modal.component.ts
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { VideoService } from '../../../../services/course/video.service';

interface Video {
  file: File;
  title: string;
}

@Component({
  selector: 'app-video-create-modal',
  templateUrl: './video-create-modal.component.html',
  styleUrls: ['./video-create-modal.component.scss'],
})
export class VideoCreateModalComponent implements OnInit {
  video: Video | null = null;
  courseId: number = 0;
  videoTopicId: number = 0;
  selectedFile: File | null = null;
  videoTitle: string = '';

  constructor(
    private modalController: ModalController,
    private videoService: VideoService,
    private alertController: AlertController // AlertController 주입
  ) {}

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

  ngOnInit() {
    // 모달이 열릴 때 전달받은 데이터 처리
    const currentCourse = localStorage.getItem('currentCourse');
    if (currentCourse) {
      this.courseId = JSON.parse(currentCourse).course_id;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.video = {
        file: this.selectedFile,
        title: this.videoTitle
      };

      console.log('Selected file:', this.selectedFile);
    }
  }

  async onUpload() {
    if (!this.selectedFile) {
      await this.showAlert('알림', '파일을 선택해주세요', false);
      return;
    }

    try {
      const response = await this.videoService
        .uploadVideo(this.courseId, this.videoTitle, this.videoTopicId, this.selectedFile)
        .toPromise();
        
      console.log('Upload success:', response);
      await this.showAlert('성공', '비디오가 성공적으로 업로드되었습니다.', true); // 성공 시 새로고침
      this.modalController.dismiss(true);
    } catch (error) {
      console.error('Upload failed:', error);
      await this.showAlert('실패', '업로드 중 오류가 발생했습니다.', false); // 실패 시 새로고침하지 않음
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}