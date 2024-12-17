import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ExhibitionService } from '../../../services/exhibition/exhibitionservice.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-exhibition-details',
  templateUrl: './exhibition-details.page.html',
  styleUrls: ['./exhibition-details.page.scss'],
})

export class ExhibitionDetailsPage implements OnInit {

  exhibitionId: number | null = null;
  exhibitionDetails: any = null;
  isLoading: boolean = true;
  error: string | null = null;
  imageUrl: string | null = null; // 프리사인드 URL을 저장할 변수 추가
  streamingUrl: SafeResourceUrl;
  showStreaming: boolean = false;
  showButtons: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exhibitionService: ExhibitionService,
    private alertController: AlertController,
    private sanitizer: DomSanitizer
  ) {
    this.streamingUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://127.0.0.1/');
  }

  toggleStreaming() {
    this.showStreaming = !this.showStreaming;
  }

  ngOnInit() {
    this.exhibitionId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('전시물 ID:', this.exhibitionId); // ID 확인
    this.loadExhibitionDetails();
  }

  loadExhibitionDetails() {
    if (this.exhibitionId) {
      this.isLoading = true;
      this.exhibitionService.getAllExhibitionDetails(this.exhibitionId).subscribe(
        (data) => {
          console.log('API 응답:', data); // 응답 확인
          this.exhibitionDetails = data.exhibition; // exhibition 객체 할당
          this.loadPresignedUrl(this.exhibitionDetails.exhibition_id); // 전시물 프리사인드 URL 요청
          this.loadMemberSignedUrls(); // 멤버 프리사인드 URL 요청
          this.loadDocSignedUrls(); // 문서 프리사인드 URL 요청
          this.isLoading = false;
        },
        (error) => {
          console.error('전시관 상세 정보 로딩 실패:', error);
          this.error = '전시관 정보를 불러오는 데 실패했습니다.';
          this.isLoading = false;
        }
      );
    }
  }

  loadPresignedUrl(exhibitionId: number) {
    this.exhibitionService.getPresignedUrls(exhibitionId).subscribe(
      (response) => {
        this.imageUrl = response.url; // 프리사인드 URL 저장
        console.log('프리사인드 URL:', this.imageUrl); // 디버깅용 로그
      },
      (error) => {
        console.error('프리사인드 URL 로딩 실패:', error);
        this.error = '프리사인드 URL을 불러오는 데 실패했습니다.';
      }
    );
  }

  loadMemberSignedUrls() {
    if (this.exhibitionDetails && this.exhibitionDetails.exhibitionMembers) {
      this.exhibitionDetails.exhibitionMembers.forEach((member: { exhibition_member_id: number; signedUrl: string; }) => {
        this.exhibitionService.getMemberSignedUrl(member.exhibition_member_id).subscribe(
          (response) => {
            member.signedUrl = response.url; // 멤버의 프리사인드 URL 저장
            console.log('멤버 프리사인드 URL:', member.signedUrl);
          },
          (error) => {
            console.error('멤버 프리사인드 URL 로딩 실패:', error);
            this.error = '멤버 프리사인드 URL을 불러오는 데 실패했습니다.';
          }
        );
      });
    }
  }

  loadDocSignedUrls() {
    if (this.exhibitionDetails && this.exhibitionDetails.exhibitionDocs) {
      this.exhibitionDetails.exhibitionDocs.forEach((doc: { exhibition_doc_id: number; signedUrl: string; }) => {
        this.exhibitionService.getDocSignedUrl(doc.exhibition_doc_id).subscribe(
          (response) => {
            doc.signedUrl = response.url; // 문서의 프리사인드 URL 저장
            console.log('문서 프리사인드 URL:', doc.signedUrl);
          },
          (error) => {
            console.error('문서 프리사인드 URL 로딩 실패:', error);
            this.error = '문서 프리사인드 URL을 불러오는 데 실패했습니다.';
          }
        );
      });
    }
  }



  toggleButtons() {
    this.showButtons = !this.showButtons; // 현재 상태 반전
  }

  openStreamingInNewTab() {
    const streamingUrl = 'http://127.0.0.1/'; // 실제 스트리밍 URL로 변경해야 합니다
    window.open(streamingUrl, '_blank');
  }

  async deleteExhibition() {
    const alert = await this.alertController.create({
      header: '전시물 삭제',
      message: '정말로 이 전시물을 삭제하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        },
        {
          text: '삭제',
          handler: () => {
            if (this.exhibitionId) {
              this.exhibitionService.deleteExhibition(this.exhibitionId.toString()).subscribe(
                () => {
                  console.log('전시물이 성공적으로 삭제되었습니다.');
                  this.router.navigate(['/exhibitionmain']).then(() => {
                    window.location.reload(); // 페이지 새로고침
                  });
                },
                (error) => {
                  console.error('전시물 삭제 실패:', error);
                }
              );
            }
          }
        }
      ]
    });
    await alert.present();
  }
}