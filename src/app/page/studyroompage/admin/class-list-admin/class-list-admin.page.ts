import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { CreateClassRegistrationDto } from 'src/app/models/course/classes/class-registration.interface';
import { ClassResponseDto } from 'src/app/models/course/classes/class-response.interface';
import { CourseService } from 'src/app/services/course/course.service';
import { ClassCreateModalComponent } from '../class-create-modal/class-create-modal.component';

@Component({
  selector: 'app-classmy',
  templateUrl: './class-list-admin.page.html',
  styleUrls: ['./class-list-admin.page.scss'],
})
export class ClassListAdminPage implements OnInit {
  classes: ClassResponseDto[] = [];
  registeredClasses: Set<number> = new Set();
  classesRegistration : CreateClassRegistrationDto[] = [];
  currentPage: number = 1;
  limit: number = 10;
  totalPages: number = 0;
  totalCount: number = 0;

  constructor(
    private classService: CourseService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadPaginatedClasses();
  }

  loadPaginatedClasses() {
    this.classService.getPaginatedClasses(this.currentPage, this.limit).subscribe({
      next: response => {
        if (response.success) {
          this.classes = response.data.classes;
          this.totalCount = response.data.totalCount;
          this.totalPages = Math.ceil(this.totalCount / this.limit);
          console.log(response.data.classes)
        } else {
          console.error(response.message);
        }
      },
      error: err => {
        console.error('Error fetching paginated classes:', err);
      },
      complete: () => {
        console.log('Fetching paginated classes request completed.');
      }
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadPaginatedClasses();
  }

  async createClass() {
    const modal = await this.modalController.create({
      component: ClassCreateModalComponent,
      cssClass: 'modal',
    });
    return await modal.present();
  }

  viewClassDetail(id: number) {
    this.router.navigate(['/classes/detail', id]);
  }

  //------------ 리팩토링 이전 기존 코드


  // 등록한 강의 로드
  loadRegisteredClasses() {
    const registeredClasses = localStorage.getItem('registeredClasses');
    if (registeredClasses) {
      this.registeredClasses = new Set(JSON.parse(registeredClasses));
    }
  }


  async updateClass(classResponseDto: ClassResponseDto) {
   // 1. 모달을 열어서 기존 강의 데이터를 전달하고 수정할 수 있게 함
    const modal = await this.modalController.create({
      component: ClassCreateModalComponent,
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
          // this.getAllClasss();
        } catch (error) {
          console.error('Error updating class:', error);
        }
      }
    });

    return await modal.present();
  }

  async deleteClass(classId: number) {
    const confirmed = confirm('이 클래스를 삭제하시겠습니까?'); // 삭제 확인 다이얼로그
    if (!confirmed) {
      return; // 사용자가 삭제를 취소한 경우
    }
    try {
      const response: ApiResponse<void> = await firstValueFrom(this.classService.deleteCourse(classId)); // 숫자를 문자열로 변환하여 삭제 API 호출
      console.log(response.message); // 삭제 성공 메시지 출력
      // this.getAllClasses(); // 삭제 후 목록 갱신
    } catch (error) {
      console.error('강의 삭제 중 오류 발생', error);
    }
  }

  async getCurrentDate(): Promise<Date> {
    return new Date(); // 현재 날짜를 Date 객체로 반환
  }

  // async joinClass(classId: number) {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     console.error('토큰을 찾을 수 없습니다.');
  //     alert('로그인이 필요합니다.');
  //     return;
  //   }

  //   try {
  //     const classReportingDate = await this.getCurrentDate(); // Date 객체 가져오기
  //     const registrationData: CreateClassRegistrationDto = {
  //       class_reporting_date: classReportingDate.toISOString(), // ISO 문자열로 변환하여 설정
  //       class_registration_status: Registration.PENDING,
  //     };

  //     const response: ApiResponse<CreateClassRegistrationDto> = await firstValueFrom(
  //       this.classService.joinClass(classId, registrationData)
  //     );
  //     console.log('강의 신청 성공:', response.message);
  //     alert('강의 신청이 완료되었습니다.');
  //     this.registeredClasses.add(classId);
  //   } catch (error) {
  //     // 오류 처리 코드
  //     console.error('강의 신청 중 오류 발생:', error);
  //     alert('강의 신청 중 오류가 발생했습니다.');
  //   }
  //   //임시로 작성된 코드임, 등록한 클래스 저장하기
  //   this.registeredClasses.add(classId);
  //   localStorage.setItem('registeredClasses', JSON.stringify(Array.from(this.registeredClasses)));
  // }

  //현재 강의를 신청했는지에 대한 변수
  isRegistered(classId: number): boolean {
    return this.registeredClasses.has(classId); // 강의 ID가 Set에 존재하는지 확인
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