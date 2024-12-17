import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course/course.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { DocNameResponseData } from '../../models/course/doc_name/doc_name-request.interface';
import { ApiResponse } from '../../models/common/api-response.interface';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-doc-topic',
  templateUrl: './doc-topic.component.html',
  styleUrls: ['./doc-topic.component.scss'],
})
export class DocTopicComponent implements OnInit {
  topLevelFolders: DocNameResponseData[] = [];
  subFolders: DocNameResponseData[] = [];
  currentFolder: DocNameResponseData | null = null;
  showNewTopicForm: boolean = false;
  newTopicTitle: string = ''; 
  isInputValid: boolean = false;
  isLoading = false;
  errorMessage: string | null = null;
  course_id: number = 0;
  currentTopicId: number | null = null;
  folderHistory: number[] = [];
  private routerSubscription: Subscription | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  refreshPage() {
    window.location.reload();
  }

  docTopicPage() {
    this.router.navigate([`/classmy/${this.course_id}/doc-topics`]);
  }

  // async goBack() {
  //     this.loadRootFolders();
  // }

  // goForward(topicId: number) {
  //   this.loadSubFolders(topicId);
  // }

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

  ngOnInit() {
    // URL 파라미터 변경 감지
    this.route.params.subscribe(async params => {
      this.course_id = Number(params['course_id']);
      const topicId = params['topicId'];
      
      if (topicId) {
        console.log('Topic ID detected:', topicId);  // topic_id 확인
        // 특정 폴더 보기
        await this.loadSubFolders(+topicId);
        this.currentTopicId = +topicId;
      } else {
        console.log('Loading root folders');  // root 폴더 로딩 확인
        // 루트 폴더 보기
        await this.loadRootFolders();
        this.currentTopicId = null;
      }
    });
  }

  // private async handleRouteChange() {
  //   const topicId = this.route.snapshot.params['topicId'];
    
  //   if (topicId) {
  //     // 특정 폴더 보기
  //     await this.loadSubFolders(+topicId);
  //     this.currentTopicId = +topicId;
  //   } else {
  //     // 루트 폴더 보기
  //     await this.loadRootFolders();
  //     this.currentTopicId = null;
  //   }
  // }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  async loadRootFolders() {
    this.isLoading = true;
    try {
      const response = await firstValueFrom(
        this.courseService.getFirstDocName(this.course_id)
      );
      if (response.data.pa_topic_id) {
        // 만약 pa_topic_id가 있다면 (유효성 검사)
      }
      this.topLevelFolders = Array.isArray(response.data) 
        ? response.data 
        : [response.data];
    } catch (error) {
      console.error('루트 폴더 로드 에러:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadSubFolders(topicId: number) {
    this.isLoading = true;
    try {
      const response = await firstValueFrom(
        this.courseService.getDocName(this.course_id, topicId)
      );
      
      if (response.data) {
        // 현재 폴더 정보 저장
        this.currentFolder = {
          topic_id: response.data.topic_id,
          topic_title: response.data.topic_title,
          pa_topic_id: response.data.pa_topic_id,
          course_doc: response.data.course_doc
        };
        
        // 현재 선택된 topic_id를 pa_topic_id로 가지는 폴더들만 필터링
        this.subFolders = response.data.sub_topics 
          ? response.data.sub_topics.filter(topic => topic.pa_topic_id === topicId)
          : [];
          
        this.currentTopicId = topicId;
      }
    } catch (error) {
      console.error('하위 폴더 로드 에러:', error);
      this.errorMessage = '폴더를 불러오는데 실패했습니다.';
    } finally {
      this.isLoading = false;
    }
  }

  openFolder(folder: DocNameResponseData) {
    // 현재 폴더를 새로운 상위 폴더로 설정하고 해당 폴더의 하위 폴더를 로드
    this.currentTopicId = folder.topic_id;
    
    this.loadSubFolders(folder.topic_id).then(() => {
      // 데이터 로드 후 URL 변경
      this.router.navigate([`/classmy/${this.course_id}/doc-topics/${folder.topic_id}`]);
    });
  }

  async closeFolder() {
    if (this.currentFolder?.pa_topic_id) {
      // 상위 폴더가 있는 경우
      await this.loadSubFolders(this.currentFolder.pa_topic_id);
      this.router.navigate([`/classmy/${this.course_id}/doc-topics/${this.currentFolder.pa_topic_id}`]);
    } else {
      // 루트로 이동
      await this.loadRootFolders();
      this.currentTopicId = null;
      this.router.navigate([`/classmy/${this.course_id}/doc-topics`]);
    }
  }

  showAddTopicForm() {
    this.showNewTopicForm = true;
    this.newTopicTitle = '';
    this.isInputValid = false;
  }

  validateInput() {
    this.isInputValid = this.newTopicTitle.trim() !== '';
  }

  async createTopic() {
    if (!this.isInputValid) return;

    const docTopicData = {
      topic_title: this.newTopicTitle,
      pa_topic_id: this.currentFolder ? this.currentFolder.topic_id : null
    };

    try {
      const response: ApiResponse<DocNameResponseData> = await firstValueFrom(
        this.courseService.createDocName(this.course_id, docTopicData)
      );
      console.log('폴더가 성공적으로 생성되었습니다:', response);

      if (this.currentFolder) {
        this.subFolders.push(response.data);
      } else {
        this.topLevelFolders.push(response.data);
      }

      this.newTopicTitle = '';
      this.showNewTopicForm = false;
      // this.showAlert('성공','폴더가 성공적으로 생성되었습니다.', true)
      // this.docTopicPage();
    } catch (error) {
      console.error('폴더 생성 중 오류 발생:', error);
    }
  }

  async deleteDoc(topicId: number) {
    const confirmed = confirm('이 폴더를 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await firstValueFrom(this.courseService.deleteDocName(this.course_id, topicId));
      if (this.currentFolder) {
        this.subFolders = this.subFolders.filter(folder => folder.topic_id !== topicId);
      } else {
        this.topLevelFolders = this.topLevelFolders.filter(folder => folder.topic_id !== topicId);
      }
      this.router.navigate([`/classmy/${this.course_id}/doc-topics/${topicId}`]);
    } catch (error) {
      console.error('폴더 삭제 중 오류 발생:', error);
    }
  }
}