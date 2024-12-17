import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExhibitionService } from "../../../services/exhibition/exhibitionservice.service";

@Component({
  selector: 'app-exhibitionmain',
  templateUrl: './exhibitionmain.page.html',
  styleUrls: ['./exhibitionmain.page.scss'],
})
export class ExhibitionmainPage implements OnInit {
  exhibitions: any[] = [];
  filteredExhibitions: any[] = [];
  accordionTitle: string = '최신순';
  isOpen: boolean = true;
  imageUrls: { [key: number]: string | null } = {}; // 전시관 ID에 따른 이미지 URL을 저장하는 객체
  selectedGeneration1: boolean = false; // 1기 체크박스 상태
  selectedGeneration2: boolean = false; // 2기 체크박스 상태
  selectedGeneration3: boolean = false; // 3기 체크박스 상태
  searchTerm: string = ''; // 검색어를 저장할 변수

  constructor(
    private router: Router,
    private exhibitionService: ExhibitionService
  ) {}

  ngOnInit() {
    this.loadExhibitions();
  }

  loadExhibitions() {
    this.exhibitionService.getExhibitions().subscribe(
      (response: any) => {
        console.log('API 응답:', response);
        this.exhibitions = response.exhibitions; // 새로운 전시 목록 로드

        // 기수 필터링
        this.filterExhibitions();

        // 최신순으로 정렬
        this.sortExhibitions(this.accordionTitle);

        // 각 전시의 이미지를 로드
        this.filteredExhibitions.forEach(exhibition => {
          console.log('전시관 ID:', exhibition.exhibition_id);
          this.loadImage(exhibition.exhibition_id);
        });
      },
      (error) => {
        console.error('전시관 데이터 로딩 실패:', error);
      }
    );
  }
  filterExhibitions() {
    // 체크된 기수에 따라 필터링
    this.filteredExhibitions = this.exhibitions.filter(exhibition => {
      const matchesGeneration = (this.selectedGeneration1 && exhibition.generation === '1기') ||
                                (this.selectedGeneration2 && exhibition.generation === '2기') ||
                                (this.selectedGeneration3 && exhibition.generation === '3기') ||
                                (!this.selectedGeneration1 && !this.selectedGeneration2 && !this.selectedGeneration3); // 모든 체크박스가 해제된 경우

      const matchesSearchTerm = exhibition.exhibition_title.toLowerCase().includes(this.searchTerm.toLowerCase()); // 검색어 필터링

      return matchesGeneration && matchesSearchTerm; // 두 조건 모두 만족해야 함
    });

    // 최신순으로 정렬
    this.sortExhibitions(this.accordionTitle);
  }

  sortExhibitions(order: string) {
    if (order === '최신순') {
      this.filteredExhibitions.sort((a, b) => {
        return new Date(b.exhibition_date).getTime() - new Date(a.exhibition_date).getTime(); // 최신순
      });
    } else if (order === '오래된순') {
      this.filteredExhibitions.sort((a, b) => {
        return new Date(a.exhibition_date).getTime() - new Date(b.exhibition_date).getTime(); // 오래된순
      });
    }
  }

  changeTitle(newTitle: string) {
    this.accordionTitle = newTitle;
    this.isOpen = !this.isOpen;
    this.sortExhibitions(newTitle); // 제목 변경 시 정렬
  }

  navigateToExhibition(exhibitionId: number) {
    console.log('navigateToExhibition called:', exhibitionId);
    this.router.navigate(['/exhibition', exhibitionId]);
  }

  navigateToExhibitionCreate() {
    this.router.navigate(['/exhibitioncreate']);
  }

  downloadFile(exhibitionId: number) {
    this.exhibitionService.getPresignedUrls(exhibitionId).subscribe(
      (response) => {
        const fileUrl = response.url; // presigned URL 획득
        this.triggerDownload(fileUrl); // 다운로드 트리거
      },
      (error) => {
        console.error('URL 요청 실패:', error);
      }
    );
  }

  private triggerDownload(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank'; // 새 탭에서 열기
    link.download = ''; // 다운로드할 파일 이름을 지정할 수 있습니다.
    document.body.appendChild(link);
    link.click(); // 다운로드 실행
    document.body.removeChild(link); // 링크 요소 제거
  }

  loadImage(exhibitionId: number) {
    console.log('loadImage called for ID:', exhibitionId);
    if (isNaN(exhibitionId) || exhibitionId == null || exhibitionId === undefined) {
      console.error('유효하지 않은 exhibitionId:', exhibitionId);
      return; // 유효하지 않은 ID일 경우 메서드 종료
    }

    this.exhibitionService.getPresignedUrls(exhibitionId).subscribe(
      (response) => {
        console.log('Received presigned URL:', response.url);
        this.imageUrls[exhibitionId] = response.url; // 전시관 ID에 따른 presigned URL 저장
      },
      (error) => {
        console.error('URL 요청 실패:', error);
      }
    );
  }

  resetFilters() {
    this.selectedGeneration1 = false;
    this.selectedGeneration2 = false;
    this.selectedGeneration3 = false;
    this.searchTerm = ''; // 검색어 초기화
    this.loadExhibitions(); // 초기화 후 전시 목록 다시 로드
  }

  onSearchInput() {
    this.filterExhibitions();
  }

  onSearchKeyPress(event: Event) {
    if ((event as KeyboardEvent).key === 'Enter') {
      this.filterExhibitions();
    }
  }
  private colors = [ "success", 'tertiary', 'warning', 'medium', 'secondary', 'danger'];
  private colorIndex = 0;

  getBadgeColor(description: string): string {
    // description에 따라 고유한 색상 인덱스를 생성합니다.
    const index = this.hashCode(description) % this.colors.length;
    return this.colors[index];
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

}