import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { CourseRegistrationResponseData } from 'src/app/models/course/courses/course-registation-response.interface';
import { CourseRegistrationRequestData } from 'src/app/models/course/courses/course-registration-request.interface';
import { CourseResponseData } from 'src/app/models/course/courses/course-response.interface';
import { CourseWithCourseRegistrationResponseData } from 'src/app/models/course/courses/course-with-courseregistration-response.interface';
import { Registration } from 'src/app/models/enums/role.enums';
import { CourseService } from 'src/app/services/course/course.service';

@Component({
    selector: 'app-registration-admin',
    templateUrl: './registration-admin.page.html',
    styleUrls: ['./registration-admin.page.scss'],
})
export class RegistrationAdminPage implements OnInit {
    userRole: string = '';
    coursesList: CourseResponseData[] = [];
    CourseRegistrationResponseData: { [courseId: number]: CourseRegistrationResponseData[] } = {};
    registrationList: CourseRegistrationRequestData[] = [];
    courseId: number = Number(localStorage.getItem('courseId')) || 0; // courseId 초기화

    constructor(
        private router: Router,
        private courseService: CourseService
    ) { }

    async ngOnInit() {
        // 사용자 역할 확인
        this.userRole = localStorage.getItem('Role') || '';
        const courseId = Number(localStorage.getItem('courseId'));  // 예시: localStorage에서 courseId 가져오기
        const userId = Number(localStorage.getItem('userId'));      // 예시: localStorage에서 userId 가져오기
        await this.loadInstructorCourses();
        // courseId와 userId가 존재할 때만 courseinqueryUser 호출
        if (courseId && userId) {
        this.courseinqueryUser(courseId, userId);
        }
    }

    // 강의 목록 로드
    async loadInstructorCourses() {
        try {
        const response = await firstValueFrom(
            this.courseService.getAllCourses()  // 또는 getInstructorCourses() API가 있다면 사용
        );
        
        this.coursesList = response.data.map((course: any) => {
            return {
                ...course,
                course_registration_id: course.course_registration_id || null // 등록 ID 포함
            };
        });
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

    // 강의 신청 유저 조회하기
    async courseinqueryUser(courseId: number, userId: number) {
        try {
            const response: ApiResponse<CourseWithCourseRegistrationResponseData> = await firstValueFrom(
                this.courseService.getCourseWithCourseRegistration(courseId, userId)
            );

            if (response?.data) {
                const currentCourse = response.data; // CourseWithCourseRegistrationResponseData 전체 데이터
                const courseRegistrations = currentCourse.course_registration; // course_registration 배열
                const applicants = currentCourse.user; // user 배열

                if (!courseRegistrations.length || !applicants.length) {
                    console.error('No registrations or applicants found');
                    return;
                }

                // course_registration 배열을 매핑
                this.CourseRegistrationResponseData[courseId] = courseRegistrations.map(registration => {
                    const user = applicants.find(u => u.user_id === registration.user?.user_id) || null;
                    return {
                        course_registration_id: registration.course_registration_id,
                        course_registration_status: registration.course_registration_status,
                        course_reporting_date: new Date(registration.course_reporting_date),
                        user: user
                            ? {
                                user_id: user.user_id,
                                id: user.id || '',
                                user_name: user.user_name || '',
                                email: user.email || '',
                                user_role: user.user_role || ''
                            }
                            : undefined,
                        course: {
                            course_id: currentCourse.course_id,
                            course_title: currentCourse.course_title || '',
                            description: currentCourse.description || '',
                            instructor_name: currentCourse.instructor_name || '',
                            course_notice: currentCourse.course_notice || '',
                            generation: currentCourse.generation || ''
                        }
                    };
                });

                console.log('Mapped registration data:', this.CourseRegistrationResponseData[courseId]);
            }
        } catch (error) {
            console.error(`Error loading registrations for course ${courseId}`, error);
            alert('강의 등록 정보를 불러오는 중 오류가 발생했습니다.');
        }
    }

    // 수락 버튼, course_registration에 접근해서 status만 update
    async approveButton(courseId: number, registrationId: number) {
        try{
            const courseStatus = Registration.APPROVED;
            const registrationData: CourseRegistrationRequestData = {
                course_registration_status: courseStatus
            };
            const response = await firstValueFrom(
                this.courseService.updateRegistration(courseId, registrationId, registrationData)
            );

            console.log('back-end message:', response.message);
            alert(response.message);  // 백엔드에서 보내준 메시지 사용

        } catch (error) {
            console.error('강의 상태 수정 중 오류 발생:', error);
            let errorMessage = '강의 상태 수정 중 오류가 발생했습니다.';
    
            if (error instanceof HttpErrorResponse) {
                switch (error.status) {
                    case 400:
                        errorMessage = '잘못된 요청입니다.';
                        break;
                    case 401:
                        errorMessage = 'auth 오류.';
                        break;
                    case 409:
                        errorMessage = '이미 수정한 강의입니다.';
                        break;
                    default:
                        errorMessage = '서버 오류가 발생했습니다.';
                }
            }
    
            alert(errorMessage);
        }
    }

    // 거절 버튼, course_registration에 접근해서 status만 update
    async rejectButton(courseId: number, registrationId: number) {
        try{
            const courseStatus = Registration.REJECTED;
            const registrationData: CourseRegistrationRequestData = {
                course_registration_status: courseStatus
            };
            const response = await firstValueFrom(
                this.courseService.updateRegistration(courseId, registrationId, registrationData)
            );

            console.log('back-end message:', response.message);
            alert(response.message);  // 백엔드에서 보내준 메시지 사용

        } catch (error) {
            console.error('강의 상태 수정 중 오류 발생:', error);
            let errorMessage = '강의 상태 수정 중 오류가 발생했습니다.';
    
            if (error instanceof HttpErrorResponse) {
                switch (error.status) {
                    case 400:
                        errorMessage = '잘못된 요청입니다.';
                        break;
                    case 401:
                        errorMessage = 'auth 오류.';
                        break;
                    case 409:
                        errorMessage = '이미 수정한 강의입니다.';
                        break;
                    default:
                        errorMessage = '서버 오류가 발생했습니다.';
                }
            }
    
            alert(errorMessage);
        }
    }
}
