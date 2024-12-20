// video.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { VideoResponseData } from 'src/app/models/course/video/video-response.interface';
import { VideoRequestData } from 'src/app/models/course/video/video-request.interface';
import { VideoSummary } from 'src/app/models/course/video/video-summary.interface';
import { CourseResponseData } from 'src/app/models/course/courses/course-response.interface';
import { CourseRegistrationRequestData } from 'src/app/models/course/courses/course-registration-request.interface';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private ApiUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient) {}
  
  getAuthHeaders() {
    const token = localStorage.getItem('token'); // 또는 다른 저장소에서 토큰 가져오기
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  getFormDataAuthHeaders() {
    const token = localStorage.getItem('token'); // 또는 다른 저장소에서 토큰 가져오기
    return {
      Authorization: `Bearer ${token}`
    };
  }


  // private getAuthHeaders(): HttpHeaders {
  //   const token = localStorage.getItem('token');
  //   return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  // }
  
  uploadVideo(courseId: number, videoTitle: string, videoTopicId: number, file: File): Observable<ApiResponse<VideoRequestData>> {
    const formData = new FormData();
    console.log('File:', file);
    console.log('Video Title:', videoTitle);

    formData.append('file', file);
    formData.append('video_title', videoTitle);

    console.log('Request URL:', `${this.ApiUrl}/${courseId}/${videoTopicId}/video/upload`);
    console.log('FormData:', formData);

    const headers = this.getFormDataAuthHeaders();
    console.log('Headers:', headers);

    return this.http.post<ApiResponse<VideoRequestData>>(
      `${this.ApiUrl}/${courseId}/${videoTopicId}/video/upload`,
      formData,
      { headers }
    );
  }

  // 영상 조회(PreSignedUrl GET)
  streamVideo(courseId: number, videoTopicId: number, videoId: number): Observable<ApiResponse<VideoResponseData>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<VideoResponseData>>(`${this.ApiUrl}/${courseId}/${videoTopicId}/video/${videoId}/stream`, { headers })
  }

  STTVideo(courseId: number, videoTopicId: number, videoId: number): Observable<ApiResponse<VideoSummary>> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse<VideoSummary>>(`${this.ApiUrl}/${courseId}/${videoTopicId}/video/stt/${videoId}`, { headers })
  }
  
  // summaryVideo(courseId: number, videoTopicId: number, videoId: number): Observable<ApiResponse<VideoSummary>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<VideoSummary>>(`${this.ApiUrl}/${courseId}/${videoTopicId}/video/summary/${videoId}`, { headers })
  // }

  summaryVideo(courseId: number, videoTopicId: number, videoId: number): Observable<{ summary: string }> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ summary: string }>(`${this.ApiUrl}/${courseId}/${videoTopicId}/video/summary/${videoId}`, { headers })
  }

  // 모든 강의 정보를 불러오는 메서드
  getAllClasses(): Observable<ApiResponse<CourseResponseData[]>> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse<CourseResponseData[]>>(this.ApiUrl, { headers });
  }

  // 강의 정보 수정
  updateClass(classId: number, classData: any): Observable<ApiResponse<CourseResponseData>> {
    const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
    return this.http.patch<ApiResponse<CourseResponseData>>(`${this.ApiUrl}/class/${classId}/update`, classData, { headers }); // PUT 요청

  }

  // 강의 삭제 메서드 추가
  deleteClass(classId: number): Observable<ApiResponse<void>> {
    const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
    return this.http.delete<ApiResponse<void>>(`${this.ApiUrl}/class/${classId}/delete`, { headers }); // DELETE 요청
  }

  //수강 신청 받음
  joinClass(classId: number, registrationData: CourseRegistrationRequestData): Observable<ApiResponse<CourseRegistrationRequestData>> {
    const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
    const url = `${this.ApiUrl}/${classId}/classRegistration/register`; // 올바른 URL 구성
    return this.http.post<ApiResponse<CourseRegistrationRequestData>>(url, registrationData, { headers }); // POST 요청으로 변경
  }
  
}