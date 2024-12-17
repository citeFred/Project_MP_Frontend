// src/app/services/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'; // HttpHeaders 추가
import { catchError, Observable, throwError } from 'rxjs';
import { CourseResponseData } from '../../models/course/courses/course-response.interface'; // 인터페이스 경로 수정
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { CourseWithCourseRegistrationResponseData } from 'src/app/models/course/courses/course-with-courseregistration-response.interface';
import { CourseDocRequestData } from 'src/app/models/course/course_doc/course_doc-request.interface';
import { VideoTopicRequestData } from 'src/app/models/course/video_topic/video_topic-request.interface';
import { VideoRequestData } from 'src/app/models/course/video/video-request.interface';
import { DocNameResponseData } from 'src/app/models/course/doc_name/doc_name-request.interface';
import { CourseRegistrationResponseData } from 'src/app/models/course/courses/course-registation-response.interface';
import { CourseRegistrationRequestData } from 'src/app/models/course/courses/course-registration-request.interface';
import { CourseRequestData } from 'src/app/models/course/courses/course-request.interface';
import { VideoTopicResponseData } from 'src/app/models/course/video_topic/video_topic-response.interface';


@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private courseApiUrl = 'http://localhost:3000/courses'; // 강의 관련 API URL
  /*private courseRegisApiUrl = `http://localhost:3000/courses/${courseId}/courseRegistration`; //강의 신청 관련 API URL*/


  constructor(private http: HttpClient) {}

  getAuthHeaders() {
    const token = localStorage.getItem('token'); // 또는 다른 저장소에서 토큰 가져오기
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /*course CRUD*/

  createCourse(courseData: any): Observable<ApiResponse<CourseResponseData>> {
    const token = localStorage.getItem('token');

    // 토큰이 제대로 불러와지는지 확인하는 로그
    if (!token) {
      console.error('토큰을 찾을 수 없습니다.');
    } else {
      console.log('불러온 토큰:', token);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // 인증 헤더 추가
    });

    return this.http.post<ApiResponse<CourseResponseData>>(`${this.courseApiUrl}/register`, courseData, { headers });
  }

  // 모든 강의 정보를 불러오는 메서드
  getAllCourses(): Observable<ApiResponse<CourseResponseData[]>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<CourseResponseData[]>>(`${this.courseApiUrl}/course-all`, { headers });
  }

  // 강의 삭제 메서드 추가
  deleteCourse(courseId: number): Observable<ApiResponse<void>> {
    const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
    return this.http.delete<ApiResponse<void>>(`${this.courseApiUrl}/${courseId}/delete`, { headers }); // DELETE 요청
  }

  // 특정 강의 정보를 불러오는 메서드
  getOneCourses(courseId: number): Observable<ApiResponse<CourseResponseData[]>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<CourseResponseData[]>>(`${this.courseApiUrl}/only-course-my/${courseId}`, { headers });
  }

  // 강의 정보 수정
  updateCourse(courseId: number, courseData: CourseRequestData): Observable<ApiResponse<CourseResponseData>> {
    const headers = this.getAuthHeaders();
    
    // 백엔드의 라우트 패턴에 맞게 URL 수정
    return this.http.patch<ApiResponse<CourseResponseData>>(
      `${this.courseApiUrl}/update/${courseId}`,  // 백엔드 라우트와 일치하도록 수정
      courseData,
      { headers }
    );
}

  //course join(Post)
  /*
  joinCourse(courseId: number, registrationData: Omit<CreateCourseRegistrationDto, 'userId'>): Observable<ApiResponse<CreateCourseRegistrationDto>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // 인증 헤더 추가
    }); // 인증 헤더 가져오기ㅋ

    const url = `${this.courseApiUrl}/${courseId}/courseRegistrationcourses/${courseId}/courseRegistration/register`; // courseId를 사용해 URL 구성
    return this.http.post<ApiResponse<CreateCourseRegistrationDto>>(url, registrationData, { headers });
  }
  */


  //수강 신청 보냄
  joinCourse(courseId: number, registrationData: CourseRegistrationRequestData): Observable<ApiResponse<CourseRegistrationResponseData>> {
    const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
    const url = `${this.courseApiUrl}/${courseId}/courseRegistration/register`; // 올바른 URL 구성
    return this.http.post<ApiResponse<CourseRegistrationResponseData>>(url, registrationData, { headers }); // POST 요청으로 변경
  }


  //수강신청 조회
  getRegistration(courseId: number, id: number): Observable<ApiResponse<CourseRegistrationResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<CourseRegistrationResponseData>>(`${this.courseApiUrl}/${courseId}/courseRegistration/${id}/approvedcourse`, { headers });
  }

  getCourseWithCourseRegistration(courseId: number, id: number): Observable<ApiResponse<CourseWithCourseRegistrationResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<CourseWithCourseRegistrationResponseData>>(`${this.courseApiUrl}/${courseId}/courseRegistration/${id}/approvedcourse`, { headers });
  }
    // 수강신청 상태 수정(변경)
    updateRegistration(courseId: number, id: number,  registrationData: CourseRegistrationRequestData): Observable<ApiResponse<CourseRegistrationResponseData>> {
        const headers = this.getAuthHeaders();
        return this.http.patch<ApiResponse<CourseRegistrationResponseData>>(`${this.courseApiUrl}/${courseId}/courseRegistration/${id}/update`, registrationData, { headers })
    }


  // 수강신청 취소
  canceljoinCourse(courseId: number,course_registration_id:number): Observable<ApiResponse<void>> {
    const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
    return this.http.delete<ApiResponse<void>>(`${this.courseApiUrl}/${courseId}/courseRegistration/${course_registration_id}/delete`, { headers }); // DELETE 요청
  }


  // DocName
  // 학습 자료 주제 생성(POST)
  createDocName(courseId: number, docNameData: any): Observable<ApiResponse<DocNameResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse<DocNameResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/registerDN`, docNameData, { headers })
  }
  
  private handleError(error: HttpErrorResponse) {
    console.error('API 에러:', error);
    return throwError(() => new Error('API 요청 중 오류가 발생했습니다.'));
  }

  // 학습 자료 주제 조회(GET | pa_topic_id이 null인 topic 조회)
  getFirstDocName(courseId: number): Observable<ApiResponse<DocNameResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<DocNameResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/root`, { headers }
    ).pipe(
        catchError(this.handleError)  
    );
  }

  // 학습 자료 주제 조회(GET | 특정 pa_topic_id를 갖는 topic 조회) => topic_id로 특정 pa_topic_id를 갖는 topic들 반환, 즉 파라미터로 받는 topic_id를 pa_topic_id로 하는 모든 topic 조회
  getDocName(courseId: number, topicId: number): Observable<ApiResponse<DocNameResponseData>> {
    const headers = this.getAuthHeaders();
    // URL은 doc-topics로 유지하되 API 호출만 docNames로
    return this.http.get<ApiResponse<DocNameResponseData>>(
      `${this.courseApiUrl}/${courseId}/docNames/${topicId}/read`, 
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  //학습 주제 전체 조회
  // getAllDocName(courseId: number): Observable<ApiResponse<DocNameResponseData[]>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<DocNameResponseData[]>>(`${this.courseApiUrl}/${courseId}/docNames/allDN`, { headers })
  // }

  // 학습 자료 주제명 수정(PATCH)
  updateDocName(courseId: number, topicId: number, docNameData: any): Observable<ApiResponse<DocNameResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.patch<ApiResponse<DocNameResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/${topicId}/update`, docNameData, { headers })
  }

  // 학습 자료 주제 삭제(DELETE)
  deleteDocName(courseId: number, topicId: number): Observable<ApiResponse<void>> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ApiResponse<void>>(`${this.courseApiUrl}/${courseId}/docNames/${topicId}/delete`, { headers })
  }

  // CourseDoc
  // 학습 자료 생성(POST | 파일 업로드)
  createCourseDoc(courseId: number, topicId: number, CourseDocData: any): Observable<ApiResponse<CourseDocRequestData>> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse<CourseDocRequestData>>(`${this.courseApiUrl}/${courseId}/docNames/${topicId}/courseDocs/register`, CourseDocData, { headers })
  }

  // 학습 자료 조회(GET | 특정 topic_id에 속한 course_doc 전체 조회)
  // getAllCourseDoc(courseId: number, topicId: number): Observable<ApiResponse<CourseDocResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<CourseDocResponseData>>(`${this.courseApiUrl}/${courseId}/docNames/${topicId}/courseDocs`, { headers })
  // }

  // 학습 자료 다운로드(GET)
  downloadCourseDoc(courseId: number, topicId: number, fileUrl: string): Observable<ApiResponse<CourseDocRequestData>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<CourseDocRequestData>>(`${this.courseApiUrl}/${courseId}/docNames/${topicId}/courseDocs/download/${fileUrl}`, { headers })
  }

  // 학습 자료 삭제(DELETE)
  deleteCourseDoc(courseId: number, topicId: number, courseDocId: number): Observable<ApiResponse<void>> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ApiResponse<void>>(`${this.courseApiUrl}/${courseId}/docNames/${topicId}/courseDocs/download/${courseDocId}`, { headers })
  }

  // VideoTopic
  // 영상 주제 생성(POST)
  createVideoTopic(courseId: number, VideoTopicData: any): Observable<ApiResponse<VideoTopicRequestData>> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse<VideoTopicRequestData>>(`${this.courseApiUrl}/${courseId}/videoTopics/registerVT`, VideoTopicData, { headers })
  }

  // 영상 주제 조회(GET | 전체 조회)
  getAllVideoTopic(courseId: number | null): Observable<ApiResponse<VideoTopicResponseData[]>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<VideoTopicResponseData[]>>(`${this.courseApiUrl}/${courseId}/videoTopics/allVedioTopic`, { headers });
  }

  // 영상 주제 수정(PATCH)
  updateVideoTopic(courseId: number, videoTopicId: number, VideoTopicData: VideoTopicRequestData): Observable<ApiResponse<VideoTopicResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.patch<ApiResponse<VideoTopicResponseData>>(`${this.courseApiUrl}/${courseId}/videoTopics/${videoTopicId}/update`, VideoTopicData, { headers })
  }

  // 영상 주제 삭제(DELETE)
  deleteVideoTopic(courseId: number, videoTopicId: number): Observable<ApiResponse<void>> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ApiResponse<void>>(`${this.courseApiUrl}/${courseId}/videoTopics/${videoTopicId}/delete`, { headers });
  }

  // Video
  // 영상 생성(업로드, POST)
  // createVideo(courseId: number, videoTopicId: number, VideoData: any): Observable<ApiResponse<VideoRequestData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.post<ApiResponse<VideoRequestData>>(`${this.courseApiUrl}/${courseId}/videoTopics/${videoTopicId}/video/upload`, VideoData, { headers })
  // }

  // 영상 조회(스트리밍, GET) => 추가적으로 로직 작성 필요
  // streamVideo(courseId: number, videoTopicId: number, videoId: number): Observable<ApiResponse<{ url: string }>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<{ url: string }>>(`${this.courseApiUrl}/${courseId}/${videoTopicId}/video/${videoId}/stream`, { headers })
  // }

  // 영상 삭제(DELETE)
  deleteVideo(courseId: number, videoTopicId: number, videoId: number): Observable<ApiResponse<void>> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ApiResponse<void>>(`${this.courseApiUrl}/${courseId}/videoTopics/${videoTopicId}/video/${videoId}/delete`, { headers })
  }

}