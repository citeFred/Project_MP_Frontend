import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { ClassResponseDto } from 'src/app/models/course/classes/class-response.interface';
import { CourseRegistrationRequestData } from 'src/app/models/course/courses/course-registration-request.interface';
import { CourseResponseData } from 'src/app/models/course/courses/course-response.interface';
import { ClassRegistrationStatus } from 'src/app/models/enums/class-registration-status.enum';
import { VideoCreateModalComponent } from '../../admin/video-create-modal/video-create-modal.component';
import { CreateClassRegistrationDto } from 'src/app/models/course/classes/class-registration.interface';
import { CourseService } from 'src/app/services/course/course.service';
import { Registration } from 'src/app/models/enums/role.enums';

@Component({
  selector: 'app-classsignup',
  templateUrl: './class-join.page.html',
  styleUrls: ['./class-join.page.scss'],
})

export class ClassJoinPage implements OnInit {
  registeredClasss: Set<number> = new Set(); // 신청한 강의 ID를 저장할 Set
  classes: CourseResponseData[] = []; // 가져온 강의 정보를 저장할 배열
  classesRegistration : CourseRegistrationRequestData[] = [];

  constructor(
    private modalController: ModalController,
    private classService: CourseService
  ) {}

  ngOnInit() {
    this.loadClasss(); // 컴포넌트가 초기화될 때 강의 목록을 불러옴
    this.classJoinUser(); //이게 실행되면 페이지에 load가 되지 않는 오류가 있음
    this.loadRegisteredClasss(); //등록된 강의 로딩
  }

  async loadClasss() {
    try {
      const response: ApiResponse<CourseResponseData[]> = await firstValueFrom(this.classService.getAllCourses());
      this.classes = response.data; // response.data에서 배열 추출
      console.log(response)
      console.log(response.data)
    } catch (error) {
      console.error('Error loading classes', error);
    }
  }

  // 등록한 강의 로드
  loadRegisteredClasss() {
    const registeredClasss = localStorage.getItem('registeredClasss');
    if (registeredClasss) {
      this.registeredClasss = new Set(JSON.parse(registeredClasss));
    }
  }

  async createClass() {
    const modal = await this.modalController.create({
      component: VideoCreateModalComponent,
      cssClass: 'modal',
    });
    return await modal.present();
  }

  async getClassInfo(classId: number){

  }

  async updateClass(classResponseDto: ClassResponseDto) {
   // 1. 모달을 열어서 기존 강의 데이터를 전달하고 수정할 수 있게 함
    const modal = await this.modalController.create({
      component: VideoCreateModalComponent,
      cssClass: 'modal',
      componentProps: { classResponseDto } // 기존 강의 데이터를 모달에 전달
    });

    // 2. 모달이 닫힌 후의 결과 처리
    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        // 사용자가 수정을 완료하고 데이터를 반환했을 때
        try {
          const updatedClass = result.data;
          const response = await firstValueFrom(this.classService.updateCourse(classResponseDto.id, updatedClass));
          console.log('Class updated successfully:', response);

          // 3. 업데이트 후 강의 목록을 다시 불러옴
          this.loadClasss();
        } catch (error) {
          console.error('Error updating class:', error);
        }
      }
    });

    return await modal.present();
  }

  async deleteClass(classId: number) {
    const confirmed = confirm('이 강의를 삭제하시겠습니까?'); // 삭제 확인 다이얼로그
    if (!confirmed) {
      return; // 사용자가 삭제를 취소한 경우
    }
    try {
      const response: ApiResponse<void> = await firstValueFrom(this.classService.deleteCourse(classId)); // 숫자를 문자열로 변환하여 삭제 API 호출
      console.log(response.message); // 삭제 성공 메시지 출력
      this.loadClasss(); // 삭제 후 목록 갱신
    } catch (error) {
      console.error('강의 삭제 중 오류 발생', error);
    }
  }

  async getCurrentDate(): Promise<Date> {
    return new Date(); // 현재 날짜를 Date 객체로 반환
  }

  async joinClass(classId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('토큰을 찾을 수 없습니다.');
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const classReportingDate = await this.getCurrentDate(); // Date 객체 가져오기
      const registrationData: CourseRegistrationRequestData = {
        course_reporting_date: classReportingDate, // ISO 문자열로 변환하여 설정
        course_registration_status: Registration.PENDING,
      };

      const response: ApiResponse<CourseRegistrationRequestData> = await firstValueFrom(
        this.classService.joinCourse(classId, registrationData)
      );
      console.log('강의 신청 성공:', response.message);
      alert('강의 신청이 완료되었습니다.');
      this.registeredClasss.add(classId);
    } catch (error) {
      // 오류 처리 코드
      console.error('강의 신청 중 오류 발생:', error);
      alert('강의 신청 중 오류가 발생했습니다.');
    }
    //임시로 작성된 코드임, 등록한 클래스 저장하기
    this.registeredClasss.add(classId);
    localStorage.setItem('registeredClasss', JSON.stringify(Array.from(this.registeredClasss)));
  }

  //현재 강의를 신청했는지에 대한 변수
  isRegistered(classId: number): boolean {
    return this.registeredClasss.has(classId); // 강의 ID가 Set에 존재하는지 확인
  }

  //신청하기
  async classJoinUser() {
    try {
      const response: ApiResponse<any> = await firstValueFrom(this.classService.getAllJoinUsers());

      // 응답이 객체일 경우 적절히 배열로 변환
      this.classesRegistration = response.data.registrations || [];

      console.log('Loaded classes:', this.classesRegistration);
    } catch (error) {
      console.error('Error loading classes', error);
    }
  }

  acceptUser(userId: number) {
    // 유저 수락 로직을 여기에 구현
    console.log(`User ${userId} accepted.`);
  }

  rejectUser(userId: number) {
    // 유저 거절 로직을 여기에 구현
    console.log(`User ${userId} rejected.`);
  }
}