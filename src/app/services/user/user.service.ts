import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/models/common/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userApiUrl = 'http://localhost:3000/api/users'; // 회원 관련 API URL

  constructor(private http: HttpClient) {}

  modifyUser(modifyUserData: any) {
    alert("업데이트 예정");
    return this.http.get<ApiResponse<void>>(this.userApiUrl, { });
  }
  // getAuthHeaders() {
  //   const token = localStorage.getItem('token'); // 또는 다른 저장소에서 토큰 가져오기
  //   return {
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'application/json'
  //   };
  // }

  // createClass(classData: any): Observable<ApiResponse<ClassResponseDto>> {
  //   const token = localStorage.getItem('token');

  //   // 토큰이 제대로 불러와지는지 확인하는 로그
  //   if (!token) {
  //     console.error('토큰을 찾을 수 없습니다.');
  //   } else {
  //     console.log('불러온 토큰:', token);
  //   }

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`, // 인증 헤더 추가
  //   });

  //   return this.http.post<ApiResponse<ClassResponseDto>>(`${this.classApiUrl}/register`, classData, { headers });
  // }


  // /*class CRUD*/

  // // 모든 강의 정보를 불러오는 메서드
  // getAllClasses(): Observable<ApiResponse<ClassResponseDto[]>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<ClassResponseDto[]>>(this.classApiUrl, { headers });
  // }

  // // 특정 강의 정보를 불러오는 메서드
  // getOneClasses(classId: number): Observable<ApiResponse<ClassResponseDto[]>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<ClassResponseDto[]>>(`${this.classApiUrl}/${classId}/read`, { headers });
  // }

  // // 강의 정보 수정
  // updateClass(classId: number, classData: any): Observable<ApiResponse<ClassResponseDto>> {
  //   const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
  //   return this.http.patch<ApiResponse<ClassResponseDto>>(`${this.classApiUrl}/class/${classId}/update`, classData, { headers }); // PUT 요청

  // }

  // // 강의 삭제 메서드 추가
  // deleteClass(classId: number): Observable<ApiResponse<void>> {
  //   const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
  //   return this.http.delete<ApiResponse<void>>(`${this.classApiUrl}/class/${classId}/delete`, { headers }); // DELETE 요청
  // }

  // //수강 신청 받음
  // joinClass(classId: number, registrationData: CreateClassRegistrationDto): Observable<ApiResponse<CreateClassRegistrationDto>> {
  //   const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
  //   const url = `${this.classApiUrl}/${classId}/classRegistration/register`; // 올바른 URL 구성
  //   return this.http.post<ApiResponse<CreateClassRegistrationDto>>(url, registrationData, { headers }); // POST 요청으로 변경
  // }

  // getAllJoinUsers(): Observable<ApiResponse<CreateClassRegistrationDto[]>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<CreateClassRegistrationDto[]>>(this.classApiUrl, { headers });
  // }

  // // 강의 삭제 메서드 추가
  // canceljoinClass(classId: number,class_registration_id:number): Observable<ApiResponse<void>> {
  //   const headers = this.getAuthHeaders(); // 인증 헤더 가져오기
  //   return this.http.delete<ApiResponse<void>>(`${this.classApiUrl}/${classId}/classRegistration/${class_registration_id}/delete`, { headers }); // DELETE 요청
  // }

  // // 학습 자료 주제 생성(POST)
  // createDocName(classId: number, docNameData: any): Observable<ApiResponse<DocNameResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.post<ApiResponse<DocNameResponseData>>(`${this.classApiUrl}/${classId}/docNames/registerDN`, docNameData, { headers })
  // }

  // // 학습 자료 주제 조회(GET | pa_topic_id이 null인 topic 조회)
  // getFirstDocName(classId: number): Observable<ApiResponse<DocNameResponseData[]>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<DocNameResponseData[]>>(`${this.classApiUrl}/${classId}/docNames/root`, { headers })
  // }

  // //학습 주제 전체 조회
  // getAllDocName(classId: number): Observable<ApiResponse<DocNameResponseData[]>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<DocNameResponseData[]>>(`${this.classApiUrl}/${classId}/docNames/allDN`, { headers })
  // }

  // // 학습 자료 주제 조회(GET | 특정 pa_topic_id를 갖는 topic 조회) => topic_id로 특정 pa_topic_id를 갖는 topic들 반환, 즉 파라미터로 받는 topic_id를 pa_topic_id로 하는 모든 topic 조회
  // getDocName(classId: number, topicId: number): Observable<ApiResponse<DocNameResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<DocNameResponseData>>(`${this.classApiUrl}/${classId}/docNames/${topicId}/read`, { headers })
  // }

  // // 학습 자료 주제명 수정(PATCH)
  // updateDocName(classId: number, topicId: number, docNameData: any): Observable<ApiResponse<DocNameResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.patch<ApiResponse<DocNameResponseData>>(`${this.classApiUrl}/${classId}/docNames/${topicId}/update`, docNameData, { headers })
  // }

  // // 학습 자료 주제 삭제(DELETE)
  // deleteDocName(classId: number, topicId: number): Observable<ApiResponse<DocNameResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.delete<ApiResponse<DocNameResponseData>>(`${this.classApiUrl}/${classId}/docNames/${topicId}/delete`, { headers })
  // }

  // // 학습 자료 생성(POST | 파일 업로드)
  // createClassDoc(classId: number, topicId: number, ClassDocData: any): Observable<ApiResponse<ClassDocResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.post<ApiResponse<ClassDocResponseData>>(`${this.classApiUrl}/${classId}/docNames/${topicId}/classDocs/register`, ClassDocData, { headers })
  // }

  // // 학습 자료 조회(GET | 특정 topic_id에 속한 class_doc 전체 조회)
  // getAllClassDoc(classId: number, topicId: number): Observable<ApiResponse<ClassDocResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<ClassDocResponseData>>(`${this.classApiUrl}/${classId}/docNames/${topicId}/classDocs`, { headers })
  // }

  // // 학습 자료 다운로드(GET)
  // downloadClassDoc(classId: number, topicId: number, fileUrl: string): Observable<ApiResponse<ClassDocResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<ClassDocResponseData>>(`${this.classApiUrl}/${classId}/docNames/${topicId}/classDocs/download/${fileUrl}`, { headers })
  // }

  // // 학습 자료 삭제(DELETE)
  // deleteClassDoc(classId: number, topicId: number, classDocId: number): Observable<ApiResponse<ClassDocResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.delete<ApiResponse<ClassDocResponseData>>(`${this.classApiUrl}/${classId}/docNames/${topicId}/classDocs/download/${classDocId}`, { headers })
  // }

  // // 강의 영상 생성(POST)
  // createLesson(VideoTopicData: any): Observable<ApiResponse<VideoTopicResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.post<ApiResponse<VideoTopicResponseData>>(`${this.classApiUrl}/${VideoTopicData.class_id}/videoTopics/registerVT`, VideoTopicData, { headers })
  // }

  // // 강의 영상 조회(GET | 전체 조회)
  // getAllLessons(classId: number | null): Observable<ApiResponse<VideoTopicResponseData[]>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<VideoTopicResponseData[]>>(`${this.classApiUrl}/${classId}/videoTopics/allVT2`, { headers });
  // }

  // // 영상 주제 수정(PATCH)
  // updateVideoTopic(classId: number, videoTopicId: number, VideoTopicData: any): Observable<ApiResponse<VideoTopicResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.patch<ApiResponse<VideoTopicResponseData>>(`${this.classApiUrl}/${classId}/videoTopics/${videoTopicId}/update`, VideoTopicData, { headers })
  // }

  // // 강의 영상 삭제(DELETE)
  // deleteLesson(classId: number, videoTopicId: number): Observable<ApiResponse<void>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.delete<ApiResponse<void>>(`${this.classApiUrl}/${classId}/videoTopics/${videoTopicId}/delete`, { headers });
  // }

  // // 강의 영상 생성(업로드, POST)
  // createVideo(classId: number, videoTopicId: number, VideoData: any): Observable<ApiResponse<VideoResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.post<ApiResponse<VideoResponseData>>(`${this.classApiUrl}/${classId}/videoTopics/${videoTopicId}/video/upload`, VideoData, { headers })
  // }

  // // 영상 조회(스트리밍, GET) => 추가적으로 로직 작성 필요
  // streamVideo(classId: number, videoTopicId: number, videoId: number): Observable<ApiResponse<VideoResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<ApiResponse<VideoResponseData>>(`${this.classApiUrl}/${classId}/videoTopics/${videoTopicId}/video/${videoId}/stream`, { headers })
  // }

  // // 영상 삭제(DELETE)
  // deleteVideo(classId: number, videoTopicId: number, videoId: number): Observable<ApiResponse<VideoResponseData>> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.delete<ApiResponse<VideoResponseData>>(`${this.classApiUrl}/${classId}/videoTopics/${videoTopicId}/video/${videoId}/delete`, { headers })
  // }
}