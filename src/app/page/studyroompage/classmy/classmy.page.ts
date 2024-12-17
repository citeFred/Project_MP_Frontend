import { Component, OnInit } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { VideoTopicRequestData } from '../../../models/course/video_topic/video_topic-request.interface';
import { CourseService } from '../../../services/course/course.service';
import { ApiResponse } from '../../../models/common/api-response.interface';
import { ClassmyResponseData } from '../../../models/course/dummy/classmy/classmy-response.interface'
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { VideoCreateModalComponent } from '../../../component/video-create-modal/video-create-modal.component';
import { Registration, Role } from 'src/app/models/enums/role.enums';
import { HttpErrorResponse } from '@angular/common/http';
import { VideoTopicResponseData } from 'src/app/models/course/video_topic/video_topic-response.interface';
import { VideoService } from 'src/app/services/course/video.service';

@Component({
  selector: 'app-classmy',
  templateUrl: './classmy.page.html',
  styleUrls: ['./classmy.page.scss'],
})
export class ClassmyPage implements OnInit {
  course_id: number = 0;
  private routeSubscription?: Subscription;
  userRole: string = '';

  public data: ClassmyResponseData = {
    VideoTopics: [],
    activeSection: 'lecture',
    isEmptyState: true,
    lectureItems: []
  };

  constructor(
    private courseService: CourseService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private videoService: VideoService
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

  // approved인지 확인하는 메서드
  private async checkApprovalStatus(courseId: number): Promise<boolean> {
    console.log('Checking approval for courseId:', courseId);
    const userIdString = localStorage.getItem('UserId') || '';
    console.log(userIdString);
    const userId = Number(userIdString);
    try {
        if (!courseId || courseId === 0) {
            return false;
        }

        // 강사인 경우 항상 접근 허용
        if (this.isInstructor()) {
            return true;
        }

        // 해당 courseId에 대한 registration 정보만 조회
        const response = await firstValueFrom(
            this.courseService.getRegistration(courseId, userId)
        );

        console.log('API Response:', response.data);
        console.log('API Response2:', response.data.course_registration_id);
        console.log('API Response3:', response.data.user);
        console.log('API Response4:', response.data.course);
        console.log('check1:', response?.data.course_registration_status === Registration.APPROVED)
        console.log('check2:', Number(response.data.user?.user_id) === userId)
        console.log('check3:', response.data.course?.course_id === courseId)

        // null 체크와 타입 검사를 포함한 조건문
        const isApproved = Boolean(
          response?.data.course_registration_status === Registration.APPROVED &&
          Number(response.data.user?.user_id) === userId &&
          response.data.course?.course_id === courseId
        );

      console.log('Approval status:', isApproved);
      return isApproved;

    } catch (error) {
        console.error('Approval check failed:', error);
        if (error instanceof HttpErrorResponse) {
            switch (error.status) {
                case 401:
                    this.router.navigate(['/loginpage']);
                    break;
                case 404:
                    console.error('Course not found');
                    break;
                default:
                    console.error('API error:', error);
            }
        }
        return false;
    }
}

  // ngOnInit 수정
  async ngOnInit() {
    this.userRole = localStorage.getItem('Role') || '';
    
    // 관리자는 접근 불가
    if (this.userRole === Role.ADMIN) {
        this.router.navigate(['/registration-admin']);
        this.showAlert('오류', '관리자는 강의 상세를 볼 수 없습니다.');
        return;
    }

    try {
        // URL 파라미터에서 course_id 가져오기
        this.route.params.subscribe(params => {
            this.course_id = Number(params['course_id']);
            console.log('URL course_id:', this.course_id);
        });

        // course_id가 유효한지 확인
        if (!this.course_id) {
            console.error('Invalid course_id');
            this.router.navigate(['/classnone']);
            return;
        }

        const isApproved = await this.checkApprovalStatus(this.course_id);
        if (!isApproved) {
            this.router.navigate(['/classnone']);
            return;
        }

        // 강의 데이터 로드
        await this.loadCourses();
        
    } catch (error) {
        console.error('Course ID 처리 중 오류 발생:', error);
        this.router.navigate(['/classnone']);
    }
}

  // 강사 권한 체크
  isInstructor(): boolean {
    return this.userRole === Role.INSTRUCTOR;
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async loadCourses() {
    try {
      const response: ApiResponse<VideoTopicResponseData[]> = await firstValueFrom(
        this.courseService.getAllVideoTopic(this.course_id)
      );
  
      this.data.VideoTopics = response.data;
  
      if (this.data.VideoTopics.length === 0) {
        console.log('비디오 주제가 없습니다.');
      } else {
        console.log('로드된 비디오 주제:', this.data.VideoTopics);
      }
    } catch (error) {
      console.error('Error loading courses', error);
    }
  }

  // 모든 비디오 토픽을 가져오는 메서드
  async getAllVideoTopics() {
      try {
        const response: ApiResponse<VideoTopicResponseData[]> = await firstValueFrom(
          this.courseService.getAllVideoTopic(this.course_id)
        );
    
        this.data.VideoTopics = response.data;

        if (this.data.VideoTopics.length === 0) {
          console.log('비디오 주제가 없습니다.');
        } else {
          console.log('로드된 비디오 주제:', this.data.VideoTopics);
        }
      } catch (error) {
        console.error('비디오 주제 로드 중 오류 발생', error);
      }
  }

  setActiveSection(section: ClassmyResponseData['activeSection']) {
    this.data.activeSection = section;
    if (section === 'material') {
      // 학습자료 클릭 시 URL 변경
      this.router.navigate([`/classmy/${this.course_id}/doc-topics`]);
    }
  }

  // 새로운 항목을 추가하고 초기 상태를 해제
  addFirstLectureItem() {
      this.data.isEmptyState = false;  // 초기 상태를 해제
      this.data.lectureItems.push({ title: '', newCourseTitle: '' }); // 첫 항목 추가
  }

  // index 위치에 새로운 항목을 추가하는 메서드
  addLectureItem(index: number) {
      this.data.lectureItems.splice(index + 1, 0, { title: '', newCourseTitle: '' });
  }

  async deleteVideoTopic(courseId: number, videoTopicId: number) {
      const confirmed = confirm('이 비디오 주제를 삭제하시겠습니까?'); // 삭제 확인 다이얼로그
      if (!confirmed) {
        return; // 사용자가 삭제를 취소한 경우
      }
      try {
        const response: ApiResponse<void> = await firstValueFrom(this.courseService.deleteVideoTopic(courseId, videoTopicId)); // 비디오 주제 삭제 API 호출
        console.log(response.message); // 삭제 성공 메시지 출력
        // this.loadCourses(); // 삭제 후 목록 갱신
        this.refreshPage();
      } catch (error) {
        console.error('비디오 주제 삭제 중 오류 발생', error);
      }
  }


  async updateVideoTopic(courseId: number, videoTopicId: number, videoTopicData: VideoTopicRequestData) {
    try{
      const response: ApiResponse<VideoTopicRequestData> = await firstValueFrom(this.courseService.updateVideoTopic(courseId, videoTopicId, videoTopicData));
      console.log(response.message); // 삭제 성공 메시지 출력
      this.loadCourses();
    } catch (error) {
      console.error('비디오 수정 중 오류가 발생했습니다.', error);
    }
  }

  // 비디오 주제를 생성하는 메서드
  async videotopicRegister(i: number) {
      // null 체크를 명시적으로 수행
      if (!this.course_id) {
        console.error('courseId가 없습니다.');
        return;
      }
      const lectureItem = this.data.lectureItems[i]; // 현재 항목 가져오기
      if (!lectureItem.newCourseTitle) {
        return; // 제목이 없으면 실행하지 않음
      }

      const video_topic_title =  { video_topic_title: lectureItem.newCourseTitle }

      console.log('전송할 비디오 주제 데이터:', video_topic_title); // 확인용 로그

      try {
        // firstValueFrom은 Observable의 첫번째 값을 Promise로 변환하여 비동기로 처리, API 호출 완료까지 대기하는 메서드
        const response = await firstValueFrom(
          this.courseService.createVideoTopic(this.course_id, video_topic_title)
        );
        console.log('비디오 주제가 성공적으로 생성되었습니다:', response);
        alert('비디오 주제가 성공적으로 생성되었습니다!');

        // 새 비디오 주제 정보를 lectureItem에 저장
        lectureItem.title = lectureItem.newCourseTitle; // 성공적으로 생성 후 제목 설정
        lectureItem.newCourseTitle = ''; // 입력 초기화
        // this.loadCourses();
        this.refreshPage();
      } catch (error) {
        console.error('비디오 주제 생성 중 오류 발생:', error);
        alert('비디오 주제 생성에 실패했습니다.');
      }
  }

  async openVideoCreateModal(videoTopicId: number | null) {
    if (!videoTopicId) {
      alert('올바른 비디오 토픽이 아닙니다.');
      return;
    }
    const modal = await this.modalController.create({
      component: VideoCreateModalComponent,
      componentProps: {
        courseId: this.course_id,
        videoTopicId: videoTopicId  // 파라미터로 받은 VideoTopic ID를 전달
      }
    });

    const result = await modal.present();
    return result;
  }

  openVideoStream(videoId: number, videoTopicId: number) {
    
    console.log(videoId);
    console.log(videoTopicId)

    this.route.params.subscribe(params => {
      this.course_id = Number(params['course_id']);
      console.log('URL course_id:', this.course_id);
    });

    const state = {
      courseId: this.course_id,
      videoTopicId: videoTopicId,
      videoId: videoId
    };

    console.log('State before encoding:', state);
    
    // state를 base64로 인코딩하여 URL 파라미터로 전달
    const stateParam = btoa(JSON.stringify(state));
    console.log(stateParam);

    const url = `/video-stream?state=${stateParam}`;
    console.log(url);
    
    window.open(url, '_blank', 'width=1280,height=720');
  }
  
  getTotalVideosCount(): number {
    return this.data.VideoTopics.reduce((total, videoTopic) => {
      // videos 배열이 있는 경우에만 length를 더함
      return total + (videoTopic.videos?.length || 0);
    }, 0);
  }

  async handleStarClick(videoId: number, videoTopicId: number) {
    // 현재 course_id를 route parameters에서 가져옵니다
    this.route.params.subscribe(params => {
      this.course_id = Number(params['course_id']);
      console.log('URL course_id:', this.course_id);
    });

    console.log('비디오 ID:', videoId);
    console.log('비디오 토픽 ID:', videoTopicId);

    try {
      // service를 통해 데이터를 가져옵니다
      const response = await firstValueFrom(
        this.videoService.STTVideo(this.course_id, videoTopicId, videoId)
      );
      
    } catch (error: unknown) { // 명시적으로 unknown 타입 지정
      console.error('데이터 조회 중 오류 발생:', error);
      // 오류 발생 시 사용자에게 알립니다
      this.showAlert('오류', '데이터를 불러오는 중 문제가 발생했습니다.');
    }
  }
}

    