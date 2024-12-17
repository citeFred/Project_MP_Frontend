import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExhibitionService {
  private apiUrl = 'http://localhost:3000'; // 실제 API URL로 변경하세요.

  constructor(private http: HttpClient) {}

  getAuthHeaders() {
    const token = localStorage.getItem('token'); // 또는 다른 저장소에서 토큰 가져오기
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  private validateToken() {
    const token = localStorage.getItem('token');

    // 토큰이 제대로 불러와지는지 확인하는 로그
    if (!token) {
      console.error('토큰을 찾을 수 없습니다.');
    } else {
      console.log('불러온 토큰:', token);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // 인증 헤더 추가
    });
    return headers
  }

  // Create: 전시물 생성하기 (생성페이지)
  saveExhibitionData(data: FormData): Observable<any> {
    const headers = this.validateToken()
    return this.http.post(`${this.apiUrl}/exhibitions/register`, data, { headers });
  }

  saveIntroductions(data: FormData): Observable<any> {
    const headers = this.validateToken()
    return this.http.post(`${this.apiUrl}/exhibition-intro/register`, data, { headers });
  }

  saveMembers(data: FormData): Observable<any> {
    const headers = this.validateToken()
    return this.http.post(`${this.apiUrl}/exhibition-members/register`, data, { headers });
  }

  saveOutputs(data: FormData): Observable<any> {
    const headers = this.validateToken()
    return this.http.post(`${this.apiUrl}/exhibition-docs/register`, data, { headers });
  }

  // Read: 전시물 목록 가져오기 (메인페이지) - 프로젝트이름, 팀이름, 기수, 썸네일
  getExhibitions(): Observable<any[]> {
    const headers = this.validateToken()
    return this.http.get<any[]>(`${this.apiUrl}/exhibitions`, { headers });
  }

  // Presigned URL 요청 메소드
  getPresignedUrls(Id: number): Observable<{ url: string }> {
    const headers = this.validateToken()
    console.log('getpresingedurl 확인');
    return this.http.get<{ url: string }>(`${this.apiUrl}/exhibitions/presigned-url/${Id}`, { headers });
  }
  getMemberSignedUrl(memberId: number): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.apiUrl}/exhibition-members/presigned-url/${memberId}`);
  }

  getDocSignedUrl(docId: number): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.apiUrl}/exhibition-docs/presigned-url/${docId}`);
  }


  // Read: 특정 전시물 가져오기 (상세페이지) - 전체 내용

  // // 데이터를 병렬로 효율적으로 가져오기 위함 + 데이터의 구조를 편리한 형태로 바꿈
  // getAllExhibitionDetails(id: number): Observable<any> {
  //   return forkJoin({
  //     exhibition: this.getExhibitionDetails(id),
  //     intro: this.getExhibitionIntroDetails(id),
  //     docs: this.getExhibitionDocsDetails(id),
  //     members: this.getExhibitionMembersDetails(id)
  //   }).pipe(
  //     map(results => ({
  //       ...results.exhibition,
  //       intro: results.intro,
  //       docs: results.docs,
  //       members: results.members
  //     }))
  //   );
  // }

  // private getExhibitionDetails(id: number): Observable<any> {
  //   const headers = this.validateToken()
  //   return this.http.get<any>(`${this.apiUrl}/exhibitions/${id}`, { headers });
  // }

  // private getExhibitionIntroDetails(id: number): Observable<any> {
  //   const headers = this.validateToken()
  //   return this.http.get<any>(`${this.apiUrl}/exhibition-intro/${id}`, { headers });
  // }

  // private getExhibitionDocsDetails(id: number): Observable<any> {
  //   const headers = this.validateToken()
  //   return this.http.get<any>(`${this.apiUrl}/exhibition-docs/${id}`, { headers });
  // }

  // private getExhibitionMembersDetails(id: number): Observable<any> {
  //   const headers = this.validateToken()
  //   return this.http.get<any>(`${this.apiUrl}/exhibition-members/${id}`, { headers });
  // }
  getAllExhibitionDetails(id: number): Observable<any> {
    return this.getExhibitionDetails(id).pipe(
      map(result => ({
        // 모든 관련 정보가 포함된 exhibition 데이터를 반환
        ...result
      }))
    );
  }

  private getExhibitionDetails(id: number): Observable<any> {
    const headers = this.validateToken();
    return this.http.get<any>(`${this.apiUrl}/exhibitions/${id}`, { headers });
  }
  // Update: 전시물 수정(파일을 삭제하고 올릴 수 있게)
  updateExhibition(id: string, exhibitionData: FormData, introData: FormData, membersData: FormData, outputsData: FormData): Observable<any> {
    return forkJoin({
      exhibition: this.http.put(`${this.apiUrl}/exhibitions/${id}`, exhibitionData),
      intro: this.http.put(`${this.apiUrl}/exhibition-intro/${id}`, introData),
      members: this.http.put(`${this.apiUrl}/exhibition-members/${id}`, membersData),
      outputs: this.http.put(`${this.apiUrl}/exhibition-docs/${id}`, outputsData)
    });
  }

  // Delete: 전시물 삭제
  deleteExhibition(id: string): Observable<any> {
    const headers = this.validateToken()
    return forkJoin({
      exhibition: this.http.delete(`${this.apiUrl}/exhibitions/${id}`,{headers}),
    });
  }
}

export class ExhibitionserviceService {
}
